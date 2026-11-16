import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'flow-load',
  name: 'Flow load',
  framework: ['kanban', 'scaled'],
  category: 'kanban-flow',
  purpose:
    'Counts all the work items currently in progress across a system (for example an Agile Release Train), including those that are waiting, to show whether the system is overloaded.',
  howToRead:
    'SAFe defines flow load as the number of work items currently in progress, active or waiting. It is work in progress viewed at the level of a whole value stream or train, usually counting features rather than stories. Rising flow load with flat delivery means too much is being started at once; the remedy is to start less.',
  formula:
    'Flow load = number of work items (at the level you choose, for example features) started but not finished, including waiting ones. With statuses mapped to status categories, this is the count of items in the "In Progress" category.',
  calcMethod: 'jql-count',
  cadence: 'Weekly, and at PI boundaries',
  misuseWarning:
    'Keeping work in an unstarted status while people are actually working on it lowers the number and hides the overload. Do not use it to compare trains of different sizes.',
  jql: [
    {
      edition: 'both',
      label: 'Items at the chosen level currently in progress (the count is the flow load)',
      jql: 'project = {{PROJECT_KEY}} AND type in ({{ISSUE_TYPES}}) AND statusCategory = "In Progress"',
      notes:
        'Set Issue types to the level you measure, for example Feature or Epic. Waiting statuses must also be in the In Progress category to be counted.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'A consistent work type for the level being measured (for example features).',
    'Waiting statuses assigned to the In Progress category.',
  ],
  sources: [SOURCES.safeGlossary, SOURCES.dcJqlFields, SOURCES.cloudKbStatusCategory],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
