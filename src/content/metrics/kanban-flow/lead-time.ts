import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'lead-time',
  name: 'Lead time',
  framework: ['kanban', 'scrumban', 'scrum'],
  category: 'kanban-flow',
  purpose:
    'Shows how long customers wait: the time from when an item is logged until it is finished, including the time it waits before anyone starts it.',
  howToRead:
    "Compare lead time with cycle time. If lead time is much longer, items wait a long time before work starts, which is usually a backlog or prioritisation problem rather than a delivery problem. Look at the spread as well as the average. In Jira, the Control Chart covers both cycle time and lead time; the statuses you select as the chart's columns decide which of the two you are looking at.",
  formula:
    'Lead time for one item = finish time minus the time the item was logged (created). The Control Chart documentation defines it as the time from when an issue is logged until the work is completed.',
  calcMethod: 'native-report',
  cadence: 'Weekly or monthly',
  misuseWarning:
    'Teams can shorten lead time on paper by not logging requests until they are about to start them. That hides the real customer wait. Measure from the moment the request exists, and do not compare teams with different intake processes.',
  jql: [
    {
      edition: 'both',
      label:
        'Items finished in a period (export created and resolved dates to calculate lead time)',
      jql: 'project = {{PROJECT_KEY}} AND type in ({{ISSUE_TYPES}}) AND resolved >= "{{START_DATE}}" AND resolved <= "{{END_DATE}}" ORDER BY resolved ASC',
      notes:
        'For each item, lead time = resolved date minus created date. Relies on the workflow setting a resolution.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'Requests logged in Jira when they arrive, not when work starts.',
    'For the Control Chart: a board, with the statuses from "logged" to "done" selected as the chart\'s columns.',
  ],
  sources: [
    SOURCES.dcControlChart,
    SOURCES.cloudControlChart,
    SOURCES.atlassianKanbanMetrics,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
