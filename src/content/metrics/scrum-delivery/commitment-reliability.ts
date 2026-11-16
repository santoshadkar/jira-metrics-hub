import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'commitment-reliability',
  name: 'Commitment reliability (committed vs completed)',
  framework: ['scrum', 'scrumban'],
  category: 'scrum-delivery',
  purpose:
    'Compares what the team planned at the start of each sprint with what it actually finished, so forecasting gets more realistic over time.',
  howToRead:
    'Read the committed and completed bars of the Velocity Chart side by side. The Data Center documentation says the two bars should ideally match. Completing far less than planned, sprint after sprint, points to over-commitment, unplanned work or items that are too big. Always completing exactly 100% can mean the team is planning too cautiously. Discuss the pattern in the retrospective.',
  formula:
    'Commitment reliability for a sprint = completed estimate ÷ committed estimate, as a percentage. Both figures come from the Velocity Chart, which shows work committed and work completed for each sprint.',
  calcMethod: 'native-report',
  cadence: 'Every sprint, at the retrospective',
  misuseWarning:
    'Making this a target ("we must hit 100%") teaches teams to commit to less, pad estimates or drop quality to close items. It does not compare between teams. Never use it to rate individual developers.',
  jql: [
    {
      edition: 'datacenter',
      label: 'Items not completed in a named sprint',
      jql: 'issueFunction in incompleteInSprint("{{BOARD_NAME}}", "{{SPRINT_NAME}}")',
      requiresApp: 'ScriptRunner for Jira',
      notes:
        'incompleteInSprint is a ScriptRunner for Jira Data Center function. ScriptRunner for Jira Cloud documents that this function is not available in Cloud.',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'Everything in one sprint, to compare with the chart',
      jql: 'project = {{PROJECT_KEY}} AND sprint = "{{SPRINT_NAME}}" ORDER BY statusCategory ASC',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'A Scrum board with an estimation statistic.',
    'Sprints that are planned before they start, so there is a commitment to compare against.',
  ],
  sources: [
    SOURCES.dcVelocityChart,
    SOURCES.cloudVelocityChart,
    SOURCES.dcSprintReport,
    SOURCES.scriptRunnerDcFunctions,
    SOURCES.scriptRunnerCloudAgile,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
