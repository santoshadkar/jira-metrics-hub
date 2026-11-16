import type { Role } from '../types/index.ts';

/**
 * Roles shown across the portal. Data-driven: add a role here and it appears on
 * the role pages and the mandate matrix. Then give it mandates in mandates.ts.
 */
const roles: Role[] = [
  {
    id: 'team-member',
    name: 'Developer or team member',
    description:
      'Builds, tests and delivers the work. Uses metrics to plan their own commitments and spot work that is stuck.',
    framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  },
  {
    id: 'scrum-master',
    name: 'Scrum Master',
    description:
      'Helps the team use Scrum well. Uses metrics to start conversations in planning, reviews and retrospectives, not to judge people.',
    framework: ['scrum', 'scrumban'],
  },
  {
    id: 'product-owner',
    name: 'Product Owner',
    description:
      'Owns the backlog and its order. Uses metrics to forecast delivery and keep the backlog ready for the team.',
    framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  },
  {
    id: 'agile-coach',
    name: 'Agile Coach',
    description:
      'Coaches teams and leaders across several teams. Uses metrics to spot patterns and to teach good use of data.',
    framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  },
  {
    id: 'flow-manager',
    name: 'Kanban flow manager or service delivery manager',
    description:
      'Looks after the flow of work through a Kanban system and the service level the team offers its customers.',
    framework: ['kanban', 'scrumban'],
  },
  {
    id: 'engineering-manager',
    name: 'Engineering manager',
    description:
      'Supports the people and the technical health of one or more teams. Uses metrics to remove systemic blockers.',
    framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  },
  {
    id: 'delivery-manager',
    name: 'Delivery or program manager',
    description:
      'Coordinates delivery across teams and stakeholders. Uses metrics for forecasting and risk.',
    framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  },
  {
    id: 'rte',
    name: 'Release Train Engineer',
    description:
      'Facilitates the Agile Release Train and its events, including PI Planning and Inspect and Adapt.',
    framework: ['scaled'],
  },
  {
    id: 'tribe-lead',
    name: 'Tribe lead or product line lead',
    description:
      'Leads a group of teams working on one product area. Uses metrics to see whether the group is delivering what it planned.',
    framework: ['scaled'],
  },
  {
    id: 'jira-admin',
    name: 'Jira administrator',
    description:
      'Configures projects, boards, fields and workflows so that the metrics the teams rely on can be produced at all.',
    framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  },
  {
    id: 'senior-leadership',
    name: 'Senior leadership',
    description:
      'Sets direction and funds the work. Needs a small number of trend-level signals, not team-level detail.',
    framework: ['scrum', 'kanban', 'scrumban', 'scaled'],
  },
];

export default roles;
