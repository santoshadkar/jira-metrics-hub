import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'deployment-frequency',
  name: 'Deployment frequency (DORA)',
  framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  category: 'outside-jira',
  purpose:
    "Shows how often the team deploys to production, one of DORA's measures of software delivery throughput.",
  howToRead:
    'Optional. Measured from your CI/CD and incident tools, not from Jira. DORA groups it under throughput. Look at the trend for one application or service. More frequent, smaller deployments are usually easier to recover from; DORA suggests reducing batch size as a common way to improve all its metrics.',
  formula:
    'DORA defines it as the number of deployments over a given period, or the time between deployments. Counted from deployment events in your pipeline.',
  calcMethod: 'external-tool',
  cadence: 'Weekly or monthly',
  misuseWarning:
    'Deploying trivial changes to raise the count, or comparing teams whose products and constraints differ, makes the number meaningless. DORA metrics describe a delivery system, not individual performance.',
  jql: [],
  prerequisites: [
    'A CI/CD pipeline that records production deployments.',
    'A clear definition of what counts as a deployment for this service.',
  ],
  sources: [SOURCES.doraMetrics],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
