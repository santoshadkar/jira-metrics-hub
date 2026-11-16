import type { DashboardGuide } from '../../types/index.ts';
import { COMMON_PREREQUISITES, GADGET_SOURCES, both } from '../dashboard-common.ts';
import * as g from '../gadget-steps.ts';
import { SOURCES } from '../sources.ts';

const EPICS = 'JMH: Tribe open epics';
const LOAD = 'JMH: Tribe epics in progress';
const FINISHED = 'JMH: Tribe finished last 90 days';
const FLAGGED = 'JMH: Tribe blocked';

export default {
  id: 'tribe-lead',
  title: 'Tribe or product line lead: outcomes and flow',
  roleIds: ['tribe-lead'],
  frameworks: ['scaled'],
  purpose:
    'Gives a tribe or product line lead a view across squads without reading their boards: open epics, how many are in progress at once, the finishing rate, and blocked work.',
  audience: 'Tribe leads, product line leads and their chapter or squad leads.',
  prerequisites: [
    ...COMMON_PREREQUISITES,
    "All the tribe's project keys, comma-separated, in {{PROJECT_KEY}}.",
  ],
  filters: [
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
      name: LOAD,
      purpose: 'Epics in progress at the same time.',
      metricId: 'flow-load',
      jql: [
        both(
          'Epics in progress',
          'project in ({{PROJECT_KEY}}) AND type = Epic AND statusCategory = "In Progress"',
        ),
      ],
    },
    {
      name: FINISHED,
      purpose: 'Items finished in the last 90 days.',
      metricId: 'throughput',
      jql: [both('Finished, last 90 days', 'project in ({{PROJECT_KEY}}) AND resolved >= "-90d"')],
    },
    {
      name: FLAGGED,
      purpose: 'Flagged open items across the tribe.',
      metricId: 'cross-team-blockers',
      jql: [
        both(
          'Blocked across the tribe',
          'project in ({{PROJECT_KEY}}) AND Flagged = Impediment AND statusCategory != Done',
        ),
      ],
    },
  ],
  gadgets: {
    datacenter: [
      g.pieChart('datacenter', EPICS, 'Status'),
      g.statistics('datacenter', LOAD, 'Project'),
      g.timeSince('datacenter', FINISHED, 'Resolved'),
      g.statistics('datacenter', FLAGGED, 'Project'),
    ],
    cloud: [
      g.pieChart('cloud', EPICS, 'Status'),
      g.statistics('cloud', LOAD, 'Space (formerly Project)'),
      g.timeSince('cloud', FINISHED, 'Resolved'),
      g.statistics('cloud', FLAGGED, 'Space (formerly Project)'),
    ],
  },
  sources: [
    ...GADGET_SOURCES,
    SOURCES.safeGlossary,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
    SOURCES.dcFlagging,
    SOURCES.cloudFlag,
  ],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies DashboardGuide;
