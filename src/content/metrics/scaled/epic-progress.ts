import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'epic-progress',
  name: 'Epic progress',
  framework: ['scaled', 'scrum', 'kanban'],
  category: 'scaled',
  purpose:
    'Shows how far each open epic has got, measured by its finished child items, so leaders can see progress across a train or tribe without reading team boards.',
  howToRead:
    'The Data Center Epic Report lists complete, incomplete and unestimated issues in an epic over time; Cloud has an Epic Burndown report. Across many epics, compare the share of child items done. Watch for epics that stay at the same percentage for weeks, and for epics whose child count keeps growing.',
  formula:
    'Epic progress = finished child items ÷ all child items (or the same with estimates). Per epic, run the two queries below and divide. Note that an epic with few child items created yet will look further along than it is.',
  calcMethod: 'export-calc',
  cadence: 'Weekly or every sprint',
  misuseWarning:
    'Percent complete rewards creating few, large child items late. It measures output, not outcome: a 100% epic may still have delivered no value. Treat it as a conversation starter.',
  jql: [
    {
      edition: 'datacenter',
      label: 'All child items of an epic',
      jql: '"epic link" = {{EPIC_KEY}}',
      notes: 'In Data Center, "parent" finds sub-tasks only.',
      verification: 'verified',
    },
    {
      edition: 'cloud',
      label: 'All child items of an epic',
      jql: 'parent = {{EPIC_KEY}}',
      verification: 'verified',
    },
    {
      edition: 'datacenter',
      label: 'Finished child items of an epic',
      jql: '"epic link" = {{EPIC_KEY}} AND statusCategory = Done',
      verification: 'verified',
    },
    {
      edition: 'cloud',
      label: 'Finished child items of an epic',
      jql: 'parent = {{EPIC_KEY}} AND statusCategory = Done',
      verification: 'verified',
    },
  ],
  prerequisites: ['Child items consistently linked to their epic.'],
  sources: [
    SOURCES.dcEpicReport,
    SOURCES.cloudEpicBurndown,
    SOURCES.dcJqlFields,
    SOURCES.cloudJqlFields,
  ],
  verification: 'verified',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
