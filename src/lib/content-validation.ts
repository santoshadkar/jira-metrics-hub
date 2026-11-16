import type { z } from 'zod';
import { PLACEHOLDERS, type JqlVariant } from '../types/index.ts';
import {
  DashboardGuideSchema,
  EditionDifferenceSchema,
  MandateTableSchema,
  MetricContentSchema,
  RoleSchema,
} from '../types/schemas.ts';
import type { ParsedContent, RawContent } from './registry.ts';

const PLACEHOLDER_PATTERN = /\{\{\s*([^{}]*?)\s*\}\}/g;
const KNOWN_PLACEHOLDERS = new Set<string>(PLACEHOLDERS);
const CALC_METHODS_NEEDING_JQL = new Set(['jql-count', 'jql-plus-gadget']);

export type ValidationResult =
  { ok: true; content: ParsedContent; errors: [] } | { ok: false; errors: string[] };

function formatZodIssues(where: string, error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length ? issue.path.join('.') : '(root)';
    return `${where}: ${path}: ${issue.message}`;
  });
}

/** Returns every {{NAME}} used in a JQL string that is not in the allowed list. */
export function unknownPlaceholders(jql: string): string[] {
  const unknown: string[] = [];
  for (const match of jql.matchAll(PLACEHOLDER_PATTERN)) {
    const name = match[1] ?? '';
    if (!KNOWN_PLACEHOLDERS.has(name)) unknown.push(name);
  }
  return unknown;
}

function checkJqlPlaceholders(where: string, variants: JqlVariant[], errors: string[]) {
  variants.forEach((variant, i) => {
    for (const name of unknownPlaceholders(variant.jql)) {
      errors.push(
        `${where}: jql.${i} ("${variant.label}"): unknown placeholder {{${name}}}. Allowed: ${PLACEHOLDERS.join(', ')}`,
      );
    }
  });
}

function checkDuplicateIds(kind: string, items: { id: string; where: string }[], errors: string[]) {
  const seen = new Map<string, string>();
  for (const { id, where } of items) {
    const first = seen.get(id);
    if (first) errors.push(`${where}: duplicate ${kind} id "${id}" (also in ${first})`);
    else seen.set(id, where);
  }
}

function fileBaseName(file: string): string {
  const name = file.split(/[\\/]/).pop() ?? file;
  return name.replace(/\.(ts|tsx|json)$/, '');
}

/**
 * Validates all portal content. Used by `scripts/validate-content.ts` (which
 * runs before every build) and by the test suite. Any error fails the build.
 */
