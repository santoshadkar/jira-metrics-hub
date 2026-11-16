import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'mid-sprint-scope-change',
  name: 'Mid-sprint scope change',
  framework: ['scrum', 'scrumban'],
  category: 'scrum-delivery',
  purpose:
    'Shows how much work was added to or removed from a sprint after it started, so the team can see how stable its plan really is.',
  howToRead:
    'In the Data Center Sprint Report, issues added after the sprint starts are marked with an asterisk. In the Burnup Chart, a step up in the scope line means work was added. Some change is healthy: the Scrum Guide allows scope to be clarified and renegotiated as more is learned. A lot of change every sprint means the sprint is not protected, or planning is not working.',
  formula:
    'Scope added = items (or estimate) added after sprint start. Scope removed = items taken out after sprint start. Scope change % = (added + removed) ÷ scope at sprint start. Jira shows the items; the percentage is worked out by hand or in a spreadsheet.',
  calcMethod: 'native-report',
  cadence: 'Every sprint',
  misuseWarning:
    'Punishing scope change makes teams refuse urgent, valuable work or hide it outside the sprint. The point is to see where interruptions come from, not to forbid them.',
  jql: [
    {
      edition: 'both',
      label: 'Items added after a sprint started',
      jql: 'issueFunction in addedAfterSprintStart("{{BOARD_NAME}}", "{{SPRINT_NAME}}")',
      requiresApp: 'ScriptRunner for Jira',
      notes:
        'Available in ScriptRunner for Data Center and in ScriptRunner Enhanced Search for Cloud. The Cloud documentation warns that results can be wrong for sprints that were closed and reopened.',
      verification: 'verified',
    },
    {
      edition: 'datacenter',
      label: 'Items removed from a sprint after it started',
      jql: 'issueFunction in removedAfterSprintStart("{{BOARD_NAME}}", "{{SPRINT_NAME}}")',
      requiresApp: 'ScriptRunner for Jira',
      notes:
        'ScriptRunner for Jira Cloud documents that removedAfterSprintStart is not available in Cloud.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'A Scrum board.',
    'For the queries: ScriptRunner for Jira (Data Center) or ScriptRunner Enhanced Search (Cloud).',
  ],
  sources: [
    SOURCES.dcSprintReport,
    SOURCES.cloudSprintReport,
    SOURCES.dcBurnupChart,
    SOURCES.cloudBurnupChart,
    SOURCES.scriptRunnerDcFunctions,
    SOURCES.scriptRunnerCloudAgile,
    SOURCES.atlassianAgileMetrics,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
