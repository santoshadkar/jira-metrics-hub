import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'sprint-predictability',
  name: 'Sprint predictability',
  framework: ['scrum'],
  category: 'scrum-delivery',
  purpose:
    'Shows how consistently the team delivers what it plans across several sprints, so stakeholders know how far they can rely on sprint forecasts.',
  howToRead:
    'Look at commitment reliability for the last six or so sprints together. A narrow, steady band means forecasts can be trusted. Wide swings mean forecasts need a range, and the team should look at what causes the swings. SAFe defines a similar idea at train level (Flow Predictability: how consistently teams meet their commitments).',
  formula:
    "There is no single standard formula. A practical one: take each sprint's commitment reliability (completed ÷ committed) over the last N sprints and report the range or the spread. Both inputs come from the Velocity Chart.",
  calcMethod: 'export-calc',
  cadence: 'Monthly or per release, over the last several sprints',
  misuseWarning:
    'Predictability is easy to buy by committing to very little. Pair it with outcome measures. Never rank teams by it.',
  jql: [],
  prerequisites: [
    'Several completed sprints with consistent sprint length.',
    'Commitment reliability tracked per sprint.',
  ],
  sources: [SOURCES.dcVelocityChart, SOURCES.cloudVelocityChart, SOURCES.safeGlossary],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
