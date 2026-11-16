import type {
  DashboardGuide,
  EditionDifference,
  MandateTable,
  Metric,
  MetricContent,
  Role,
} from '../types/index.ts';

/** One loaded content file before validation. */
export interface RawFile {
  file: string;
  data: unknown;
}

/** Everything the portal reads from `src/content`, before validation. */
export interface RawContent {
  metrics: RawFile[];
  dashboards: RawFile[];
  roles: RawFile;
  mandates: RawFile;
  editionDifferences: RawFile;
}

/** Content that has passed validation. */
export interface ParsedContent {
  metrics: { file: string; metric: MetricContent }[];
  dashboards: { file: string; dashboard: DashboardGuide }[];
  roles: Role[];
  mandates: MandateTable;
  editionDifferences: EditionDifference[];
}

export interface Registry {
  metrics: Metric[];
  roles: Role[];
  dashboards: DashboardGuide[];
  editionDifferences: EditionDifference[];
  metricById: Map<string, Metric>;
  roleById: Map<string, Role>;
  dashboardById: Map<string, DashboardGuide>;
}

const byName = <T extends { name: string }>(a: T, b: T) => a.name.localeCompare(b.name);

/** Joins mandates into metrics and builds lookup maps. Assumes validated content. */
export function assembleRegistry(content: ParsedContent): Registry {
  const metrics: Metric[] = content.metrics
    .map(({ metric }) => ({ ...metric, roles: content.mandates[metric.id] ?? [] }))
    .sort(byName);
  const dashboards = content.dashboards
    .map(({ dashboard }) => dashboard)
    .sort((a, b) => a.title.localeCompare(b.title));

  return {
    metrics,
    roles: content.roles,
    dashboards,
    editionDifferences: content.editionDifferences,
    metricById: new Map(metrics.map((m) => [m.id, m])),
    roleById: new Map(content.roles.map((r) => [r.id, r])),
    dashboardById: new Map(dashboards.map((d) => [d.id, d])),
  };
}
