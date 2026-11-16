import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'stale-in-progress',
  name: 'Stale in-progress items',
  framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  category: 'jira-hygiene',
  purpose:
    'Lists items that say "in progress" but have not changed for weeks, which are usually abandoned and distort WIP and cycle time.',
  howToRead:
    'Each item on this list should be either restarted, moved back to the backlog, or closed. A long list means the board is not trusted or not maintained. This is a housekeeping view; for active flow management use Aging WIP.',
  formula: 'Count of In Progress items not updated in N days (30 below). JQL returns it directly.',
  calcMethod: 'jql-count',
  cadence: 'Weekly',
  misuseWarning:
    'Adding a comment just to "touch" an item removes it from the list without fixing anything.',
  jql: [
    {
      edition: 'both',
      label: 'In-progress items not updated for 30 days or more',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory = "In Progress" AND updated <= "-30d" ORDER BY updated ASC',
      notes: 'Any edit or comment counts as an update. Change -30d to your threshold.',
      verification: 'verified',
    },
  ],
  prerequisites: ['Statuses assigned to the right status category.'],
  sources: [SOURCES.dcJqlFields, SOURCES.cloudJqlFields, SOURCES.cloudKbStatusCategory],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
