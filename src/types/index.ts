/**
 * Content types for Jira Metrics Hub.
 *
 * These interfaces are the source of truth for authors. `schemas.ts` holds the
 * matching zod schemas used for build-time validation, and a compile-time check
 * there fails the type check if the two ever drift apart.
 */

export const FRAMEWORKS = ['scrum', 'kanban', 'scrumban', 'scaled'] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export const JIRA_EDITIONS = ['datacenter', 'cloud'] as const;
export type JiraEdition = (typeof JIRA_EDITIONS)[number];

export const MANDATES = ['mandatory', 'recommended', 'optional', 'not-applicable'] as const;
export type Mandate = (typeof MANDATES)[number];

export const CALC_METHODS = [
  'jql-count', // the metric is a count or list that JQL returns directly
  'jql-plus-gadget', // JQL feeds a dashboard gadget that does the maths or chart
  'native-report', // comes from a built-in board or project report, JQL only supports it
  'export-calc', // JQL exports data, the calculation happens outside Jira
  'marketplace-app', // needs a third-party app
  'external-tool', // outside Jira entirely
] as const;
export type CalcMethod = (typeof CALC_METHODS)[number];

export const VERIFICATIONS = ['verified', 'needs-verification'] as const;
export type Verification = (typeof VERIFICATIONS)[number];

export const CATEGORIES = [
  'scrum-delivery',
  'scrum-quality',
  'kanban-flow',
  'backlog-refinement',
  'scaled',
  'jira-hygiene',
  'outside-jira',
] as const;
export type Category = (typeof CATEGORIES)[number];

/** The only placeholder names allowed in JQL (section 7 of the brief). */
export const PLACEHOLDERS = [
  'PROJECT_KEY',
  'TEAM',
  'BOARD_NAME',
  'SPRINT_NAME',
  'EPIC_KEY',
  'ISSUE_TYPES',
  'START_DATE',
  'END_DATE',
  'LABEL',
] as const;
export type Placeholder = (typeof PLACEHOLDERS)[number];

export interface Source {
  title: string;
  url: string;
  publisher: string;
  retrieved: string; // ISO date
}

export interface RoleMandate {
  roleId: string;
  mandate: Mandate;
  rationale: string; // one sentence
  /** Optional: limits this mandate to one framework. Omitted means it applies to all of the metric's frameworks. */
  framework?: Framework;
}

export interface JqlVariant {
  edition: JiraEdition | 'both';
  label: string;
  jql: string; // uses {{PLACEHOLDER}} names from PLACEHOLDERS
  notes?: string;
  requiresApp?: string;
  verification: Verification;
}

export interface GadgetGuide {
  edition: JiraEdition;
  gadgetName: string; // only a name that exists in official docs
  configuration: string[]; // ordered steps
  verification: Verification;
}

export interface Metric {
  id: string; // kebab-case, unique
  name: string;
  framework: Framework[];
  category: Category;
  purpose: string;
  howToRead: string;
  formula: string;
  calcMethod: CalcMethod;
  cadence: string;
  misuseWarning: string;
  healthyRange?: string;
  roles: RoleMandate[];
  jql: JqlVariant[];
  dashboardGadget?: GadgetGuide[];
  prerequisites: string[];
  sources: Source[];
  verification: Verification;
  lastReviewed: string; // ISO date
}

/**
 * What a metric content file exports. Mandates are kept out of metric files and
 * live in `src/content/mandates.ts`; the registry joins them into `Metric.roles`.
 */
export type MetricContent = Omit<Metric, 'roles'>;

/** Shape of `src/content/mandates.ts`: metric id → role mandates. */
export type MandateTable = Record<string, RoleMandate[]>;

export interface Role {
  id: string;
  name: string;
  description: string;
  framework: Framework[];
}

export interface DashboardFilter {
  name: string;
  purpose: string;
  jql: JqlVariant[];
  metricId?: string;
}

export interface DashboardGuide {
  id: string;
  title: string;
  roleIds: string[];
  frameworks: Framework[];
  purpose: string;
  audience: string;
  prerequisites: string[];
  filters: DashboardFilter[];
  gadgets: {
    datacenter: GadgetGuide[];
    cloud: GadgetGuide[];
  };
  sources: Source[];
  verification: Verification;
  lastReviewed: string;
}

export interface EditionDifference {
  id: string;
  topic: string;
  datacenter: string;
  cloud: string;
  whyItMatters: string;
  sources: Source[];
  verification: Verification;
  lastReviewed: string;
}
