import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'items-without-acceptance-criteria',
  name: 'Items without acceptance criteria',
  framework: ['scrum', 'scrumban', 'kanban'],
  category: 'backlog-refinement',
  purpose:
    'Lists items coming up for work that have no acceptance criteria, so the team can clarify them before starting rather than discovering gaps mid-way.',
  howToRead:
    'Focus on the items most likely to be pulled next. A long list here usually shows up later as rework, reopened items or long cycle times.',
  formula:
    'Count of not-started items with no acceptance criteria recorded. Jira has no standard acceptance criteria field, so how this is counted depends on where your organisation keeps them: a dedicated custom field (use "is EMPTY") or a heading in the description (use a text search).',
  calcMethod: 'jql-count',
  cadence: 'Before each refinement session',
  misuseWarning:
    'Copy-paste criteria added only to clear the list are worse than none. The goal is shared understanding, not a filled-in field.',
  jql: [
    {
      edition: 'both',
      label: 'Not-started items whose description does not mention acceptance criteria',
      jql: 'project = {{PROJECT_KEY}} AND type in ({{ISSUE_TYPES}}) AND statusCategory = "To Do" AND description !~ "acceptance criteria"',
      notes:
        'Only works if the team writes a heading such as "Acceptance criteria" in the description. Text search matches words, not exact layout, so treat the result as a guide. Check separately for items whose description is empty (description is EMPTY).',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'Not-started items with an empty acceptance criteria custom field',
      jql: 'project = {{PROJECT_KEY}} AND type in ({{ISSUE_TYPES}}) AND statusCategory = "To Do" AND "Acceptance criteria" is EMPTY',
      notes:
        'Only if your instance has a custom field with this name (it is not a standard Jira field). Searching by the field ID, cf[12345], is safer.',
      verification: 'needs-verification',
    },
  ],
  prerequisites: [
    'An agreed place to record acceptance criteria (description heading or custom field).',
  ],
  sources: [SOURCES.dcJqlFields, SOURCES.cloudJqlFields, SOURCES.cloudKbStatusCategory],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
