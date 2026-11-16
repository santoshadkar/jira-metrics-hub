import type { DashboardGuide } from '../../types/index.ts';
import { COMMON_PREREQUISITES, GADGET_SOURCES, both } from '../dashboard-common.ts';
import * as g from '../gadget-steps.ts';
import { SOURCES } from '../sources.ts';

const NO_RES = 'JMH: Done without resolution';
const RES_OPEN = 'JMH: Resolved but not done';
const NO_ASSIGNEE = 'JMH: Started without assignee';
const STALE = 'JMH: Stale in progress';
const LEFT = 'JMH: Left in closed sprints';
const NO_EPIC = 'JMH: No epic';

export default {
  id: 'jira-admin-hygiene',
  title: 'Jira administrator: data hygiene',
  roleIds: ['jira-admin'],
  frameworks: ['scrum', 'kanban', 'scrumban', 'scaled'],
  purpose:
    'Finds the data problems that quietly break every other metric: done items with no resolution, resolved items that are not done, started work with no owner, abandoned items, work left in closed sprints and unlinked work.',
  audience: 'Jira administrators, and the agile coaches who work with them on workflows.',
  prerequisites: [
    ...COMMON_PREREQUISITES,
    'Put all the projects you look after, comma-separated, in {{PROJECT_KEY}}.',
  ],
  filters: [
    {
      name: NO_RES,
      purpose: 'Items in a done status with no resolution.',
      metricId: 'workflow-status-misuse',
      jql: [
        both(
          'Done without resolution',
          'project in ({{PROJECT_KEY}}) AND statusCategory = Done AND resolution is EMPTY',
        ),
      ],
    },
    {
      name: RES_OPEN,
      purpose: 'Items with a resolution that are not done.',
      metricId: 'workflow-status-misuse',
      jql: [
        both(
          'Resolved but not done',
          'project in ({{PROJECT_KEY}}) AND statusCategory != Done AND resolution is not EMPTY',
        ),
      ],
    },
    {
      name: NO_ASSIGNEE,
      purpose: 'Started items with no assignee.',
      metricId: 'issues-without-assignee',
      jql: [
        both(
          'Started without assignee',
          'project in ({{PROJECT_KEY}}) AND statusCategory = "In Progress" AND assignee is EMPTY',
        ),
      ],
    },
    {
      name: STALE,
      purpose: 'In-progress items untouched for 30 days.',
      metricId: 'stale-in-progress',
      jql: [
        both(
          'Stale in progress',
          'project in ({{PROJECT_KEY}}) AND statusCategory = "In Progress" AND updated <= "-30d"',
        ),
      ],
    },
    {
      name: LEFT,
      purpose: 'Unfinished items whose only sprints are closed.',
      metricId: 'items-open-in-closed-sprints',
      jql: [
        both(
          'Left in closed sprints',
          'project in ({{PROJECT_KEY}}) AND sprint in closedSprints() AND sprint not in openSprints() AND sprint not in futureSprints() AND statusCategory != Done',
        ),
      ],
    },
    {
      name: NO_EPIC,
      purpose: 'Open standard items not linked to an epic (Data Center only).',
      metricId: 'issues-without-parent',
      jql: [
        {
          edition: 'datacenter',
          label: 'No epic',
          jql: 'project in ({{PROJECT_KEY}}) AND type in standardIssueTypes() AND type != Epic AND "epic link" is EMPTY AND statusCategory != Done',
          notes:
            'Cloud has no documented native equivalent: its parent field does not support IS EMPTY.',
          verification: 'verified',
        },
      ],
    },
  ],
  gadgets: {
    datacenter: [
      g.twoDimensional('datacenter', NO_RES, 'Project', 'Status'),
      g.statistics('datacenter', RES_OPEN, 'Project'),
      g.statistics('datacenter', NO_ASSIGNEE, 'Project'),
      g.statistics('datacenter', STALE, 'Project'),
      g.statistics('datacenter', LEFT, 'Project'),
      g.statistics('datacenter', NO_EPIC, 'Project'),
    ],
    cloud: [
      g.twoDimensional('cloud', NO_RES, 'Space (formerly Project)', 'Status'),
      g.statistics('cloud', RES_OPEN, 'Space (formerly Project)'),
      g.statistics('cloud', NO_ASSIGNEE, 'Space (formerly Project)'),
      g.statistics('cloud', STALE, 'Space (formerly Project)'),
      g.statistics('cloud', LEFT, 'Space (formerly Project)'),
    ],
  },
  sources: [
    ...GADGET_SOURCES,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
    SOURCES.dcJqlFunctions,
    SOURCES.cloudJqlFunctions,
  ],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies DashboardGuide;
