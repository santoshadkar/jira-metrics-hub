import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'workflow-status-misuse',
  name: 'Workflow status misuse',
  framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  category: 'jira-hygiene',
  purpose:
    'Finds items whose status history or resolution does not make sense, because these break throughput, cycle time and every report that relies on "done".',
  howToRead:
    'Three common patterns: items in a done status with no resolution (queries that rely on the resolution or resolved date, like most throughput queries here, miss them), items with a resolution that are not done, and items moved straight from to-do to done (no time in progress, so cycle time is zero). A few are normal; many mean the workflow or its transitions need fixing.',
  formula:
    'Each pattern is a separate count returned directly by JQL. Investigate the items rather than combining the counts into one score.',
  calcMethod: 'jql-count',
  cadence: 'Monthly',
  misuseWarning:
    'This is a workflow design check, not a people check. Most misuse comes from workflows that make the right path awkward.',
  jql: [
    {
      edition: 'both',
      label: 'Done items with no resolution',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory = Done AND resolution is EMPTY',
      notes:
        'In Cloud, the resolution field does not exist in service team-managed spaces; the Cloud docs say to use statusCategory = Done there instead.',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'Items with a resolution that are not done',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory != Done AND resolution is not EMPTY',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'Items moved straight from To Do to Done in a period',
      jql: 'project = {{PROJECT_KEY}} AND status CHANGED FROM "To Do" TO "Done" DURING ("{{START_DATE}}", "{{END_DATE}}")',
      notes: 'Replace "To Do" and "Done" with your own status names.',
      verification: 'verified',
    },
  ],
  prerequisites: ['A Jira administrator able to change workflows when patterns show up.'],
  sources: [
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
    SOURCES.dcJqlOperators,
    SOURCES.cloudJqlOperators,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
