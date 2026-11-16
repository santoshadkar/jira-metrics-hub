import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'bug-ratio',
  name: 'Bug ratio',
  framework: ['scrum', 'kanban', 'scrumban'],
  category: 'scrum-quality',
  purpose:
    'Shows what share of the work the team finishes is bug fixing rather than new value, so it can see whether quality problems are eating its capacity.',
  howToRead:
    'Compare the share of finished bugs over several months. A rising share means more capacity goes into fixing than building. Look at where the bugs come from before acting: old code, a rushed release, unclear requirements.',
  formula:
    'Bug ratio = bugs completed in the period ÷ all standard (non-sub-task) work items completed in the same period. Count each list with JQL and divide outside Jira.',
  calcMethod: 'export-calc',
  cadence: 'Monthly or per release',
  misuseWarning:
    'If a low bug ratio is rewarded, bugs get filed as tasks or stories. A team that fixes bugs promptly may show a higher ratio than one that ignores them. Do not compare teams that own very different code.',
  jql: [
    {
      edition: 'both',
      label: 'Bugs completed in the period (numerator)',
      jql: 'project = {{PROJECT_KEY}} AND type = Bug AND resolved >= "{{START_DATE}}" AND resolved <= "{{END_DATE}}"',
      notes: 'Relies on the workflow setting a resolution when work is done.',
      verification: 'verified',
    },
    {
      edition: 'datacenter',
      label: 'All standard work items completed in the period (denominator)',
      jql: 'project = {{PROJECT_KEY}} AND type in standardIssueTypes() AND resolved >= "{{START_DATE}}" AND resolved <= "{{END_DATE}}"',
      notes: 'standardIssueTypes() excludes sub-tasks.',
      verification: 'verified',
    },
    {
      edition: 'cloud',
      label: 'All standard work items completed in the period (denominator)',
      jql: 'project = {{PROJECT_KEY}} AND type in standardWorkTypes() AND resolved >= "{{START_DATE}}" AND resolved <= "{{END_DATE}}"',
      notes:
        'Cloud documents this function as standardWorkTypes(); Data Center calls it standardIssueTypes(). Both exclude sub-tasks.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'A Bug work type used consistently.',
    'A workflow that sets a resolution on completion.',
  ],
  sources: [
    SOURCES.dcJqlFunctions,
    SOURCES.cloudJqlFunctions,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
