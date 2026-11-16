import type { DashboardGuide } from '../../types/index.ts';
import { COMMON_PREREQUISITES, GADGET_SOURCES, both } from '../dashboard-common.ts';
import * as g from '../gadget-steps.ts';
import { SOURCES } from '../sources.ts';

const OPEN = 'JMH: Next release open';
const BUGS = 'JMH: Next release open bugs';
const FLAGGED = 'JMH: Next release blocked';
const XBLOCKED = 'JMH: Blocked by other teams';

const RELEASE = 'fixVersion = earliestUnreleasedVersion({{PROJECT_KEY}})';

export default {
  id: 'delivery-manager-release',
  title: 'Delivery manager: release readiness',
  roleIds: ['delivery-manager', 'product-owner'],
  frameworks: ['scrum', 'kanban', 'scaled'],
  purpose:
    'The go/no-go picture for the next release: what is still open, open bugs, blocked items, and items waiting on other teams.',
  audience: 'Delivery and program managers, with Product Owners, in the weeks before a release.',
  prerequisites: [
    ...COMMON_PREREQUISITES,
    'Versions (releases) used through the Fix version field.',
    'For the "blocked by other teams" filter: ScriptRunner (Data Center) or ScriptRunner Enhanced Search (Cloud).',
  ],
  filters: [
    {
      name: OPEN,
      purpose: 'Unfinished items in the next unreleased version.',
      metricId: 'release-readiness',
      jql: [
        both(
          'Next release, open',
          `project = {{PROJECT_KEY}} AND ${RELEASE} AND statusCategory != Done`,
        ),
      ],
    },
    {
      name: BUGS,
      purpose: 'Open bugs in the next release.',
      metricId: 'release-readiness',
      jql: [
        both(
          'Next release, open bugs',
          `project = {{PROJECT_KEY}} AND ${RELEASE} AND type = Bug AND statusCategory != Done`,
        ),
      ],
    },
    {
      name: FLAGGED,
      purpose: 'Flagged items in the next release.',
      metricId: 'release-readiness',
      jql: [
        both(
          'Next release, blocked',
          `project = {{PROJECT_KEY}} AND ${RELEASE} AND Flagged = Impediment`,
        ),
      ],
    },
    {
      name: XBLOCKED,
      purpose: 'Our open items blocked by open items in other projects.',
      metricId: 'cross-team-blockers',
      jql: [
        {
          edition: 'both',
          label: 'Blocked by other teams',
          jql: 'project = {{PROJECT_KEY}} AND statusCategory != Done AND issueFunction in linkedIssuesOf("project != {{PROJECT_KEY}} AND statusCategory != Done", "blocks")',
          requiresApp: 'ScriptRunner for Jira',
          verification: 'verified',
        },
      ],
    },
  ],
  gadgets: {
    datacenter: [
      g.roadMap('datacenter'),
      g.versionReport(),
      g.statistics('datacenter', OPEN, 'Status'),
      g.filterResults('datacenter', BUGS),
      g.filterResults('datacenter', FLAGGED),
      g.filterResults('datacenter', XBLOCKED),
    ],
    cloud: [
      g.roadMap('cloud'),
      g.statistics('cloud', OPEN, 'Status'),
      g.filterResults('cloud', BUGS),
      g.filterResults('cloud', FLAGGED),
      g.filterResults('cloud', XBLOCKED),
    ],
  },
  sources: [
    ...GADGET_SOURCES,
    SOURCES.dcJqlFunctions,
    SOURCES.cloudJqlFunctions,
    SOURCES.dcVersionReport,
    SOURCES.scriptRunnerDcLinks,
    SOURCES.scriptRunnerCloudLinks,
  ],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies DashboardGuide;
