import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'cross-team-blockers',
  name: 'Cross-team blockers',
  framework: ['scaled'],
  category: 'scaled',
  purpose:
    'Lists items that are blocked right now, either flagged or waiting on another team, so the train can escalate and clear them quickly.',
  howToRead:
    "Review at the train's sync meetings. Every blocker should have an owner and a next step. Track how long blockers stay open; old blockers between teams usually need someone above the teams to decide.",
  formula:
    'Cross-team blockers now = count of open items that are flagged as an impediment or blocked by an open item in another team\'s project. JQL returns the count directly; the "other team" part needs ScriptRunner.',
  calcMethod: 'jql-count',
  cadence: 'At every ART sync or Scrum of Scrums',
  misuseWarning:
    'Counting blockers per team turns them into blame. The point is to make them visible so they get removed.',
  jql: [
    {
      edition: 'both',
      label: "Flagged open items across the train's projects",
      jql: 'project in ({{PROJECT_KEY}}) AND Flagged = Impediment AND statusCategory != Done ORDER BY updated ASC',
      notes: "Put all of the train's project keys, comma-separated, in Project key.",
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'Our open items blocked by open items in other projects',
      jql: 'project = {{PROJECT_KEY}} AND statusCategory != Done AND issueFunction in linkedIssuesOf("project != {{PROJECT_KEY}} AND statusCategory != Done", "blocks")',
      requiresApp: 'ScriptRunner for Jira',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'Teams that flag blocked items and link dependencies.',
    'For the second query: ScriptRunner (Data Center) or ScriptRunner Enhanced Search (Cloud).',
  ],
  sources: [
    SOURCES.dcFlagging,
    SOURCES.cloudFlag,
    SOURCES.scriptRunnerDcLinks,
    SOURCES.scriptRunnerCloudLinks,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
