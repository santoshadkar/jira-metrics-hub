import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'flow-efficiency',
  name: 'Flow efficiency',
  framework: ['kanban', 'scrumban', 'scaled'],
  category: 'kanban-flow',
  purpose:
    "Shows what share of an item's elapsed time was spent actively working on it rather than waiting, which points to where delay really comes from.",
  howToRead:
    'Most of the delay in knowledge work is usually waiting: for reviews, for other teams, for decisions. A low flow efficiency says the fastest improvement comes from removing waits, not from working faster. Treat the number as approximate: it depends entirely on which statuses you call "active".',
  formula:
    'Flow efficiency = time in active (value-adding) statuses ÷ total flow time, as a percentage. SAFe defines it as the ratio of the total time spent in value-added work activities divided by the total flow time. Calculating it needs the time each item spent in each status, which means exporting status history; JQL cannot do it.',
  calcMethod: 'export-calc',
  cadence: 'Monthly or quarterly',
  misuseWarning:
    'If teams are pushed to raise flow efficiency, waiting gets relabelled as "active" or work is moved without really progressing. Agree the active/waiting split of statuses first and keep it stable.',
  jql: [
    {
      edition: 'both',
      label: 'Items finished in a period (export with status history to calculate)',
      jql: 'project = {{PROJECT_KEY}} AND type in ({{ISSUE_TYPES}}) AND resolved >= "{{START_DATE}}" AND resolved <= "{{END_DATE}}"',
      notes:
        'This only selects the items; the time per status has to come from an export of their change history.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'Workflow statuses that separate active work from waiting (for example "In review" vs "Waiting for review").',
    'A way to export the status change history of finished items.',
  ],
  sources: [SOURCES.safeGlossary, SOURCES.dcJqlFields, SOURCES.cloudJqlFields],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
