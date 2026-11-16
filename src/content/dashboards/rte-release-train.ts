import type { DashboardGuide } from '../../types/index.ts';
import { COMMON_PREREQUISITES, GADGET_SOURCES, both } from '../dashboard-common.ts';
import * as g from '../gadget-steps.ts';
import { SOURCES } from '../sources.ts';

const PI = 'JMH: PI features';
const LOAD = 'JMH: Train flow load';
const FLAGGED = 'JMH: Train blocked';
const DEPS = 'JMH: Cross-team dependencies';

export default {
  id: 'rte-release-train',
  title: 'RTE: Agile Release Train during the PI',
  roleIds: ['rte', 'scrum-master', 'product-owner'],
  frameworks: ['scaled'],
  purpose:
    "Tracks the train during a Program Increment: progress of the PI's features, flow load, blocked items across teams and open dependencies. PI predictability itself is assessed at Inspect and Adapt, not on this dashboard.",
  audience: 'The RTE, Scrum Masters and Product Owners at ART syncs.',
  prerequisites: [
    ...COMMON_PREREQUISITES,
    'A feature work type, with features labelled per PI (put the PI label in {{LABEL}} and the feature type in {{ISSUE_TYPES}}).',
    "All the train's project keys, comma-separated, in {{PROJECT_KEY}}.",
    'For the dependencies filter: ScriptRunner (Data Center) or ScriptRunner Enhanced Search (Cloud).',
  ],
  filters: [
    {
      name: PI,
      purpose: 'Features planned for the PI.',
      metricId: 'feature-completion-per-pi',
      jql: [
        both(
          'PI features',
          'project in ({{PROJECT_KEY}}) AND type in ({{ISSUE_TYPES}}) AND labels = "{{LABEL}}"',
        ),
      ],
    },
    {
      name: LOAD,
      purpose: 'Features currently in progress across the train.',
      metricId: 'flow-load',
      jql: [
        both(
          'Flow load',
          'project in ({{PROJECT_KEY}}) AND type in ({{ISSUE_TYPES}}) AND statusCategory = "In Progress"',
        ),
      ],
    },
    {
      name: FLAGGED,
      purpose: 'Flagged open items across the train.',
      metricId: 'cross-team-blockers',
      jql: [
        both(
          'Blocked across the train',
          'project in ({{PROJECT_KEY}}) AND Flagged = Impediment AND statusCategory != Done',
        ),
      ],
    },
    {
      name: DEPS,
      purpose: 'Open items blocked by open items in another project.',
      metricId: 'cross-team-dependencies',
      jql: [
        {
          edition: 'both',
          label: 'Blocked by another team',
          jql: 'project in ({{PROJECT_KEY}}) AND statusCategory != Done AND issueFunction in linkedIssuesOf("project in ({{PROJECT_KEY}}) AND statusCategory != Done", "blocks")',
          notes:
            "This finds items blocked by any other open item on the train, including within the same team. Narrow the subquery to other teams' projects for strictly cross-team links.",
          requiresApp: 'ScriptRunner for Jira',
          verification: 'verified',
        },
      ],
    },
  ],
  gadgets: {
    datacenter: [
      g.twoDimensional('datacenter', PI, 'Project', 'Status'),
      g.pieChart('datacenter', PI, 'Status'),
      g.statistics('datacenter', LOAD, 'Project'),
      g.filterResults('datacenter', FLAGGED),
      g.filterResults('datacenter', DEPS),
    ],
    cloud: [
      g.twoDimensional('cloud', PI, 'Space (formerly Project)', 'Status'),
      g.pieChart('cloud', PI, 'Status'),
      g.statistics('cloud', LOAD, 'Space (formerly Project)'),
      g.filterResults('cloud', FLAGGED),
      g.filterResults('cloud', DEPS),
    ],
  },
  sources: [
    ...GADGET_SOURCES,
    SOURCES.safeGlossary,
    SOURCES.dcFlagging,
    SOURCES.cloudFlag,
    SOURCES.scriptRunnerDcLinks,
    SOURCES.scriptRunnerCloudLinks,
  ],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies DashboardGuide;
