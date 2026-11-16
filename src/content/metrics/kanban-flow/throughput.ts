import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'throughput',
  name: 'Throughput',
  framework: ['kanban', 'scrumban', 'scrum'],
  category: 'kanban-flow',
  purpose:
    'Counts how many work items the team finishes per week (or other period), which is the basis for flow-based forecasting.',
  howToRead:
    'Plot the weekly count over time. Throughput naturally varies; look for trends and sudden drops rather than week-to-week noise. A drop together with rising cycle time usually means a bottleneck. For forecasting, use the range of past throughput (for example "between 6 and 11 items a week") rather than the average.',
  formula:
    'Throughput = number of work items finished per unit of time. The Kanban Guide is explicit that this is an exact count of items, not story points or effort. Run the query once per period; the result count is the throughput for that period.',
  calcMethod: 'jql-count',
  cadence: 'Weekly',
  misuseWarning:
    'Counting items rewards splitting work into tiny pieces if throughput becomes a target. Do not compare throughput between teams whose items differ in size. Never use it per person.',
  jql: [
    {
      edition: 'both',
      label: 'Items finished in a period (the count is the throughput)',
      jql: 'project = {{PROJECT_KEY}} AND type in ({{ISSUE_TYPES}}) AND resolved >= "{{START_DATE}}" AND resolved <= "{{END_DATE}}"',
      notes:
        'Use the work types the team counts as deliverable items (for example Story, Bug, Task). Relies on the workflow setting a resolution when work finishes.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'An agreed finish point in the workflow that sets a resolution.',
    'Agreement on which work types count as items.',
  ],
  sources: [
    SOURCES.kanbanGuide,
    SOURCES.atlassianKanbanMetrics,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
