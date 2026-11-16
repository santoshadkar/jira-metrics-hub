import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'velocity',
  name: 'Velocity',
  framework: ['scrum', 'scrumban'],
  category: 'scrum-delivery',
  purpose:
    'Shows how much estimated work the team finished in recent sprints, so it can make a realistic forecast for the next one.',
  howToRead:
    "Open the Velocity Chart from the board's Reports. Each sprint has two bars: what was committed and what was completed. Look at the range across several sprints, not at one number. A steady range means the team can forecast with some confidence. A large gap between committed and completed, sprint after sprint, is a planning conversation for the retrospective, not a performance problem. The chart only uses issues that match the board's filter, and people only see estimates from issues they are allowed to view, so two people can see different numbers.",
  formula:
    "Completed estimate for a sprint = the sum of the board's estimation statistic (story points, time, issue count or another numeric field) for the issues completed when the sprint closed. Velocity is usually read as the average of that figure over recent sprints. The Cloud chart describes itself as showing that average; the Data Center 10.7 page describes only the committed and completed bars per sprint.",
  calcMethod: 'native-report',
  cadence: 'Every sprint, used at sprint planning',
  misuseWarning:
    'Velocity is a planning aid for one team, in that team\'s own units. Comparing velocity between teams is meaningless because each team estimates differently. Turning it into a target ("increase velocity by 10%") produces inflated estimates, not more value. Never use it to rate individuals. A rising velocity with no change in outcomes usually means estimates have drifted.',
  jql: [
    {
      edition: 'both',
      label:
        "Done issues in the project's closed sprints (supporting list, not the velocity number)",
      jql: 'project = {{PROJECT_KEY}} AND sprint in closedSprints() AND statusCategory = Done ORDER BY resolved DESC',
      notes:
        'Use this to inspect what sits behind the chart. It does not calculate velocity. The chart decides "completed" from the board\'s column mapping, which may not match statusCategory = Done exactly, and it only includes issues that match the board filter.',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'Everything in one sprint, to check what the chart counted',
      jql: 'project = {{PROJECT_KEY}} AND sprint = "{{SPRINT_NAME}}" ORDER BY status ASC',
      notes:
        'The sprint field matches a sprint name or ID in both editions. If several sprints share a name, use the sprint ID shown in brackets in the autocomplete.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'A Scrum board. The velocity chart is not available on Kanban boards.',
    'An estimation statistic set on the board (story points, time, issue count or another numeric field).',
    'At least one completed sprint.',
    'Board columns mapped to the right statuses, so the chart knows which issues are completed.',
    'Jira Cloud: the documented velocity chart is for company-managed spaces using the Scrum template.',
    'Jira Cloud: company-managed spaces store estimates in the "Story points" field; team-managed spaces use a different field, "Story point estimate". Estimates do not carry across if a space is migrated.',
  ],
  sources: [
    SOURCES.dcVelocityChart,
    SOURCES.cloudVelocityChart,
    SOURCES.cloudMigrateSpaces,
    SOURCES.dcJqlFunctions,
    SOURCES.cloudJqlFields,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
