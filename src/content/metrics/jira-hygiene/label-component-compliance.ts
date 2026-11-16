import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'label-component-compliance',
  name: 'Label and component compliance',
  framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  category: 'jira-hygiene',
  purpose:
    'Lists items missing the labels or components your organisation relies on for filters, boards and reports.',
  howToRead:
    'Only measure fields that something actually depends on (a board filter, a dashboard, a report). If a field is missing on many items, ask whether people know about the rule, whether the field is on the create screen, and whether the rule is still needed.',
  formula:
    "Count of items created in a period with an empty label or component field. JQL returns it directly. Which fields are required is your organisation's decision.",
  calcMethod: 'jql-count',
  cadence: 'Monthly',
  misuseWarning:
    'Rules without a purpose produce junk values typed just to comply. Making a field required on the create screen is often better than measuring compliance afterwards.',
  jql: [
    {
      edition: 'both',
      label: 'Items created in a period with no component',
      jql: 'project = {{PROJECT_KEY}} AND component is EMPTY AND created >= "{{START_DATE}}" AND created <= "{{END_DATE}}"',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'Items created in a period with no labels',
      jql: 'project = {{PROJECT_KEY}} AND labels is EMPTY AND created >= "{{START_DATE}}" AND created <= "{{END_DATE}}"',
      verification: 'verified',
    },
  ],
  prerequisites: ['An agreed, written rule on which labels or components are required, and why.'],
  sources: [SOURCES.dcJqlFields, SOURCES.cloudJqlFields],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