export function validateContent(raw: RawContent): ValidationResult {
  const errors: string[] = [];

  // ---- Schema checks ----
  const roles = RoleSchema.array().safeParse(raw.roles.data);
  if (!roles.success) errors.push(...formatZodIssues(raw.roles.file, roles.error));

  const mandates = MandateTableSchema.safeParse(raw.mandates.data);
  if (!mandates.success) errors.push(...formatZodIssues(raw.mandates.file, mandates.error));

  const editionDifferences = EditionDifferenceSchema.array().safeParse(raw.editionDifferences.data);
  if (!editionDifferences.success) {
    errors.push(...formatZodIssues(raw.editionDifferences.file, editionDifferences.error));
  }

  const metrics: ParsedContent['metrics'] = [];
  for (const { file, data } of raw.metrics) {
    if (data === undefined) {
      errors.push(`${file}: has no default export`);
      continue;
    }
    const parsed = MetricContentSchema.safeParse(data);
    if (!parsed.success) {
      errors.push(...formatZodIssues(file, parsed.error));
      continue;
    }
    metrics.push({ file, metric: parsed.data });
  }

  const dashboards: ParsedContent['dashboards'] = [];
  for (const { file, data } of raw.dashboards) {
    if (data === undefined) {
      errors.push(`${file}: has no default export`);
      continue;
    }
    const parsed = DashboardGuideSchema.safeParse(data);
    if (!parsed.success) {
      errors.push(...formatZodIssues(file, parsed.error));
      continue;
    }
    dashboards.push({ file, dashboard: parsed.data });
  }

  // ---- Cross-reference checks (only meaningful on content that parsed) ----
  const roleList = roles.success ? roles.data : [];
  const roleIds = new Set(roleList.map((r) => r.id));
  const metricById = new Map(metrics.map(({ metric }) => [metric.id, metric]));

  checkDuplicateIds(
    'role',
    roleList.map((r) => ({ id: r.id, where: raw.roles.file })),
    errors,
  );
  checkDuplicateIds(
    'metric',
    metrics.map(({ file, metric }) => ({ id: metric.id, where: file })),
    errors,
  );
  checkDuplicateIds(
    'dashboard',
    dashboards.map(({ file, dashboard }) => ({ id: dashboard.id, where: file })),
    errors,
  );
  if (editionDifferences.success) {
    checkDuplicateIds(
      'edition difference',
      editionDifferences.data.map((d) => ({ id: d.id, where: raw.editionDifferences.file })),
      errors,
    );
  }

  for (const { file, metric } of metrics) {
    if (fileBaseName(file) !== metric.id) {
      errors.push(`${file}: file name must match metric id "${metric.id}"`);
    }
    if (metric.calcMethod === 'external-tool') {
      if (metric.jql.length > 0) {
        errors.push(`${file}: calcMethod "external-tool" must not have JQL`);
      }
      if (metric.dashboardGadget?.length) {
        errors.push(`${file}: calcMethod "external-tool" must not have Jira gadget guides`);
      }
    }
    if (CALC_METHODS_NEEDING_JQL.has(metric.calcMethod) && metric.jql.length === 0) {
      errors.push(`${file}: calcMethod "${metric.calcMethod}" needs at least one JQL variant`);
    }
    checkJqlPlaceholders(file, metric.jql, errors);
  }

  if (mandates.success) {
    const table = mandates.data;
    for (const { file, metric } of metrics) {
      if (!(metric.id in table)) {
        errors.push(
          `${raw.mandates.file}: no mandate entry for metric "${metric.id}" (${file}). Add one, even if every role is not-applicable.`,
        );
      }
    }
    for (const [metricId, entries] of Object.entries(table)) {
      const metric = metricById.get(metricId);
      if (!metric) {
        errors.push(`${raw.mandates.file}: "${metricId}" is not a known metric id`);
        continue;
      }
      const seen = new Set<string>();
      for (const entry of entries) {
        if (!roleIds.has(entry.roleId)) {
          errors.push(`${raw.mandates.file}: ${metricId}: unknown role "${entry.roleId}"`);
        }
        if (entry.framework && !metric.framework.includes(entry.framework)) {
          errors.push(
            `${raw.mandates.file}: ${metricId}: role "${entry.roleId}" uses framework "${entry.framework}", which the metric does not list`,
          );
        }
        const key = `${entry.roleId}|${entry.framework ?? '*'}`;
        if (seen.has(key)) {
          errors.push(
            `${raw.mandates.file}: ${metricId}: role "${entry.roleId}" listed twice for ${entry.framework ?? 'all frameworks'}`,
          );
        }
        seen.add(key);
      }
    }
  }

  for (const { file, dashboard } of dashboards) {
    const nestedNeedsVerification =
      dashboard.filters.some((f) => f.jql.some((v) => v.verification === 'needs-verification')) ||
      [...dashboard.gadgets.datacenter, ...dashboard.gadgets.cloud].some(
        (gadget) => gadget.verification === 'needs-verification',
      );
    if (nestedNeedsVerification && dashboard.verification === 'verified') {
      errors.push(
        `${file}: marked verified but contains filters or gadgets that need verification; mark the dashboard needs-verification`,
      );
    }
    const filterNames = dashboard.filters.map((f) => f.name);
    if (new Set(filterNames).size !== filterNames.length) {
      errors.push(`${file}: duplicate filter names`);
    }
    for (const roleId of dashboard.roleIds) {
      if (!roleIds.has(roleId)) errors.push(`${file}: unknown role "${roleId}"`);
    }
    dashboard.filters.forEach((filter, i) => {
      if (filter.metricId && !metricById.has(filter.metricId)) {
        errors.push(`${file}: filters.${i}: unknown metric "${filter.metricId}"`);
      }
      checkJqlPlaceholders(`${file}: filters.${i}`, filter.jql, errors);
    });
  }

  if (errors.length > 0 || !roles.success || !mandates.success || !editionDifferences.success) {
    return { ok: false, errors };
  }
  return {
    ok: true,
    errors: [],
    content: {
      metrics,
      dashboards,
      roles: roles.data,
      mandates: mandates.data,
      editionDifferences: editionDifferences.data,
    },
  };
}
