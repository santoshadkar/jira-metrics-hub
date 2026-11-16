import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'deployment-rework-rate',
  name: 'Deployment rework rate (DORA)',
  framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  category: 'outside-jira',
  purpose:
    "Shows what share of deployments were unplanned and happened because of an incident in production, DORA's second instability measure.",
  howToRead:
    'Optional. Measured from your CI/CD and incident tools, not from Jira. DORA groups it under instability. A rising rework rate means more deployment capacity goes into fixing production than into planned change.',
  formula:
    'DORA defines it as the ratio of deployments that are unplanned but happen as a result of an incident in production. Unplanned incident-driven deployments ÷ all deployments.',
  calcMethod: 'external-tool',
  cadence: 'Monthly',
  misuseWarning:
    'Labelling urgent fixes as planned work hides the rework. Keep the classification rules simple and agreed.',
  jql: [],
  prerequisites: [
    'Deployment records that distinguish planned deployments from incident-driven ones.',
  ],
  sources: [SOURCES.doraMetrics],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
