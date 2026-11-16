import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'backlog-age',
  name: 'Backlog age',
  framework: ['scrum', 'scrumban', 'kanban'],
  category: 'backlog-refinement',
  purpose:
    'Shows how old the items in the backlog are overall, as a signal of whether the backlog is a living plan or a growing archive.',
  howToRead:
    'Look at the age profile: how many items are under a month, under six months, over a year old. A backlog that only grows older is not being prioritised. Unlike stale items (not updated), age is measured from when the item was created.',
  formula:
    'Age of a backlog item = today minus its created date. Counts per age band come straight from JQL (one query per band); averages or medians need an export.',
  calcMethod: 'export-calc',
  cadence: 'Quarterly',
  misuseWarning:
    'Deleting and re-creating items to reset their age hides the problem. Age alone does not mean an item is wrong; some long-term ideas are kept deliberately.',
  jql: [
    {
      edition: 'both',
      label: 'Not-started items, oldest first',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory = "To Do" ORDER BY created ASC',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'Not-started items older than one year',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory = "To Do" AND created <= "-52w"',
      notes: 'Relative dates accept w (weeks) and d (days).',
      verification: 'verified',
    },
  ],
  prerequisites: ['None beyond a project backlog.'],
  sources: [
    SOURCES.dcJqlFields,
    SOURCES.dcJqlOperators,
    SOURCES.cloudJqlFields,
    SOURCES.cloudKbStatusCategory,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
