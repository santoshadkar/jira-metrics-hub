import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'sprint-burndown',
  name: 'Sprint burndown',
  framework: ['scrum', 'scrumban'],
  category: 'scrum-delivery',
  purpose:
    'Shows how much work is left in the current sprint day by day, so the team can see early whether the Sprint Goal is at risk.',
  howToRead:
    "Open the Burndown Chart from the board's Reports. The grey guideline runs from the total estimate at sprint start to zero at the end. The line of remaining work should trend towards zero. A flat line for several days means work is not finishing, often because items are too big. A line that steps up means scope was added. Long plateaus followed by a cliff at the end usually mean work is not being broken down small enough. Use it in the Daily Scrum to decide what to do, not to report status upwards.",
  formula:
    "Remaining work on each day = the sum of the board's estimation statistic for issues in the sprint that are not yet in the board's right-most (Done) column. The chart plots this against the guideline from the starting total to zero.",
  calcMethod: 'native-report',
  cadence: 'Daily during the sprint',
  misuseWarning:
    'A burndown that "looks good" can hide gaming: estimates lowered mid-sprint, items closed before they meet the Definition of Done, or scope quietly moved out. Never judge a team by how closely it hugs the guideline. It is a tool for the team, not a status report for managers.',
  jql: [
    {
      edition: 'both',
      label: 'Work still open in the active sprint (supporting list, not the burndown)',
      jql: 'project = {{PROJECT_KEY}} AND sprint in openSprints() AND statusCategory != Done ORDER BY status ASC',
      notes:
        "Shows what is left. The chart itself uses the board's column mapping and filter, which may differ slightly from statusCategory.",
      verification: 'verified',
    },
  ],
  prerequisites: [
    'A Scrum board with an active sprint.',
    'An estimation statistic set on the board.',
    "Statuses mapped to the board's columns correctly: the chart treats the right-most column as Done.",
  ],
  sources: [
    SOURCES.dcBurndownChart,
    SOURCES.cloudBurndownChart,
    SOURCES.atlassianAgileMetrics,
    SOURCES.dcJqlFunctions,
    SOURCES.cloudJqlFunctions,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
