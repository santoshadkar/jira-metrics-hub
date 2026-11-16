import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'backlog-items-without-estimate',
  name: 'Backlog items without estimate',
  framework: ['scrum', 'scrumban'],
  category: 'backlog-refinement',
  purpose:
    'Lists backlog items near the top that have not been estimated, so refinement can focus on them before they reach Sprint Planning.',
  howToRead:
    'Look at unestimated items in the top part of the backlog, not the whole backlog. Items far down do not need estimates yet. If the top of the backlog is full of unestimated items, refinement is falling behind. Charts that add up estimates cannot count work that has no estimate, so a backlog full of unestimated items makes forecasts look better than they are. The Data Center Epic Report lists unestimated issues separately for this reason.',
  formula:
    'Count of not-started items with an empty estimation field. JQL returns the count directly.',
  calcMethod: 'jql-count',
  cadence: 'Before each refinement session',
  misuseWarning:
    'Forcing an estimate on everything just to empty this list produces meaningless numbers. Teams that forecast with item counts instead of points may not need estimates at all; agree first whether this metric applies.',
  jql: [
    {
      edition: 'datacenter',
      label: 'Not-started items without an estimate',
      jql: 'project = {{PROJECT_KEY}} AND type in ({{ISSUE_TYPES}}) AND statusCategory = "To Do" AND "Story Points" is EMPTY ORDER BY created ASC',
      notes:
        'The Data Center docs confirm searching a custom field by name or by ID (cf[12345], safer), but do not name the story points field itself. Check the field name on your instance.',
      verification: 'needs-verification',
    },
    {
      edition: 'cloud',
      label: 'Not-started items without an estimate',
      jql: 'project = {{PROJECT_KEY}} AND type in ({{ISSUE_TYPES}}) AND statusCategory = "To Do" AND "Story points" is EMPTY ORDER BY created ASC',
      notes:
        'Company-managed spaces use "Story points". In team-managed spaces, use "Story point estimate" instead: the two are different fields.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'A story points (or other estimate) field on the work types the team estimates.',
    'An agreed list of work types that should be estimated.',
  ],
  sources: [
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
    SOURCES.cloudMigrateSpaces,
    SOURCES.cloudKbStatusCategory,
    SOURCES.dcEpicReport,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
