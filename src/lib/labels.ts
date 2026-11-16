import type { CalcMethod, Category, Framework, Mandate, Verification } from '../types/index.ts';

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  scrum: 'Scrum',
  kanban: 'Kanban',
  scrumban: 'Scrumban',
  scaled: 'Scaled (SAFe or tribe-level)',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  'scrum-delivery': 'Scrum: delivery',
  'scrum-quality': 'Scrum: quality',
  'kanban-flow': 'Kanban: flow',
  'backlog-refinement': 'Backlog and refinement',
  scaled: 'Scaled (SAFe or tribe-level)',
  'jira-hygiene': 'Jira hygiene and governance',
  'outside-jira': 'Outside Jira (optional)',
};

export const MANDATE_LABELS: Record<Mandate, string> = {
  mandatory: 'Mandatory',
  recommended: 'Recommended',
  optional: 'Optional',
  'not-applicable': 'Not applicable',
};

export const CALC_METHOD_LABELS: Record<CalcMethod, string> = {
  'jql-count': 'JQL count',
  'jql-plus-gadget': 'JQL + gadget',
  'native-report': 'Built-in report',
  'export-calc': 'Export and calculate',
  'marketplace-app': 'Marketplace app',
  'external-tool': 'Outside Jira',
};

export const CALC_METHOD_DESCRIPTIONS: Record<CalcMethod, string> = {
  'jql-count': 'JQL returns this number or list directly.',
  'jql-plus-gadget':
    'JQL selects the issues; a dashboard gadget does the maths or draws the chart.',
  'native-report':
    'The number comes from a built-in board or project report. JQL only supports or narrows it.',
  'export-calc': 'JQL exports the issues; the calculation happens outside Jira.',
  'marketplace-app': 'Needs a third-party app from the Atlassian Marketplace.',
  'external-tool': 'Measured outside Jira entirely. No JQL applies.',
};

export const VERIFICATION_LABELS: Record<Verification, string> = {
  verified: 'Verified',
  'needs-verification': 'Needs verification',
};
