import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'aging-wip',
  name: 'Aging work in progress (work item age)',
  framework: ['kanban', 'scrumban'],
  category: 'kanban-flow',
  purpose:
    'Shows how long each unfinished item has been in progress, so the team can act on items that are getting stuck before they become late.',
  howToRead:
    "Check it at every daily meeting. Compare each item's age with the team's cycle time history or its service level expectation: an item older than most finished items is at risk and needs attention now. The Kanban Guide asks teams to make sure items do not age unnecessarily, using the SLE as the reference. Jira's \"Days in column\" card indicator is a quick visual clue, but it measures days in the current column (adding up repeat visits to that column), not age since work started.",
  formula:
    "For each item started but not yet finished: work item age = today minus the date the item passed the team's start point. JQL cannot calculate this, because it needs the date each item entered the first in-progress status. Export the in-progress items with their status history and calculate age outside Jira.",
  calcMethod: 'export-calc',
  cadence: 'Daily',
  misuseWarning:
    'Age is a signal to swarm on stuck work, not a stick to hit people with. Closing items early, or moving them back to a "To Do" status to reset the clock, hides the problem. Do not compare ages across teams with different workflows. Watch for "Days in column" being read as total age: an item can look fresh in its current column after weeks in progress.',
  jql: [
    {
      edition: 'datacenter',
      label: 'Items currently in progress, oldest created first',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory = "In Progress" ORDER BY created ASC',
      notes:
        'Lists current WIP only. Sorting by created is a rough proxy: the created date is not the date work started.',
      verification: 'verified',
    },
    {
      edition: 'cloud',
      label: 'Items currently in progress, oldest created first',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory = "In Progress" ORDER BY created ASC',
      notes:
        'Lists current WIP only. Sorting by created is a rough proxy: the created date is not the date work started. For a better proxy in Cloud, see the statusCategoryChangedDate query below.',
      verification: 'verified',
    },
    {
      edition: 'cloud',
      label: 'In progress for 14 days or more (since entering the In Progress category)',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory = "In Progress" AND statusCategoryChangedDate <= -14d ORDER BY statusCategoryChangedDate ASC',
      notes:
        'Cloud only. statusCategoryChangedDate is documented in an Atlassian Cloud knowledge-base article, not in the Data Center docs. Moving between two statuses that are both "In Progress" does not reset it, so it is a close proxy for work item age. Change -14d to suit your history.',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'In-progress items not updated for 14 days or more (a staleness check, not age)',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory = "In Progress" AND updated <= "-14d" ORDER BY updated ASC',
      notes:
        'Any edit or comment resets "updated", so a stuck item with recent comments will not show. Change -14d to suit your cycle time history.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'Agreed start and finish points in the workflow (the Kanban Guide calls this the Definition of Workflow).',
    'Statuses assigned to the right status category, so "In Progress" really means started work.',
    'Optional visual: the "Days in column" card setting. Data Center: board configuration, Columns tab. Cloud: view settings. It is on by default for Kanban boards and off for Scrum boards in both editions.',
    'For true age: an export of in-progress items with their status change history.',
  ],
  sources: [
    SOURCES.kanbanGuide,
    SOURCES.dcCustomizingCards,
    SOURCES.cloudCustomizeCards,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
    SOURCES.cloudKbStatusCategory,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
