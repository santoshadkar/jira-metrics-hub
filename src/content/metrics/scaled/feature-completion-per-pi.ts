import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'feature-completion-per-pi',
  name: 'Feature completion per PI',
  framework: ['scaled'],
  category: 'scaled',
  purpose:
    'Shows how many of the features planned for a Program Increment were actually finished in it, as a delivery signal alongside PI predictability.',
  howToRead:
    'SAFe describes a feature as functionality sized to be delivered by an Agile Release Train within a PI. Compare planned and finished features per PI over several PIs. Unfinished features are not failures in themselves; look at why they slipped (dependencies, scope growth, under-estimation) and whether the same causes repeat.',
  formula:
    'Feature completion = features finished in the PI ÷ features planned for the PI. Jira does not know which features were "planned for a PI" unless the train records it, for example with a label or fix version per PI. Count both lists with JQL and divide outside Jira.',
  calcMethod: 'export-calc',
  cadence: 'Once per PI, at Inspect and Adapt; mid-PI as a check',
  misuseWarning:
    'Counting features rewards splitting them small or planning fewer. Feature counts say nothing about value: pair this with PI predictability, which uses business value. Do not compare trains whose features differ in size.',
  jql: [
    {
      edition: 'both',
      label: 'Features planned for the PI (marked with a PI label)',
      jql: 'project = {{PROJECT_KEY}} AND type in ({{ISSUE_TYPES}}) AND labels = "{{LABEL}}"',
      notes:
        'Set Issue types to your feature work type and Label to the PI label your train uses. If you use a fix version per PI instead, replace the labels clause with fixVersion = "your PI version".',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'Features planned for the PI that are finished',
      jql: 'project = {{PROJECT_KEY}} AND type in ({{ISSUE_TYPES}}) AND labels = "{{LABEL}}" AND statusCategory = Done',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'A feature work type (or the level your train plans at).',
    'An agreed way to mark the PI a feature was planned for, applied at PI Planning.',
  ],
  sources: [SOURCES.safeGlossary, SOURCES.dcJqlFields, SOURCES.cloudJqlFields],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
