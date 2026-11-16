import type { DashboardGuide } from '../../types/index.ts';
import { COMMON_PREREQUISITES, GADGET_SOURCES, both } from '../dashboard-common.ts';
import * as g from '../gadget-steps.ts';
import { SOURCES } from '../sources.ts';

const ALL = 'JMH: Portfolio all items';
const FINISHED = 'JMH: Portfolio finished last 180 days';
const EPICS = 'JMH: Portfolio open epics';
const FLAGGED = 'JMH: Portfolio blocked';

export default {
  id: 'senior-leadership',
  title: 'Senior leadership: trends, not team detail',
  roleIds: ['senior-leadership'],
  frameworks: ['scrum', 'kanban', 'scrumban', 'scaled'],
  purpose:
    'A few trend-level signals across many teams: is work being finished as fast as it arrives, how is the finishing rate changing, where are the big pieces of work, and where is work blocked.',
  audience:
    'Senior leaders. Deliberately shows trends and totals, not individual or per-team rankings.',
  prerequisites: [
    ...COMMON_PREREQUISITES,
    'All relevant project keys, comma-separated, in {{PROJECT_KEY}}.',
    'Agree with the teams how these views will and will not be used, before sharing the dashboard.',
  ],
  filters: [
    {
      name: ALL,
      purpose: 'All items, for created vs resolved trends.',
      jql: [both('All items', 'project in ({{PROJECT_KEY}})')],
    },
    {
      name: FINISHED,
      purpose: 'Items finished in the last 180 days.',
      metricId: 'throughput',
      jql: [
        both('Finished, last 180 days', 'project in ({{PROJECT_KEY}}) AND resolved >= "-180d"'),
      ],
    },
    {
      name: EPICS,
      purpose: 'Epics not yet done.',
      metricId: 'epic-progress',
      jql: [
        both(
          'Open epics',
          'project in ({{PROJECT_KEY}}) AND type = Epic AND statusCategory != Done',
        ),
      ],
    },
    {
      name: FLAGGED,
      purpose: 'Flagged open items.',
      metricId: 'blocked-items',
      jql: [
        both(
          'Blocked',
          'project in ({{PROJECT_KEY}}) AND Flagged = Impediment AND statusCategory != Done',
        ),
      ],
    },
  ],
  gadgets: {
    datacenter: [
      g.createdVsResolved('datacenter', ALL),
      g.timeSince('datacenter', FINISHED, 'Resolved'),
      g.pieChart('datacenter', EPICS, 'Status'),
      g.pieChart('datacenter', FLAGGED, 'Project'),
      g.roadMap('datacenter'),
    ],
    cloud: [
      g.createdVsResolved('cloud', ALL),
      g.timeSince('cloud', FINISHED, 'Resolved'),
      g.pieChart('cloud', EPICS, 'Status'),
      g.pieChart('cloud', FLAGGED, 'Space (formerly Project)'),
      g.roadMap('cloud'),
    ],
  },
  sources: [
    ...GADGET_SOURCES,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
    SOURCES.dcFlagging,
    SOURCES.cloudFlag,
  ],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies DashboardGuide;
