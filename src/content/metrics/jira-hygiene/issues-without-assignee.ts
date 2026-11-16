import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'issues-without-assignee',
  name: 'In-progress issues without assignee',
  framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  category: 'jira-hygiene',
  purpose:
    'Lists work that is marked as started but has nobody assigned, which usually means the board no longer matches reality.',
  howToRead:
    'Started work with no assignee is either abandoned or being done by someone who has not taken it in Jira. Either way, flow metrics based on this data are off. Fix it at the daily meeting. Unassigned items that have not started are normal and are not counted here.',
  formula:
    'Count of items in the In Progress status category with an empty assignee. JQL returns it directly.',
  calcMethod: 'jql-count',
  cadence: 'Daily or weekly',
  misuseWarning:
    'Do not respond by auto-assigning items to a lead or a default user; that hides the question of who is really working on what.',
  jql: [
    {
      edition: 'both',
      label: 'Started items with no assignee',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory = "In Progress" AND assignee is EMPTY',
      verification: 'verified',
    },
  ],
  prerequisites: ['Statuses assigned to the right status category.'],
  sources: [SOURCES.dcJqlFields, SOURCES.cloudJqlFields, SOURCES.cloudKbStatusCategory],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
