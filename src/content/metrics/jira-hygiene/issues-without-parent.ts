import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'issues-without-parent',
  name: 'Issues without epic or parent',
  framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  category: 'jira-hygiene',
  purpose:
    'Lists standard work items that are not linked to any epic, so epic and roadmap reports are not missing work.',
  howToRead:
    'Some unlinked work is fine (small fixes, maintenance). A large share of unlinked items means epic progress, roadmaps and release reports understate the real work. Agree which work types must have a parent.',
  formula:
    'Count of standard work items with no epic. In Data Center this is a direct JQL count. In Cloud, the documented "parent" field does not support IS or IS NOT, so "no parent" cannot be expressed with native JQL from the documented operators; use a board or plan view, an export, or a Marketplace app.',
  calcMethod: 'jql-count',
  cadence: 'Weekly',
  misuseWarning:
    'Creating a catch-all "miscellaneous" epic just to empty this list makes epic reports meaningless. Better to agree which work genuinely needs a parent.',
  jql: [
    {
      edition: 'datacenter',
      label: 'Open standard items not linked to any epic',
      jql: 'project = {{PROJECT_KEY}} AND type in standardIssueTypes() AND type != Epic AND "epic link" is EMPTY AND statusCategory != Done',
      notes: '"epic link" supports IS and IS NOT in Data Center 10.7.',
      verification: 'verified',
    },
  ],
  prerequisites: ['Epics in use, and an agreement on which work types must belong to one.'],
  sources: [SOURCES.dcJqlFields, SOURCES.dcJqlFunctions, SOURCES.cloudJqlFields],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
