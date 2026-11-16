import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'epic-release-burnup',
  name: 'Epic or release burnup',
  framework: ['scrum', 'scrumban'],
  category: 'scrum-delivery',
  purpose:
    'Shows progress towards finishing an epic or a release (version) across several sprints, including how the total scope has changed, so the team can forecast when it will be done.',
  howToRead:
    'Use the Epic Burndown or Release Burndown report (both optimised for Scrum teams), or the Version Report, which plots total and completed estimate over time with a predicted release date. Compare how fast completed work grows with how fast scope grows: if scope keeps rising as fast as work is completed, the end date keeps moving. The Atlassian Agile Coach notes that scope change within epics and versions is a natural part of agile work; the point is to see it.',
  formula:
    'At any point: completed estimate vs total estimate for the epic or version. The Data Center Version Report predicts a release date from the average rate of progress (velocity) since the version started and the estimated work remaining. Jira draws these charts; the JQL only lists the items.',
  calcMethod: 'native-report',
  cadence: 'Every sprint, and at release planning',
  misuseWarning:
    'A forecast date is a range, not a promise. Treating the predicted date as a deadline leads to cut corners or hidden scope. Unestimated items are invisible in the chart, so a "nearly done" epic may not be.',
  jql: [
    {
      edition: 'datacenter',
      label: 'All items in one epic',
      jql: '"epic link" = {{EPIC_KEY}} ORDER BY statusCategory ASC',
      notes:
        'In Data Center 10.7, "parent" finds sub-tasks only; epic children are found with "epic link".',
      verification: 'verified',
    },
    {
      edition: 'cloud',
      label: 'All items in one epic',
      jql: 'parent = {{EPIC_KEY}} ORDER BY statusCategory ASC',
      notes:
        'Cloud retired Epic link in February 2024 in favour of parent, which finds all child work items in company-managed and team-managed spaces.',
      verification: 'verified',
    },
    {
      edition: 'datacenter',
      label: 'Items in the epic that have no estimate yet',
      jql: '"epic link" = {{EPIC_KEY}} AND statusCategory != Done AND "Story Points" is EMPTY',
      notes:
        'Replace "Story Points" with the name of your estimation field. The Data Center docs confirm searching custom fields by name or by ID (cf[12345], which is safer), but do not name the story points field itself, so check its name on your instance.',
      verification: 'needs-verification',
    },
    {
      edition: 'cloud',
      label: 'Items in the epic that have no estimate yet',
      jql: 'parent = {{EPIC_KEY}} AND statusCategory != Done AND "Story points" is EMPTY',
      notes:
        'Company-managed spaces use the "Story points" field; team-managed spaces use a different field, "Story point estimate". Searching by custom field ID is safer than by name.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'Epics or versions used consistently, and items linked to them.',
    'An estimation statistic on the board; unestimated items are not counted in the charts.',
  ],
  sources: [
    SOURCES.dcEpicReport,
    SOURCES.dcEpicBurndown,
    SOURCES.dcReleaseBurndown,
    SOURCES.dcVersionReport,
    SOURCES.cloudEpicBurndown,
    SOURCES.cloudReleaseBurndown,
    SOURCES.cloudVersionReport,
    SOURCES.atlassianAgileMetrics,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
    SOURCES.cloudMigrateSpaces,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
