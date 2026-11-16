import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'failed-deployment-recovery-time',
  name: 'Failed deployment recovery time (DORA)',
  framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  category: 'outside-jira',
  purpose:
    'Shows how long it takes to recover when a deployment fails and needs immediate intervention.',
  howToRead:
    'Optional. Measured from your CI/CD and incident tools, not from Jira. DORA groups it under throughput. DORA replaced the older mean time to restore (MTTR) with this measure. Look at the trend and at the slowest recoveries: what made them slow?',
  formula:
    'DORA defines it as the time it takes to recover from a deployment that fails and requires immediate intervention. Calculated from incident or deployment records.',
  calcMethod: 'external-tool',
  cadence: 'Monthly',
  misuseWarning:
    'Declaring recovery early, or not recording incidents, flatters the number. Do not compare services with very different architectures.',
  jql: [],
  prerequisites: [
    'Incident or deployment records with the time a failure started and the time it was resolved.',
  ],
  sources: [SOURCES.doraMetrics],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
