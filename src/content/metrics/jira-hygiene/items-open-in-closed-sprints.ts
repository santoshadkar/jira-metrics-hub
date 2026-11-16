import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'items-open-in-closed-sprints',
  name: 'Items open in closed sprints',
  framework: ['scrum', 'scrumban'],
  category: 'jira-hygiene',
  purpose:
    'Lists unfinished items whose only sprints are closed, so they are neither in a current or future sprint nor clearly back in the backlog.',
  howToRead:
    'These items fell through the cracks at sprint close. Decide for each: plan it into a sprint, return it to the backlog consciously, or close it.',
  formula:
    'Count of unfinished items that belong to a closed sprint but to no open or future sprint. JQL returns it directly.',
  calcMethod: 'jql-count',
  cadence: 'After each sprint closes',
  misuseWarning:
    'Bulk-closing these items to clear the list can lose real work. Look at them first.',
  jql: [
    {
      edition: 'both',
      label: 'Unfinished items left behind in closed sprints',
      jql: 'project = {{PROJECT_KEY}} AND sprint in closedSprints() AND sprint not in openSprints() AND sprint not in futureSprints() AND statusCategory != Done',
      notes: 'The sprint functions support IN and NOT IN in both editions.',
      verification: 'verified',
    },
  ],
  prerequisites: ['A Scrum board.'],
  sources: [SOURCES.dcJqlFunctions, SOURCES.cloudJqlFunctions],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
