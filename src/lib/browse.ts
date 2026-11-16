import {
  CATEGORIES,
  type Category,
  type Framework,
  type Mandate,
  type Metric,
} from '../types/index.ts';
import { mandateSummary, type MandateSummary } from './mandates.ts';

export interface RoleMetric {
  metric: Metric;
  summary: MandateSummary;
}

export type RoleMetricGroups = Record<Mandate, RoleMetric[]>;

/**
 * Groups metrics by a role's strongest mandate. With a framework filter, only
 * metrics for that framework are included and the level for that framework
 * is used.
 */
export function metricsForRole(
  metrics: Metric[],
  roleId: string,
  framework?: Framework,
): RoleMetricGroups {
  const groups: RoleMetricGroups = {
    mandatory: [],
    recommended: [],
    optional: [],
    'not-applicable': [],
  };
  for (const metric of metrics) {
    if (framework && !metric.framework.includes(framework)) continue;
    const summary = mandateSummary(metric, roleId, framework);
    groups[summary.mandate].push({ metric, summary });
  }
  return groups;
}

export interface CategoryGroup {
  category: Category;
  metrics: Metric[];
}

/** Metrics for a framework (or all), grouped by category in the fixed category order. */
export function metricsByCategory(metrics: Metric[], framework?: Framework): CategoryGroup[] {
  return CATEGORIES.map((category) => ({
    category,
    metrics: metrics.filter(
      (metric) =>
        metric.category === category && (!framework || metric.framework.includes(framework)),
    ),
  })).filter((group) => group.metrics.length > 0);
}
