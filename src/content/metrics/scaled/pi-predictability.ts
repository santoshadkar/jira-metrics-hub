import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'pi-predictability',
  name: 'PI predictability (ART predictability measure)',
  framework: ['scaled'],
  category: 'scaled',
  purpose:
    'Shows how much of the business value a team or Agile Release Train planned for a Program Increment it actually delivered, so the train can improve how it plans and commits.',
  howToRead:
    "Read it as a trend over several PIs, not as a single score. At Inspect and Adapt, Business Owners assess the actual business value of each team's PI objectives, which gives each team an achievement score; the ART score is the average of the team scores. A score that is very low says the train over-committed or was disrupted; a score that is always at the maximum can mean objectives are being written too safely. Talk about the reasons, not the number.",
  formula:
    "Team achievement score = actual business value achieved ÷ planned business value of the team's PI objectives, as a percentage. ART predictability = the average of the team achievement scores for the PI. How uncommitted objectives count is set out in SAFe's Inspect and Adapt guidance, which sits behind a login and could not be confirmed here.",
  calcMethod: 'export-calc',
  cadence: 'Once per PI, at Inspect and Adapt',
  misuseWarning:
    'Business value scores are a negotiation between Business Owners and teams, so they are easy to game: teams write cautious objectives to protect their score, or inflate planned value. Comparing teams by score, or tying it to bonuses or reviews, makes this worse. It is a conversation starter for the Inspect and Adapt problem-solving workshop, not a performance rating.',
  jql: [
    {
      edition: 'both',
      label: 'PI objectives, if your ART records them as Jira issues with a PI label',
      jql: 'project = {{PROJECT_KEY}} AND type in ({{ISSUE_TYPES}}) AND labels = "{{LABEL}}" ORDER BY key ASC',
      notes:
        'Only useful if your train records PI objectives in Jira, for example with one issue type and a label per PI. Planned and actual business value live in whatever fields your organisation uses; JQL can list the objectives but cannot calculate the score.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'PI objectives written at PI Planning, with planned business value assigned by Business Owners.',
    'Actual business value assessed by Business Owners at Inspect and Adapt.',
    'One agreed place to record planned and actual business value per objective, for example fields on a Jira issue type or a shared spreadsheet. Decide this before PI Planning.',
  ],
  sources: [
    SOURCES.safeInspectAdaptGuide,
    SOURCES.safeGlossary,
    SOURCES.cloudJqlFields,
    SOURCES.dcJqlFields,
  ],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
