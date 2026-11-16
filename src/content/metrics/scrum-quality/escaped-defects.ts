import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'escaped-defects',
  name: 'Escaped defects',
  framework: ['scrum', 'kanban', 'scrumban'],
  category: 'scrum-quality',
  purpose:
    'Counts the defects found after work was released to users, so the team can see whether its Definition of Done and testing catch problems early enough.',
  howToRead:
    'Watch the trend per release or per month, and read each escaped defect: what kind of problem was it, and which check should have caught it? A rising trend says quality practices are slipping. Atlassian lists defect escape rate alongside cycle time and change failure rate as a delivery metric to track.',
  formula:
    'Escaped defects = number of bugs found in production in the period. Escape rate = escaped defects ÷ all defects found in the period (in development and in production). Jira cannot tell where a bug was found unless the team records it, for example with an agreed label or field; this is an organisation convention, not a Jira feature.',
  calcMethod: 'export-calc',
  cadence: 'Per release or monthly',
  misuseWarning:
    'If teams are blamed for escaped defects, bugs get logged as "changes" or "improvements", or not logged at all. Never attribute escaped defects to individuals. Count honestly and use them to improve the system of testing.',
  jql: [
    {
      edition: 'both',
      label: 'Bugs created in a period that carry your "found in production" label',
      jql: 'project = {{PROJECT_KEY}} AND type = Bug AND labels = "{{LABEL}}" AND created >= "{{START_DATE}}" AND created <= "{{END_DATE}}" ORDER BY created DESC',
      notes:
        'Assumes your organisation labels production bugs consistently (put that label in the Label value). Some organisations use a custom field or a separate work type instead.',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'All bugs created in the period (the denominator)',
      jql: 'project = {{PROJECT_KEY}} AND type = Bug AND created >= "{{START_DATE}}" AND created <= "{{END_DATE}}"',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'A Bug work type in use.',
    'An agreed, consistently applied way to mark where a bug was found (label, field or work type).',
  ],
  sources: [SOURCES.atlassianSoftwareDev, SOURCES.dcJqlFields, SOURCES.cloudJqlFields],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
