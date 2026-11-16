import type { Framework, Mandate, Metric, Role, RoleMandate } from '../types/index.ts';

/** Strongest first. */
export const MANDATE_ORDER: Mandate[] = ['mandatory', 'recommended', 'optional', 'not-applicable'];

export const mandateRank = (mandate: Mandate) => MANDATE_ORDER.indexOf(mandate);

type EffectiveMandate =
  RoleMandate | { roleId: string; mandate: Mandate; rationale?: undefined; framework?: Framework };

/**
 * The mandate that applies to a role for a metric in one framework. A
 * framework-specific entry wins over a general one. With no framework given,
 * only the general entry is considered. No entry means not-applicable.
 */
export function effectiveMandate(
  metric: Metric,
  roleId: string,
  framework?: Framework,
): EffectiveMandate {
  const entries = metric.roles.filter((entry) => entry.roleId === roleId);
  const specific = framework ? entries.find((entry) => entry.framework === framework) : undefined;
  const general = entries.find((entry) => !entry.framework);
  return specific ?? general ?? { roleId, mandate: 'not-applicable' };
}

export interface FrameworkMandate {
  framework: Framework;
  mandate: Mandate;
  rationale?: string;
}

export interface MandateSummary {
  /** The strongest level across the frameworks considered. */
  mandate: Mandate;
  /** One entry per framework considered, in the metric's framework order. */
  perFramework: FrameworkMandate[];
  /** True when the level differs between the frameworks considered. */
  varies: boolean;
}

/**
 * Summarises a role's mandate for a metric. With a framework filter, only that
 * framework is considered (and a metric that does not apply to it is
 * not-applicable). Without one, every framework the metric lists is considered.
 */
export function mandateSummary(
  metric: Metric,
  roleId: string,
  framework?: Framework,
): MandateSummary {
  const frameworks = framework ? metric.framework.filter((f) => f === framework) : metric.framework;
  const perFramework = frameworks.map((f) => {
    const effective = effectiveMandate(metric, roleId, f);
    return { framework: f, mandate: effective.mandate, rationale: effective.rationale };
  });
  if (perFramework.length === 0) {
    return { mandate: 'not-applicable', perFramework, varies: false };
  }
  const mandate = perFramework.reduce<Mandate>(
    (best, entry) => (mandateRank(entry.mandate) < mandateRank(best) ? entry.mandate : best),
    'not-applicable',
  );
  const varies = new Set(perFramework.map((entry) => entry.mandate)).size > 1;
  return { mandate, perFramework, varies };
}

export interface RoleMandateRow {
  role: Role;
  entries: RoleMandate[];
}

/** Roles that have at least one mandate entry for the metric, in role-list order. */
export function mandateRows(metric: Metric, roles: Role[]): RoleMandateRow[] {
  return roles
    .map((role) => ({ role, entries: metric.roles.filter((entry) => entry.roleId === role.id) }))
    .filter((row) => row.entries.length > 0);
}
