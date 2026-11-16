import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'work-in-progress',
  name: 'Work in progress (WIP)',
  framework: ['kanban', 'scrumban', 'scrum'],
  category: 'kanban-flow',
  purpose:
    'Counts the items that have been started but not finished. Keeping WIP under control is what keeps cycle time short and predictable.',
  howToRead:
    "Compare WIP with the team's WIP limits and with team size. WIP that keeps rising while throughput stays flat means work is being started faster than it is finished, so cycle times will grow. The fix is usually to stop starting and start finishing.",
  formula:
    'WIP = number of work items started but not yet finished (Kanban Guide). With statuses mapped to status categories, the count of items in the "In Progress" category is the WIP.',
  calcMethod: 'jql-count',
  cadence: 'Daily',
  misuseWarning:
    'Low WIP achieved by hiding work (not putting it on the board, or parking it in a "waiting" status outside the count) defeats the point. Do not set WIP limits for individuals to "keep them busy".',
  jql: [
    {
      edition: 'both',
      label: 'Items currently in progress (the count is the WIP)',
      jql: 'project = {{PROJECT_KEY}} AND type in ({{ISSUE_TYPES}}) AND statusCategory = "In Progress"',
      notes:
        'Only correct if every "started" status belongs to the In Progress category, including waiting states such as "Ready for test".',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'Workflow statuses assigned to the right status category.',
    'Agreed start and finish points (Definition of Workflow).',
  ],
  sources: [
    SOURCES.kanbanGuide,
    SOURCES.atlassianKanbanMetrics,
    SOURCES.dcJqlFields,
    SOURCES.cloudKbStatusCategory,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
