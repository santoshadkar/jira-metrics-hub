import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'due-date-performance',
  name: 'Due date performance',
  framework: ['kanban', 'scrumban', 'scrum'],
  category: 'kanban-flow',
  purpose:
    'Shows how often items with a real external deadline were finished by their due date, and which open items are already late.',
  howToRead:
    'Only meaningful for items that genuinely have a fixed date (a regulatory change, an event). Check the overdue list often enough to act on it. Over time, look at the share delivered on time and at why late items were late.',
  formula:
    'Due date performance = items finished on or before their due date ÷ all finished items that had a due date. JQL cannot compare two date fields with each other, so export the due and resolved dates and compare them outside Jira. The list of open overdue items, though, comes straight from JQL.',
  calcMethod: 'export-calc',
  cadence: 'Weekly',
  misuseWarning:
    'If every item gets a due date, the field loses its meaning and teams learn to set dates they know they can hit. Use due dates only for real external commitments.',
  jql: [
    {
      edition: 'both',
      label: 'Open items that are already past their due date',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory != Done AND due < startOfDay() ORDER BY due ASC',
      verification: 'verified',
    },
    {
      edition: 'both',
      label:
        'Items with a due date finished in a period (export to compare due and resolved dates)',
      jql: 'project = {{PROJECT_KEY}} AND due is not EMPTY AND resolved >= "{{START_DATE}}" AND resolved <= "{{END_DATE}}"',
      verification: 'verified',
    },
  ],
  prerequisites: ['Due dates set only for items with real fixed-date commitments.'],
  sources: [
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
    SOURCES.dcJqlFunctions,
    SOURCES.cloudJqlFunctions,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
