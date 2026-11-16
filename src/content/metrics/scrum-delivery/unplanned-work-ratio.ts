import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'unplanned-work-ratio',
  name: 'Unplanned work ratio',
  framework: ['scrum', 'scrumban'],
  category: 'scrum-delivery',
  purpose:
    'Shows what share of the work done in a sprint was not in the plan at sprint start, so the team can plan capacity for interruptions it knows will come.',
  howToRead:
    'Track it over several sprints. If unplanned work is steady (for example around a fifth of the sprint), reserve that capacity at planning. If it swings wildly, find out where it comes from: production support, urgent requests, or work that was forgotten at planning.',
  formula:
    'Unplanned work ratio = items (or estimate) added after sprint start ÷ all items completed in the sprint. Jira gives the two lists; divide the counts outside Jira. Teams without ScriptRunner can tag unplanned items with an agreed label instead.',
  calcMethod: 'export-calc',
  cadence: 'Every sprint',
  misuseWarning:
    'Labels only work if everyone applies them honestly; if the ratio is used against the team, unplanned work stops being labelled. A high ratio is usually a system problem (support load, unclear priorities), not a team failure.',
  jql: [
    {
      edition: 'both',
      label: 'Unplanned: items added after the sprint started',
      jql: 'issueFunction in addedAfterSprintStart("{{BOARD_NAME}}", "{{SPRINT_NAME}}")',
      requiresApp: 'ScriptRunner for Jira',
      notes:
        'Cloud: ScriptRunner Enhanced Search; results can be wrong for sprints that were closed and reopened.',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'Unplanned: items carrying your agreed "unplanned" label',
      jql: 'project = {{PROJECT_KEY}} AND sprint = "{{SPRINT_NAME}}" AND labels = "{{LABEL}}"',
      notes: 'Only works if the team agrees a label and applies it every time.',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'All items completed in the sprint (the denominator)',
      jql: 'project = {{PROJECT_KEY}} AND sprint = "{{SPRINT_NAME}}" AND statusCategory = Done',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'Either ScriptRunner for Jira, or a team agreement to label unplanned work consistently.',
  ],
  sources: [
    SOURCES.scriptRunnerDcFunctions,
    SOURCES.scriptRunnerCloudAgile,
    SOURCES.dcSprintReport,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
