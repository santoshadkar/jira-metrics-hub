import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'cycle-time',
  name: 'Cycle time',
  framework: ['kanban', 'scrumban', 'scrum'],
  category: 'kanban-flow',
  purpose:
    'Shows how long work items take from the moment the team starts them until they are finished, so the team can answer "how long will this take?" with evidence.',
  howToRead:
    "Look at the spread, not just the average. Jira's Control Chart plots each finished item as a dot, with the average, a rolling average and a standard deviation band. Dots far above the band are items worth discussing: what held them up? A wide band means the team's delivery time is unpredictable. The Control Chart does not show percentiles, which are what a service level expectation is written in (for example \"85% of items finish in N days or less\"). To get percentiles, export each item's start and finish dates and calculate them outside Jira. Lead time is a different measure: it starts when the item is logged, not when work begins.",
  formula:
    "For one finished item: cycle time = finish time minus start time, where start and finish are the points the team has defined in its workflow (Kanban Guide). If an item is reopened and worked on again, the Control Chart adds that extra time. Jira's Control Chart totals the time each issue spent in the statuses you select as columns; its average is that total divided by the number of issues.",
  calcMethod: 'native-report',
  cadence: 'Continuously; review weekly and at retrospectives',
  misuseWarning:
    'Cycle time describes the system the team works in, not how hard people work. Pushing people to "lower cycle time" leads to splitting items artificially, closing them early or moving them back to To Do to restart the clock. Comparing cycle times between teams ignores differences in work type and workflow. Never set an individual target. Change the system (WIP limits, dependencies, item size) and watch what happens to the distribution.',
  jql: [
    {
      edition: 'both',
      label: 'Items finished in a date range (export this list to calculate percentiles)',
      jql: 'project = {{PROJECT_KEY}} AND type in ({{ISSUE_TYPES}}) AND resolved >= "{{START_DATE}}" AND resolved <= "{{END_DATE}}" ORDER BY resolved ASC',
      notes:
        'Returns the finished items only; it does not calculate cycle time. It relies on the workflow setting a resolution when work finishes. Dates use the yyyy/MM/dd or yyyy-MM-dd format. The work type field is "type" in both editions (Data Center alias: issueType; Cloud alias: workType).',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'Items that went back to an earlier status (rework that inflates cycle time)',
      jql: 'project = {{PROJECT_KEY}} AND status CHANGED FROM "Done" TO "In Progress" DURING ("{{START_DATE}}", "{{END_DATE}}")',
      notes:
        'Replace "Done" and "In Progress" with your own workflow status names. CHANGED with FROM, TO and DURING is documented for the status field in both editions.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'A workflow whose statuses mark a clear start and finish point. Agree these as a team first.',
    'For the Control Chart: a board, with the statuses that count as "work in progress" selected as the chart\'s columns. Jira tries to pick them automatically; check its choice.',
    'Jira Cloud: the documented Control Chart is for company-managed spaces.',
    "For percentiles: a way to export each item's start and finish timestamps, because JQL and the Control Chart do not provide percentiles.",
  ],
  sources: [
    SOURCES.kanbanGuide,
    SOURCES.dcControlChart,
    SOURCES.cloudControlChart,
    SOURCES.dcJqlFields,
    SOURCES.dcJqlOperators,
    SOURCES.cloudJqlFields,
    SOURCES.cloudJqlOperators,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
