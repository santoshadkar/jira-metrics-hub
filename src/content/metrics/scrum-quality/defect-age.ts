import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'defect-age',
  name: 'Defect age',
  framework: ['scrum', 'kanban', 'scrumban'],
  category: 'scrum-quality',
  purpose:
    'Shows how long open bugs have been waiting, so old defects are either fixed or consciously closed rather than left to rot.',
  howToRead:
    'Look at the oldest open bugs and at how many are older than an age your team agrees matters (for example 30 or 90 days). A growing pile of old bugs means the backlog is not being triaged. Decide for each: fix, schedule, or close as "won\'t fix".',
  formula:
    'Defect age for an open bug = today minus its created date. JQL can list open bugs ordered by created date, and count those older than a chosen age; average or median age needs an export.',
  calcMethod: 'export-calc',
  cadence: 'Monthly, or at backlog refinement',
  misuseWarning:
    'Closing old bugs in bulk to "improve" the number hides real problems. Re-creating bugs resets their age. Agree what to do with old bugs before you start measuring.',
  jql: [
    {
      edition: 'both',
      label: 'Open bugs, oldest first',
      jql: 'project = {{PROJECT_KEY}} AND type = Bug AND statusCategory != Done ORDER BY created ASC',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'Open bugs older than 90 days',
      jql: 'project = {{PROJECT_KEY}} AND type = Bug AND statusCategory != Done AND created <= "-90d" ORDER BY created ASC',
      notes: 'Change -90d to the age your team agrees on.',
      verification: 'verified',
    },
  ],
  prerequisites: ['A Bug work type used consistently.'],
  sources: [SOURCES.dcJqlFields, SOURCES.cloudJqlFields, SOURCES.dcJqlOperators],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
