import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'blocked-items',
  name: 'Blocked items and blocked time',
  framework: ['kanban', 'scrumban', 'scrum'],
  category: 'kanban-flow',
  purpose:
    'Shows which items are blocked right now and, over time, how long work spends blocked, so the team can attack the most common causes.',
  howToRead:
    'Check blocked items every day and act on them first. Over a month, group blockers by cause (another team, an environment, a decision) to find the systemic ones. Flagged items show in yellow on Jira boards and backlogs in both editions.',
  formula:
    "Blocked items now = count of items flagged as an impediment (JQL returns this directly). Blocked time = total time items spent flagged; this needs the flag history from an export, because JQL's CHANGED and WAS operators are not documented for the Flagged field.",
  calcMethod: 'jql-count',
  cadence: 'Daily for blocked items; monthly for blocked time and causes',
  misuseWarning:
    'If blocked items look bad on a report, people stop flagging them, and the board stops showing real problems. Make flagging safe and expected.',
  jql: [
    {
      edition: 'both',
      label: 'Items flagged as blocked (the count is the number blocked now)',
      jql: 'project = {{PROJECT_KEY}} AND Flagged = Impediment AND statusCategory != Done ORDER BY updated ASC',
      notes:
        'Both editions document that the flag is stored in a custom checkbox field called "Flagged" with the single value Impediment.',
      verification: 'verified',
    },
    {
      edition: 'datacenter',
      label: 'Open items that have an "is blocked by" link',
      jql: 'project = {{PROJECT_KEY}} AND issueLinkType = "is blocked by" AND statusCategory != Done',
      notes: "Link type names depend on your instance's issue linking configuration.",
      verification: 'verified',
    },
    {
      edition: 'cloud',
      label: 'Open items that have an "is blocked by" link',
      jql: 'project = {{PROJECT_KEY}} AND workItemLinkType = "is blocked by" AND statusCategory != Done',
      notes:
        "Cloud documents this field as workItemLinkType; Data Center calls it issueLinkType. Link type names depend on your site's configuration.",
      verification: 'verified',
    },
  ],
  prerequisites: [
    'A team habit of flagging blocked items (and adding a comment saying why).',
    'For blocked time: an export of the flag history, or a Marketplace app that reports it.',
  ],
  sources: [
    SOURCES.dcFlagging,
    SOURCES.cloudFlag,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
    SOURCES.dcJqlOperators,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
