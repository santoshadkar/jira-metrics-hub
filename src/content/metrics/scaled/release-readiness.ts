import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'release-readiness',
  name: 'Release readiness',
  framework: ['scaled', 'scrum', 'kanban'],
  category: 'scaled',
  purpose:
    'Shows what still stands between the next release and going live: unfinished items, open bugs and blocked work in that release.',
  howToRead:
    "Check the three lists together in the run-up to a release. All three should trend to zero, or remaining items should be consciously moved out. The Data Center Version Report also predicts a release date from the team's progress since the version started.",
  formula:
    'Readiness is a set of counts for the release (version): open items, open bugs and flagged items. Each count comes directly from JQL. There is no single score.',
  calcMethod: 'jql-count',
  cadence: 'Weekly; daily in the last week before release',
  misuseWarning:
    'Moving open items to the next version just before the release makes the counts look clean while scope quietly shrinks. Make those moves visible to stakeholders.',
  jql: [
    {
      edition: 'both',
      label: 'Unfinished items in the earliest unreleased version',
      jql: 'project = {{PROJECT_KEY}} AND fixVersion = earliestUnreleasedVersion({{PROJECT_KEY}}) AND statusCategory != Done',
      notes:
        'earliestUnreleasedVersion() takes the project (Cloud: space) key. To check a specific version, use fixVersion = "version name".',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'Open bugs in the earliest unreleased version',
      jql: 'project = {{PROJECT_KEY}} AND fixVersion = earliestUnreleasedVersion({{PROJECT_KEY}}) AND type = Bug AND statusCategory != Done',
      verification: 'verified',
    },
    {
      edition: 'both',
      label: 'Flagged items in the earliest unreleased version',
      jql: 'project = {{PROJECT_KEY}} AND fixVersion = earliestUnreleasedVersion({{PROJECT_KEY}}) AND Flagged = Impediment',
      verification: 'verified',
    },
  ],
  prerequisites: ['Versions (releases) used, with items assigned to them through Fix version.'],
  sources: [
    SOURCES.dcVersionReport,
    SOURCES.cloudVersionReport,
    SOURCES.dcJqlFunctions,
    SOURCES.cloudJqlFunctions,
    SOURCES.dcFlagging,
    SOURCES.cloudFlag,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
