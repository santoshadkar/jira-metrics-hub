import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'change-lead-time',
  name: 'Change lead time (DORA)',
  framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  category: 'outside-jira',
  purpose:
    "Shows how long a code change takes to reach production once it is committed, one of DORA's throughput measures.",
  howToRead:
    'Optional. Measured from your CI/CD and incident tools, not from Jira. DORA groups it under throughput. A long or growing change lead time points at slow reviews, long test cycles or batched releases. Do not confuse it with Jira lead time, which starts when a request is logged.',
  formula:
    'DORA defines it as the time it takes for a change to go from committed to version control to deployed in production. Calculated from commit and deployment timestamps.',
  calcMethod: 'external-tool',
  cadence: 'Weekly or monthly',
  misuseWarning:
    'Splitting commits or bypassing review to shorten the number trades speed for stability. Read it together with change fail rate.',
  jql: [],
  prerequisites: ['Version control and deployment data that can be linked (commit to deployment).'],
  sources: [SOURCES.doraMetrics],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
