import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'carryover',
  name: 'Carryover (spillover)',
  framework: ['scrum', 'scrumban'],
  category: 'scrum-delivery',
  purpose:
    'Shows how many items in the current sprint were already in an earlier sprint and not finished there, so the team can spot work that keeps rolling over.',
  howToRead:
    'A little carryover is normal. The same items rolling over several sprints in a row is a signal: the item is too big, blocked, or not really a priority. Look at which items carry over and why, not only at the count.',
  formula:
    'Carryover count = items in the active sprint that also belong to a closed sprint. Both Data Center and Cloud document that an issue can belong to a completed sprint and an incomplete sprint at the same time, which is what the query relies on. Carryover rate = carryover count ÷ all items in the active sprint.',
  calcMethod: 'jql-count',
  cadence: 'Every sprint, at sprint planning and the retrospective',
  misuseWarning:
    'Teams pushed to show zero carryover split items artificially at sprint end or close them before they are really done. Do not compare carryover between teams with different item sizes.',
  jql: [
    {
      edition: 'both',
      label: 'Items in the active sprint that were also in a closed sprint',
      jql: 'project = {{PROJECT_KEY}} AND sprint in openSprints() AND sprint in closedSprints() ORDER BY created ASC',
      notes:
        'The result count is the carryover count. If several teams share the project, add your board or team filter. Divide by the total in the active sprint for a rate.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'A Scrum board where unfinished items are moved into the next sprint at sprint close.',
  ],
  sources: [SOURCES.dcJqlFunctions, SOURCES.cloudJqlFunctions, SOURCES.dcSprintReport],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
