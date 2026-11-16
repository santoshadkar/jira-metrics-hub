import type { MetricContent } from '../../../types/index.ts';
import { SOURCES } from '../../sources.ts';

export default {
  id: 'team-capacity-load',
  name: 'Capacity and load per team',
  framework: ['scaled'],
  category: 'scaled',
  purpose:
    'Compares the work planned for each team in upcoming sprints with what that team has actually been able to finish, so overloaded teams are visible before the PI starts.',
  howToRead:
    'For each team, put planned load next to demonstrated capacity (recent velocity or throughput). Load well above capacity means the plan will slip; reduce scope or move work before the PI starts. Persistently overloaded teams are a structural problem.',
  formula:
    "Load ratio = estimate (or item count) planned in future sprints ÷ the team's recent average velocity (or throughput) for the same number of sprints. Jira lists the planned items per team; the comparison is done outside Jira. There is no single published formula for this; the one here is a practical proposal.",
  calcMethod: 'export-calc',
  cadence: 'At PI Planning and at each sprint planning',
  misuseWarning:
    'Planning to 100% of capacity leaves no room for unplanned work and makes slips certain. Capacity based on hours booked rather than past delivery misleads. Never compare teams by load ratio.',
  jql: [
    {
      edition: 'both',
      label: "Items planned into future sprints for one team's project",
      jql: 'project = {{PROJECT_KEY}} AND sprint in futureSprints()',
      notes:
        'Export with the estimate field and sum per sprint. If several teams share a project, add your team or board filter.',
      verification: 'verified',
    },
  ],
  prerequisites: [
    'Future sprints created and planned for each team.',
    'Velocity or throughput history per team.',
  ],
  sources: [
    SOURCES.dcVelocityChart,
    SOURCES.cloudVelocityChart,
    SOURCES.dcJqlFunctions,
    SOURCES.cloudJqlFunctions,
  ],
  verification: 'needs-verification',
  lastReviewed: '2026-11-16',
} satisfies MetricContent;
