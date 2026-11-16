import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'ready-backlog-depth',
  name: 'Ready backlog depth',
  framework: ['scrum', 'scrumban', 'kanban'],
  category: 'backlog-refinement',
  purpose:
    'Shows how much refined, ready work is waiting at the top of the backlog, so planning never starts with nothing ready to pull.',
  howToRead:
    'The Scrum Guide says items that can be Done within one sprint are deemed ready for selection at Sprint Planning. Express ready work in sprints (or weeks) of capacity. Too little means planning will stall; far too much means refinement effort is being spent so far ahead that it may be wasted. Agree as a team what depth works for you; no source sets a standard figure.',
  formula:
    'Ready backlog depth (in sprints) = total estimate of ready items ÷ recent average velocity. For flow teams: ready item count ÷ recent weekly throughput = weeks of ready work. Jira lists the ready items; the division is done outside Jira. "Ready" must be marked somehow, for example a status or a label agreed by the team.',
  calcMethod: 'export-calc',
  cadence: 'Weekly, or before each refinement session',
  misuseWarning:
    'A big "ready" pile is not a sign of a healthy team; it can mean work is being specified long before it is needed. Do not let "ready" become a gate that blocks urgent, valuable work.',
  jql: [
    {
      edition: 'both',
      label: 'Ready items not yet in a sprint (ready marked with a label)',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory = "To Do" AND labels = "{{LABEL}}" AND sprint is EMPTY ORDER BY created ASC',
      notes:
        'Put your "ready" label in the Label value. If you use a "Ready" status instead, replace the label clause with status = "Ready". Remove "sprint is EMPTY" for Kanban boards.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'An agreed way to mark an item as ready (label or status), applied consistently.',
    'Velocity or throughput history to express depth in sprints or weeks.',
  ],
  sources: [
    SOURCES.scrumGuide,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
    SOURCES.cloudKbStatusCategory,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
