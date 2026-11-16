import type { DashboardGuide } from '../../types/index.ts';
import { COMMON_PREREQUISITES, GADGET_SOURCES, agingWip, both } from '../dashboard-common.ts';
import * as g from '../gadget-steps.ts';
import { SOURCES } from '../sources.ts';

const WIP = 'JMH: Work in progress';
const BLOCKED = 'JMH: Blocked';
const AGING = 'JMH: Aging WIP';
const FINISHED = 'JMH: Finished last 90 days';

export default {
  id: 'scrumban-team',
  title: 'Scrumban team: flow within a cadence',
  roleIds: ['team-member', 'scrum-master', 'flow-manager'],
  frameworks: ['scrumban'],
  purpose:
    'For hybrid teams that keep a sprint or planning cadence but manage work by flow: WIP, aging and blocked items, the finishing rate, and days left in the current cadence.',
  audience: 'The team at its daily meeting and at each planning or replenishment point.',
  prerequisites: [
    ...COMMON_PREREQUISITES,
    'If the team uses sprints: a Scrum board with an active sprint (for the days-remaining gadget).',
    'Workflow statuses assigned to the right status category.',
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
      purpose: 'Items finished in the last 90 days.',
      metricId: 'throughput',
      jql: [both('Finished, last 90 days', 'project = {{PROJECT_KEY}} AND resolved >= "-90d"')],
    },
  ],
  gadgets: {
    datacenter: [
      g.daysRemaining('datacenter'),
      g.statistics('datacenter', WIP, 'Status'),
      g.filterResults('datacenter', AGING),
      g.filterResults('datacenter', BLOCKED),
      g.timeSince('datacenter', FINISHED, 'Resolved'),
    ],
    cloud: [
      g.daysRemaining('cloud'),
      g.statistics('cloud', WIP, 'Status'),
      g.filterResults('cloud', AGING),
      g.filterResults('cloud', BLOCKED),
      g.timeSince('cloud', FINISHED, 'Resolved'),
    ],
  },
  sources: [
    ...GADGET_SOURCES,
    SOURCES.kanbanGuide,
    SOURCES.dcJqlFields,
    SOURCES.cloudKbStatusCategory,
    SOURCES.dcFlagging,
    SOURCES.cloudFlag,
  ],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies DashboardGuide;
