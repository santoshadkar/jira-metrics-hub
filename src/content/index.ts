import {
  assembleRegistry,
  type ParsedContent,
  type RawContent,
  type RawFile,
} from '../lib/registry.ts';
import type { DashboardGuide, MetricContent } from '../types/index.ts';
import roles from './roles.ts';
import mandates from './mandates.ts';
import editionDifferences from './edition-differences.ts';

// Vite discovers every content file at build time, so adding a metric or a
// dashboard never needs an import edit here.
const metricModules = import.meta.glob<{ default: unknown }>('./metrics/**/*.ts', { eager: true });
const dashboardModules = import.meta.glob<{ default: unknown }>('./dashboards/**/*.ts', {
  eager: true,
});

const toRawFiles = (modules: Record<string, { default: unknown }>, base: string): RawFile[] =>
  Object.entries(modules).map(([path, mod]) => ({
    file: `src/content/${base}/${path.replace(`./${base}/`, '')}`,
    data: mod.default,
  }));

export const rawContent: RawContent = {
  metrics: toRawFiles(metricModules, 'metrics'),
  dashboards: toRawFiles(dashboardModules, 'dashboards'),
  roles: { file: 'src/content/roles.ts', data: roles },
  mandates: { file: 'src/content/mandates.ts', data: mandates },
  editionDifferences: { file: 'src/content/edition-differences.ts', data: editionDifferences },
};

/**
 * The build refuses invalid content (scripts/validate-content.ts runs first),
 * so production trusts it and does not ship the validator. In `npm run dev`,
 * src/main.tsx validates on start-up so authors see problems immediately.
 */
const parsed: ParsedContent = {
  metrics: rawContent.metrics.map(({ file, data }) => ({ file, metric: data as MetricContent })),
  dashboards: rawContent.dashboards.map(({ file, data }) => ({
    file,
    dashboard: data as DashboardGuide,
  })),
  roles,
  mandates,
  editionDifferences,
};

export const registry = assembleRegistry(parsed);
