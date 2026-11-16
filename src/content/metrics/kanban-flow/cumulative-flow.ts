import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'cumulative-flow',
  name: 'Cumulative flow',
  framework: ['kanban', 'scrumban', 'scrum'],
  category: 'kanban-flow',
  purpose:
    'Shows how many items sit in each workflow status over time in one picture, so the team can spot bottlenecks and growing work in progress.',
  howToRead:
    "Open the Cumulative Flow Diagram from the board's Reports. Each coloured band is a status (a board column). Parallel bands mean steady flow. A band that widens over time is, as the documentation puts it, generally a bottleneck at that column. Discuss widening bands with the team: what is piling up there, and why?",
  formula:
    'For each day, the number of items in each status, stacked. Jira draws this chart; there is no number to compute.',
  calcMethod: 'native-report',
  cadence: 'Weekly, and at retrospectives or operations reviews',
  misuseWarning:
    'A smooth CFD can come from moving cards without doing the work, or from hiding blocked items in another status. Read it with the team, not about the team.',
  jql: [],
  prerequisites: [
    'A board whose columns reflect the real workflow.',
    'Cards moved on the board as work actually progresses.',
  ],
  sources: [SOURCES.dcCumulativeFlow, SOURCES.cloudCumulativeFlow, SOURCES.atlassianAgileMetrics],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
