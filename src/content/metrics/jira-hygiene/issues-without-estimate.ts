import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'issues-without-estimate',
  name: 'Sprint issues without estimate',
  framework: ['scrum', 'scrumban'],
  category: 'jira-hygiene',
  purpose:
    'Lists items already in the active sprint that have no estimate, because they make the burndown, velocity and commitment figures wrong.',
  howToRead:
    'For teams that estimate, every standard item in a sprint should have an estimate before the sprint starts. Items without one are invisible in estimate-based charts. Unlike "Backlog items without estimate", this looks only at committed sprint work.',
  formula:
    'Count of standard (non-sub-task) items in an open sprint with an empty estimate field. JQL returns it directly.',
  calcMethod: 'jql-count',
  cadence: 'At sprint start, and weekly',
  misuseWarning:
    'Adding placeholder estimates ("1 point each") to clear the list corrupts velocity. Only relevant for teams that forecast with estimates.',
  jql: [
    {
      edition: 'datacenter',
      label: 'Items in an open sprint without an estimate',
      jql: 'project = {{PROJECT_KEY}} AND sprint in openSprints() AND type in standardIssueTypes() AND "Story Points" is EMPTY',
      notes:
        'Check the name of your estimation field; the Data Center docs do not name the story points field. Searching by ID (cf[12345]) is safer.',
      verification: 'needs-verification',
    },
    {
      edition: 'cloud',
      label: 'Items in an open sprint without an estimate',
      jql: 'project = {{PROJECT_KEY}} AND sprint in openSprints() AND type in standardWorkTypes() AND "Story points" is EMPTY',
      notes:
        'Company-managed field shown. Team-managed spaces use "Story point estimate". Cloud names the function standardWorkTypes(); Data Center calls it standardIssueTypes().',
      verification: 'verified',
    },
  ],
  prerequisites: ['A team that estimates, with the estimation field on its work types.'],
  sources: [
    SOURCES.dcJqlFunctions,
    SOURCES.cloudJqlFunctions,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
    SOURCES.cloudMigrateSpaces,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
