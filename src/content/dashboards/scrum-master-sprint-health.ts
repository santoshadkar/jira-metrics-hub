import type { DashboardGuide } from '../../types/index.ts';
import {
  COMMON_PREREQUISITES,
  GADGET_SOURCES,
  both,
  unestimatedInSprint,
} from '../dashboard-common.ts';
import * as g from '../gadget-steps.ts';
import { SOURCES } from '../sources.ts';

const OPEN = 'JMH: Sprint open work';
const UNEST = 'JMH: Sprint unestimated';
const STALE = 'JMH: Stale in progress';
const LEFT = 'JMH: Left in closed sprints';

export default {
  id: 'scrum-master-sprint-health',
  title: 'Scrum Master: sprint health and hygiene',
  roleIds: ['scrum-master', 'agile-coach'],
  frameworks: ['scrum', 'scrumban'],
  purpose:
    'Helps the Scrum Master spot sprint risks and data problems early: scope and progress, unestimated work, stalled items and work left behind in closed sprints.',
  audience: 'The Scrum Master, with the team at sprint planning and retrospectives.',
  prerequisites: [
    ...COMMON_PREREQUISITES,
    'A Scrum board with an estimation statistic and an active sprint.',
  ],
  filters: [
    {
      name: OPEN,
      purpose: 'Open work in the active sprint.',
      metricId: 'sprint-burndown',
      jql: [
        both(
          'Open sprint work',
          'project = {{PROJECT_KEY}} AND sprint in openSprints() AND statusCategory != Done',
        ),
      ],
    },
    {
      name: UNEST,
      purpose: 'Committed sprint items with no estimate.',
      metricId: 'issues-without-estimate',
      jql: unestimatedInSprint,
    },
    {
      name: STALE,
      purpose: 'In-progress items untouched for 14 days.',
      metricId: 'stale-in-progress',
      jql: [
        both(
          'Stale in progress',
          'project = {{PROJECT_KEY}} AND statusCategory = "In Progress" AND updated <= "-14d" ORDER BY updated ASC',
        ),
      ],
    },
    {
      name: LEFT,
      purpose: 'Unfinished items whose only sprints are closed.',
      metricId: 'items-open-in-closed-sprints',
      jql: [
        both(
          'Left behind',
          'project = {{PROJECT_KEY}} AND sprint in closedSprints() AND sprint not in openSprints() AND sprint not in futureSprints() AND statusCategory != Done',
        ),
      ],
    },
  ],
  gadgets: {
    datacenter: [
      g.sprintHealth('datacenter'),
      g.statistics('datacenter', OPEN, 'Assignee'),
      g.filterResults('datacenter', UNEST),
      g.filterResults('datacenter', STALE),
      g.filterResults('datacenter', LEFT),
    ],
    cloud: [
      g.sprintHealth('cloud'),
      g.statistics('cloud', OPEN, 'Assignee'),
      g.filterResults('cloud', UNEST),
      g.filterResults('cloud', STALE),
      g.filterResults('cloud', LEFT),
    ],
  },
  sources: [
    ...GADGET_SOURCES,
    SOURCES.dcJqlFunctions,
    SOURCES.cloudJqlFunctions,
    SOURCES.cloudMigrateSpaces,
  ],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies DashboardGuide;
