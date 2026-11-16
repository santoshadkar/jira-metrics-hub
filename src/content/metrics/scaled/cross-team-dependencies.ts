import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'cross-team-dependencies',
  name: 'Cross-team dependencies',
  framework: ['scaled'],
  category: 'scaled',
  purpose:
    "Shows how many of a team's items depend on work owned by other teams, so the train can manage the riskiest dependencies and reduce them over time.",
  howToRead:
    'In SAFe, feature dependencies between teams are made visible on the ART Planning Board at PI Planning. In Jira, dependencies show up as issue links. Watch two things: the number of open cross-team dependencies, and whether it falls PI after PI. A train that keeps needing many dependencies may be organised around components rather than value.',
  formula:
    'Cross-team dependencies = open items in your team\'s project linked (for example with "is blocked by" or "depends on") to open items in other teams\' projects. Native JQL can find items that have a link type, but cannot check that the linked item belongs to another team; ScriptRunner\'s linkedIssuesOf can, or you can export the links and check them outside Jira.',
  calcMethod: 'export-calc',
  cadence: 'At PI Planning, and weekly during the PI',
  misuseWarning:
    'If dependencies are counted against a team, teams stop linking them and the risk goes underground. Fewer links in Jira is only good news if the real dependencies went away.',
  jql: [
    {
      edition: 'both',
      label: 'Our open items blocked by open items in other projects',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory != Done AND issueFunction in linkedIssuesOf("project != {{PROJECT_KEY}} AND statusCategory != Done", "blocks")',
      requiresApp: 'ScriptRunner for Jira',
      notes:
        'linkedIssuesOf("subquery", "blocks") returns items blocked by the items the subquery finds. Documented with the same syntax for Data Center and for Cloud Enhanced Search. Use your own link names (for example "depends on").',
      verification: 'verified',
    },
    {
      edition: 'datacenter',
      label: 'Our open items with any "is blocked by" link (native, not limited to other teams)',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory != Done AND issueLinkType = "is blocked by"',
      verification: 'verified',
    },
    {
      edition: 'cloud',
      label: 'Our open items with any "is blocked by" link (native, not limited to other teams)',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory != Done AND workItemLinkType = "is blocked by"',
      notes: 'Cloud calls this field workItemLinkType; Data Center calls it issueLinkType.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'Teams that record dependencies as issue links, using agreed link types.',
    'One project (or a clear filter) per team, so "another team" can be expressed in JQL.',
  ],
  sources: [
    SOURCES.safeGlossary,
    SOURCES.scriptRunnerDcLinks,
    SOURCES.scriptRunnerCloudLinks,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
