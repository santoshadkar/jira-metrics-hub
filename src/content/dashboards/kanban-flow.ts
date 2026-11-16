import type { DashboardGuide } from '../../types/index.ts';
import { COMMON_PREREQUISITES, GADGET_SOURCES, agingWip, both } from '../dashboard-common.ts';
import * as g from '../gadget-steps.ts';
import { SOURCES } from '../sources.ts';

const WIP = 'JMH: Work in progress';
const BLOCKED = 'JMH: Blocked';
const AGING = 'JMH: Aging WIP';
const FINISHED = 'JMH: Finished last 90 days';
const OVERDUE = 'JMH: Overdue';

export default {
  id: 'kanban-flow',
  title: 'Kanban team: flow at a glance',
  roleIds: ['flow-manager', 'team-member'],
  frameworks: ['kanban'],
  purpose:
    "Covers the Kanban Guide's flow measures in one place: work in progress, aging items, blocked work and the rate of finishing, plus any overdue fixed-date items.",
  audience:
    'The team and the flow manager at the daily Kanban meeting and the replenishment meeting.',
  prerequisites: [
    ...COMMON_PREREQUISITES,
    'Workflow statuses assigned to the right status category, so "In Progress" means started work.',
    'A workflow that sets a resolution when work finishes.',
  ],
  filters: [
    {
      name: WIP,
      purpose: 'Everything started but not finished.',
      metricId: 'work-in-progress',
      jql: [
        both('Work in progress', 'project = {{PROJECT_KEY}} AND statusCategory = "In Progress"'),
      ],
    },
    {
      name: BLOCKED,
      purpose: 'Open items flagged as blocked.',
      metricId: 'blocked-items',
      jql: [
        both(
          'Blocked',
          'project = {{PROJECT_KEY}} AND Flagged = Impediment AND statusCategory != Done',
        ),
      ],
    },
    {
      name: AGING,
      purpose: 'In-progress items, oldest first.',
      metricId: 'aging-wip',
      jql: agingWip,
    },
    {
      name: FINISHED,
      purpose: 'Items finished in the last 90 days, for throughput and resolution trends.',
      metricId: 'throughput',
      jql: [both('Finished, last 90 days', 'project = {{PROJECT_KEY}} AND resolved >= "-90d"')],
    },
    {
      name: OVERDUE,
      purpose: 'Open items past their due date.',
      metricId: 'due-date-performance',
      jql: [
        both(
          'Overdue',
          'project = {{PROJECT_KEY}} AND statusCategory != Done AND due < startOfDay() ORDER BY due ASC',
        ),
      ],
    },
  ],
  gadgets: {
    datacenter: [
      g.statistics('datacenter', WIP, 'Status'),
      g.filterResults('datacenter', BLOCKED),
      g.filterResults('datacenter', AGING),
      g.timeSince('datacenter', FINISHED, 'Resolved'),
      g.resolutionTime('datacenter', FINISHED),
      g.filterResults('datacenter', OVERDUE),
    ],
    cloud: [
      g.statistics('cloud', WIP, 'Status'),
      g.filterResults('cloud', BLOCKED),
      g.filterResults('cloud', AGING),
      g.timeSince('cloud', FINISHED, 'Resolved'),
      g.resolutionTime('cloud', FINISHED),
      g.filterResults('cloud', OVERDUE),
    ],
  },
  sources: [
    ...GADGET_SOURCES,
    SOURCES.kanbanGuide,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
    SOURCES.cloudKbStatusCategory,
    SOURCES.dcFlagging,
    SOURCES.cloudFlag,
  ],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies DashboardGuide;
