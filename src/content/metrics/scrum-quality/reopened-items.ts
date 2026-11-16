import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'reopened-items',
  name: 'Reopened items',
  framework: ['scrum', 'kanban', 'scrumban'],
  category: 'scrum-quality',
  purpose:
    'Counts work items that were marked done and then moved back, a sign that "done" did not really mean done.',
  howToRead:
    'A few reopened items are normal. A steady stream points to a weak or ignored Definition of Done, or to testing that happens after "done". Look at why each item was reopened.',
  formula:
    'Reopened items = items whose status changed from your done status back to another status in the period. JQL counts this directly using the CHANGED operator on the status field.',
  calcMethod: 'jql-count',
  cadence: 'Every sprint or monthly',
  misuseWarning:
    'If reopening is punished, people create a new item instead of reopening the old one, and the problem disappears from the data. Keep it a learning signal.',
  jql: [
    {
      edition: 'both',
      label: 'Items moved out of Done during a period',
      jql: 'project = {{PROJECT_KEY}} AND status CHANGED FROM "Done" DURING ("{{START_DATE}}", "{{END_DATE}}")',
      notes:
        'Replace "Done" with your own done status name; if you have several done statuses, repeat the clause with OR. CHANGED supports FROM and DURING in both editions.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'A workflow that allows moving items back from done (otherwise reopening shows as new items).',
  ],
  sources: [SOURCES.dcJqlOperators, SOURCES.cloudJqlOperators],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
