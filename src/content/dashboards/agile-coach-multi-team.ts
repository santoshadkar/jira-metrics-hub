import type { DashboardGuide } from '../../types/index.ts';
import { COMMON_PREREQUISITES, GADGET_SOURCES, both } from '../dashboard-common.ts';
import * as g from '../gadget-steps.ts';
import { SOURCES } from '../sources.ts';

const WIP = 'JMH: Teams in progress';
const BLOCKED = 'JMH: Teams blocked';
const REOPENED = 'JMH: Teams reopened';
const SKIPPED = 'JMH: Teams skipped in progress';
const ALL = 'JMH: Teams all items';

export default {
  id: 'agile-coach-multi-team',
  title: 'Agile Coach: patterns across teams',
  roleIds: ['agile-coach'],
  frameworks: ['scrum', 'kanban', 'scrumban', 'scaled'],
  purpose:
    'Shows patterns across several teams that are worth a coaching conversation: where work in progress piles up, recurring blockers, rework, and items that skip the workflow.',
  audience: 'Agile coaches. Not for ranking teams; use it to choose where to coach.',
  prerequisites: [
    ...COMMON_PREREQUISITES,
    "Put all the coached teams' project keys, comma-separated, in {{PROJECT_KEY}}.",
    'Replace "To Do" and "Done" in the status queries with your workflow\'s status names.',
  ],
  filters: [
    {
      name: WIP,
      purpose: 'In-progress items across the teams.',
      metricId: 'work-in-progress',
      jql: [
        both(
          'In progress, all teams',
          'project in ({{PROJECT_KEY}}) AND statusCategory = "In Progress"',
        ),
      ],
    },
    {
      name: BLOCKED,
      purpose: 'Flagged items across the teams.',
      metricId: 'blocked-items',
      jql: [
        both(
          'Blocked, all teams',
          'project in ({{PROJECT_KEY}}) AND Flagged = Impediment AND statusCategory != Done',
        ),
      ],
    },
    {
      name: REOPENED,
      purpose: 'Items moved out of Done during a period.',
      metricId: 'reopened-items',
      jql: [
        both(
          'Reopened, all teams',
          'project in ({{PROJECT_KEY}}) AND status CHANGED FROM "Done" DURING ("{{START_DATE}}", "{{END_DATE}}")',
        ),
      ],
    },
    {
      name: SKIPPED,
      purpose: 'Items moved straight from To Do to Done.',
      metricId: 'workflow-status-misuse',
      jql: [
        both(
          'Skipped in progress, all teams',
          'project in ({{PROJECT_KEY}}) AND status CHANGED FROM "To Do" TO "Done" DURING ("{{START_DATE}}", "{{END_DATE}}")',
        ),
      ],
    },
    {
      name: ALL,
      purpose: 'All items across the teams, for created vs resolved trends.',
      jql: [both('All items, all teams', 'project in ({{PROJECT_KEY}})')],
    },
  ],
  gadgets: {
    datacenter: [
      g.twoDimensional('datacenter', WIP, 'Project', 'Status'),
      g.statistics('datacenter', BLOCKED, 'Project'),
      g.statistics('datacenter', REOPENED, 'Project'),
      g.statistics('datacenter', SKIPPED, 'Project'),
      g.createdVsResolved('datacenter', ALL),
    ],
    cloud: [
      g.twoDimensional('cloud', WIP, 'Space (formerly Project)', 'Status'),
      g.statistics('cloud', BLOCKED, 'Space (formerly Project)'),
      g.statistics('cloud', REOPENED, 'Space (formerly Project)'),
      g.statistics('cloud', SKIPPED, 'Space (formerly Project)'),
      g.createdVsResolved('cloud', ALL),
    ],
  },
  sources: [
    ...GADGET_SOURCES,
    SOURCES.dcJqlOperators,
    SOURCES.cloudJqlOperators,
    SOURCES.dcFlagging,
    SOURCES.cloudFlag,
  ],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies DashboardGuide;
