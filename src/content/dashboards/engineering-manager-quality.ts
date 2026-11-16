import type { DashboardGuide } from '../../types/index.ts';
import { COMMON_PREREQUISITES, GADGET_SOURCES, both } from '../dashboard-common.ts';
import * as g from '../gadget-steps.ts';
import { SOURCES } from '../sources.ts';

const BUGS = 'JMH: All bugs';
const OPEN_BUGS = 'JMH: Open bugs';
const ESCAPED = 'JMH: Escaped defects';
const OLD = 'JMH: Bugs older than 90 days';
const REOPENED = 'JMH: Reopened';

export default {
  id: 'engineering-manager-quality',
  title: 'Engineering manager: quality and sustainability',
  roleIds: ['engineering-manager'],
  frameworks: ['scrum', 'kanban', 'scrumban', 'scaled'],
  purpose:
    'Shows whether quality problems are building up: bugs coming in versus being fixed, how old open bugs are, defects found in production, and rework.',
  audience: 'Engineering managers, and the team when discussing technical health.',
  prerequisites: [
    ...COMMON_PREREQUISITES,
    'A Bug work type used consistently.',
    'An agreed "found in production" label for escaped defects (put it in {{LABEL}}).',
  ],
  filters: [
    {
      name: BUGS,
      purpose: 'All bugs in the project.',
      metricId: 'bug-ratio',
      jql: [both('All bugs', 'project = {{PROJECT_KEY}} AND type = Bug')],
    },
    {
      name: OPEN_BUGS,
      purpose: 'Bugs not yet done.',
      metricId: 'defect-age',
      jql: [
        both(
          'Open bugs',
          'project = {{PROJECT_KEY}} AND type = Bug AND statusCategory != Done ORDER BY created ASC',
        ),
      ],
    },
    {
      name: ESCAPED,
      purpose: 'Bugs labelled as found in production.',
      metricId: 'escaped-defects',
      jql: [
        both(
          'Escaped defects',
          'project = {{PROJECT_KEY}} AND type = Bug AND labels = "{{LABEL}}" ORDER BY created DESC',
        ),
      ],
    },
    {
      name: OLD,
      purpose: 'Open bugs created more than 90 days ago.',
      metricId: 'defect-age',
      jql: [
        both(
          'Old open bugs',
          'project = {{PROJECT_KEY}} AND type = Bug AND statusCategory != Done AND created <= "-90d"',
        ),
      ],
    },
    {
      name: REOPENED,
      purpose: 'Items moved out of Done in a period.',
      metricId: 'reopened-items',
      jql: [
        both(
          'Reopened',
          'project = {{PROJECT_KEY}} AND status CHANGED FROM "Done" DURING ("{{START_DATE}}", "{{END_DATE}}")',
        ),
      ],
    },
  ],
  gadgets: {
    datacenter: [
      g.createdVsResolved('datacenter', BUGS),
      g.averageAge('datacenter', OPEN_BUGS),
      g.pieChart('datacenter', OPEN_BUGS, 'Priority'),
      g.filterResults('datacenter', ESCAPED),
      g.filterResults('datacenter', OLD),
      g.filterResults('datacenter', REOPENED),
    ],
    cloud: [
      g.createdVsResolved('cloud', BUGS),
      g.averageAge('cloud', OPEN_BUGS),
      g.pieChart('cloud', OPEN_BUGS, 'Priority'),
      g.filterResults('cloud', ESCAPED),
      g.filterResults('cloud', OLD),
      g.filterResults('cloud', REOPENED),
    ],
  },
  sources: [
    ...GADGET_SOURCES,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
    SOURCES.dcJqlOperators,
    SOURCES.cloudJqlOperators,
  ],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies DashboardGuide;
