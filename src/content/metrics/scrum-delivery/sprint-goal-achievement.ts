import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'sprint-goal-achievement',
  name: 'Sprint goal achievement',
  framework: ['scrum'],
  category: 'scrum-delivery',
  purpose:
    'Tracks how often the team meets its Sprint Goal, the single objective the Scrum Guide says each sprint is for.',
  howToRead:
    'At the Sprint Review, the team and stakeholders decide whether the goal was met: yes, partly or no, with a short reason. Look at the trend over several sprints and at the reasons. A team can finish most items and still miss the goal, or meet the goal while some items roll over; the goal is what matters.',
  formula:
    'Sprint goal achievement = sprints where the goal was met ÷ sprints in the period. The judgement is made by people at the Sprint Review; Jira does not record whether a goal was met.',
  calcMethod: 'external-tool',
  cadence: 'Every sprint, at the Sprint Review',
  misuseWarning:
    'If teams are judged on this, they write goals that cannot fail ("work on the backlog"). A vague goal makes the number meaningless. Use it to improve how goals are written and protected, not to compare teams.',
  jql: [],
  prerequisites: [
    'A Sprint Goal written at Sprint Planning for every sprint.',
    'A simple record of the outcome per sprint, agreed at the Sprint Review (for example in the review notes).',
  ],
  sources: [SOURCES.scrumGuide],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
