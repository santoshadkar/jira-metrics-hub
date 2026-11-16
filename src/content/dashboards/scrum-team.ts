import type { DashboardGuide } from '../../types/index.ts';
import { COMMON_PREREQUISITES, GADGET_SOURCES, both } from '../dashboard-common.ts';
import * as g from '../gadget-steps.ts';
import { SOURCES } from '../sources.ts';

const OPEN = 'JMH: Sprint open work';
const FLAGGED = 'JMH: Sprint blocked';
const CARRY = 'JMH: Sprint carryover';

export default {
  id: 'scrum-team',
  title: 'Scrum team: sprint at a glance',
  roleIds: ['team-member', 'scrum-master'],
  frameworks: ['scrum'],
  purpose:
    'One screen for the Daily Scrum: how the sprint is burning down, how many days are left, what is blocked and what has carried over.',
  audience: 'The Developers and the Scrum Master, looked at together every day.',
  prerequisites: [
    ...COMMON_PREREQUISITES,
    'A Scrum board with an estimation statistic and an active sprint.',
    'The team flags blocked items in Jira.',
  ],
  filters: [
    {
      name: OPEN,
      purpose: 'Everything in the active sprint that is not done.',
      metricId: 'sprint-burndown',
      jql: [
        both(
          'Open sprint work',
          'project = {{PROJECT_KEY}} AND sprint in openSprints() AND statusCategory != Done ORDER BY status ASC',
        ),
      ],
    },
    {
      name: FLAGGED,
      purpose: 'Items in the active sprint flagged as blocked.',
      metricId: 'blocked-items',
      jql: [
        both(
          'Blocked sprint items',
          'project = {{PROJECT_KEY}} AND sprint in openSprints() AND Flagged = Impediment',
        ),
      ],
    },
    {
      name: CARRY,
      purpose: 'Items in the active sprint that were also in a closed sprint.',
      metricId: 'carryover',
      jql: [
        both(
          'Carryover',
          'project = {{PROJECT_KEY}} AND sprint in openSprints() AND sprint in closedSprints()',
        ),
      ],
    },
  ],
  gadgets: {
    datacenter: [
      g.sprintBurndown('datacenter'),
      g.daysRemaining('datacenter'),
      g.filterResults('datacenter', FLAGGED),
      g.filterResults('datacenter', CARRY),
      g.statistics('datacenter', OPEN, 'Status'),
    ],
    cloud: [
      g.sprintBurndown('cloud'),
      g.daysRemaining('cloud'),
      g.filterResults('cloud', FLAGGED),
      g.filterResults('cloud', CARRY),
      g.statistics('cloud', OPEN, 'Status'),
    ],
  },
  sources: [
    ...GADGET_SOURCES,
    SOURCES.dcJqlFunctions,
    SOURCES.cloudJqlFunctions,
    SOURCES.dcFlagging,
    SOURCES.cloudFlag,
  ],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies DashboardGuide;
