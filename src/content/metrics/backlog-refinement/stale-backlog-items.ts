import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'stale-backlog-items',
  name: 'Stale backlog items',
  framework: ['scrum', 'scrumban', 'kanban'],
  category: 'backlog-refinement',
  purpose:
    'Lists backlog items nobody has touched for a long time, so the Product Owner can decide whether they still matter.',
  howToRead:
    'An item untouched for months is usually either not important or forgotten. Review the list regularly and close what no longer matters; a smaller backlog is easier to prioritise. The threshold (90 days below) is a team choice.',
  formula: 'Count of not-started items not updated in the last N days. JQL returns this directly.',
  calcMethod: 'jql-count',
  cadence: 'Monthly',
  misuseWarning:
    'Bumping items with a comment just to make them look fresh defeats the check. Closing everything old without looking can lose real customer needs.',
  jql: [
    {
      edition: 'both',
      label: 'Not-started items not updated for 90 days or more',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory = "To Do" AND updated <= "-90d" ORDER BY updated ASC',
      notes: 'Change -90d to your threshold.',
      verification: 'verified',
    },
  ],
  prerequisites: ['A Product Owner (or equivalent) who reviews and prunes the backlog.'],
  sources: [SOURCES.dcJqlFields, SOURCES.cloudJqlFields, SOURCES.cloudKbStatusCategory],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
