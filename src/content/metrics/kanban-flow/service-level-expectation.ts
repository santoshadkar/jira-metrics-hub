import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'service-level-expectation',
  name: 'Service level expectation (SLE) with percentiles',
  framework: ['kanban', 'scrumban'],
  category: 'kanban-flow',
  purpose:
    'Tells customers how long an item is likely to take, based on the team\'s own history, in the form "X% of items finish within N days".',
  howToRead:
    'The Kanban Guide describes an SLE as two parts: a period of elapsed days and a probability, based on historical cycle time. Its example is "85% of work items will be finished in eight days or less"; that is an illustration, not a target. Check each in-progress item\'s age against the SLE every day, and revisit the SLE itself when the process changes.',
  formula:
    "Take the cycle times of items finished recently (for example the last 30 to 50). The SLE at 85% is the cycle time that 85% of those items were at or below (the 85th percentile). Jira's Control Chart shows average, rolling average and standard deviation but no percentiles, so the percentile is calculated outside Jira.",
  calcMethod: 'export-calc',
  cadence: 'Recalculate monthly or when the process changes; use daily',
  misuseWarning:
    'An SLE is a forecast drawn from history, not a promise or a stick. Setting it from wishes instead of data, or punishing every miss, makes people game cycle time. Never quote an SLE without its percentage.',
  jql: [
    {
      edition: 'both',
      label: 'Recently finished items (export to calculate cycle-time percentiles)',
      jql: 'project = {{PROJECT_KEY}} AND type in ({{ISSUE_TYPES}}) AND resolved >= "{{START_DATE}}" AND resolved <= "{{END_DATE}}" ORDER BY resolved ASC',
      notes: 'Export with the start date of each item (from status history) and its resolved date.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'Agreed start and finish points.',
    'Cycle time history for enough finished items to be meaningful.',
    'A spreadsheet or tool to calculate percentiles.',
  ],
  sources: [SOURCES.kanbanGuide, SOURCES.dcControlChart, SOURCES.cloudControlChart],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
