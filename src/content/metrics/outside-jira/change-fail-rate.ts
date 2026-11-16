import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'change-fail-rate',
  name: 'Change fail rate (DORA)',
  framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  category: 'outside-jira',
  purpose:
    "Shows what share of deployments cause a problem that needs immediate intervention, one of DORA's measures of instability.",
  howToRead:
    'Optional. Measured from your CI/CD and incident tools, not from Jira. DORA groups it under instability. Read it next to deployment frequency: speed that comes with a rising fail rate is not real improvement.',
  formula:
    'DORA defines it as the ratio of deployments that require immediate intervention following a deployment, likely a rollback or a hotfix. Failed deployments ÷ all deployments in the period.',
  calcMethod: 'external-tool',
  cadence: 'Monthly',
  misuseWarning:
    'If failures are punished, they get reclassified ("that was a planned patch"). Agree in advance what counts as a failed deployment, and keep it blameless.',
  jql: [],
  prerequisites: [
    'Deployment records and a way to mark which deployments needed immediate remediation.',
  ],
  sources: [SOURCES.doraMetrics],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
