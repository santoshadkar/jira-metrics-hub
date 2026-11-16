import type { DashboardGuide } from '../../types/index.ts';
import { COMMON_PREREQUISITES, GADGET_SOURCES, both, epicChildren } from '../dashboard-common.ts';
import * as g from '../gadget-steps.ts';
import { SOURCES } from '../sources.ts';

const READY = 'JMH: Ready backlog';
const STALE = 'JMH: Stale backlog';
const EPIC = 'JMH: Epic items';
const RELEASE = 'JMH: Next release open';
const ALL = 'JMH: All project items';

export default {
  id: 'product-owner-forecasting',
  title: 'Product Owner: backlog readiness and forecasting',
  roleIds: ['product-owner'],
  frameworks: ['scrum', 'kanban', 'scrumban'],
  purpose:
    'Shows whether there is enough ready work, how an important epic is progressing, what is left in the next release, and whether incoming work outpaces finished work.',
  audience: 'The Product Owner, and stakeholders during Sprint Review or replenishment.',
  prerequisites: [
    ...COMMON_PREREQUISITES,
    'An agreed "ready" label (put it in {{LABEL}}).',
    'Versions (releases) used through the Fix version field.',
  ],
  filters: [
    {
      name: READY,
      purpose: 'Not-started items marked ready.',
      metricId: 'ready-backlog-depth',
      jql: [
        both(
          'Ready items',
          'project = {{PROJECT_KEY}} AND statusCategory = "To Do" AND labels = "{{LABEL}}" ORDER BY created ASC',
        ),
      ],
    },
    {
      name: STALE,
      purpose: 'Backlog items untouched for 90 days.',
      metricId: 'stale-backlog-items',
      jql: [
        both(
          'Stale backlog',
          'project = {{PROJECT_KEY}} AND statusCategory = "To Do" AND updated <= "-90d" ORDER BY updated ASC',
        ),
      ],
    },
    {
      name: EPIC,
      purpose: 'Every item in the epic you are tracking.',
      metricId: 'epic-progress',
      jql: epicChildren(),
    },
    {
      name: RELEASE,
      purpose: 'Unfinished items in the next unreleased version.',
      metricId: 'release-readiness',
      jql: [
        both(
          'Next release, open',
          'project = {{PROJECT_KEY}} AND fixVersion = earliestUnreleasedVersion({{PROJECT_KEY}}) AND statusCategory != Done',
        ),
      ],
    },
    {
      name: ALL,
      purpose: 'All items in the project, for created vs resolved trends.',
      jql: [both('All project items', 'project = {{PROJECT_KEY}}')],
    },
  ],
  gadgets: {
    datacenter: [
      g.filterResults('datacenter', READY),
      g.pieChart('datacenter', EPIC, 'Status'),
      g.statistics('datacenter', RELEASE, 'Status'),
      g.roadMap('datacenter'),
      g.versionReport(),
      g.createdVsResolved('datacenter', ALL),
      g.filterResults('datacenter', STALE),
    ],
    cloud: [
      g.filterResults('cloud', READY),
      g.pieChart('cloud', EPIC, 'Status'),
      g.statistics('cloud', RELEASE, 'Status'),
      g.roadMap('cloud'),
      g.createdVsResolved('cloud', ALL),
      g.filterResults('cloud', STALE),
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
