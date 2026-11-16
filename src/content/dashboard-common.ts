import type { JqlVariant } from '../types/index.ts';
import { SOURCES } from './sources.ts';

/** Prerequisites shared by every dashboard guide. */
export const COMMON_PREREQUISITES = [
  'Create the saved filters below first, with exactly these names, and share them with the people who will read the dashboard. A gadget can only show data its viewer is allowed to see.',
  'Permission to create a dashboard. In Data Center, only administrators can change the default (system) dashboard; anyone can create their own, and new dashboards are private unless your sharing preference says otherwise.',
];

/** Sources every dashboard guide relies on for gadget names. */
export const GADGET_SOURCES = [
  SOURCES.dcGadgets,
  SOURCES.dcConfiguringDashboards,
  SOURCES.cloudGadgets,
];

/** One JQL variant that is the same in both editions. */
export const both = (label: string, jql: string, notes?: string): JqlVariant =>
  notes
    ? { edition: 'both', label, jql, notes, verification: 'verified' }
    : { edition: 'both', label, jql, verification: 'verified' };

/** Items in an epic: "epic link" in Data Center, parent in Cloud. */
export const epicChildren = (extra = ''): JqlVariant[] => [
  {
    edition: 'datacenter',
    label: 'Items in the epic',
    jql: `"epic link" = {{EPIC_KEY}}${extra}`,
    verification: 'verified',
  },
  {
    edition: 'cloud',
    label: 'Items in the epic',
    jql: `parent = {{EPIC_KEY}}${extra}`,
    verification: 'verified',
  },
];

/** Standard (non-sub-task) items in open sprints with no estimate. */
export const unestimatedInSprint: JqlVariant[] = [
  {
    edition: 'datacenter',
    label: 'Open-sprint items without an estimate',
    jql: 'project = {{PROJECT_KEY}} AND sprint in openSprints() AND type in standardIssueTypes() AND "Story Points" is EMPTY',
    notes: 'Check the name of your estimation field; the Data Center docs do not name it.',
    verification: 'needs-verification',
  },
  {
    edition: 'cloud',
    label: 'Open-sprint items without an estimate',
    jql: 'project = {{PROJECT_KEY}} AND sprint in openSprints() AND type in standardWorkTypes() AND "Story points" is EMPTY',
    notes: 'Team-managed spaces use "Story point estimate" instead.',
    verification: 'verified',
  },
];

/** In-progress items, oldest first; Cloud can sort by time in the status category. */
export const agingWip: JqlVariant[] = [
  {
    edition: 'datacenter',
    label: 'In-progress items, oldest created first',
    jql: 'project = {{PROJECT_KEY}} AND statusCategory = "In Progress" ORDER BY created ASC',
    notes: 'Created date is only a rough proxy for when work started.',
    verification: 'verified',
  },
  {
    edition: 'cloud',
    label: 'In-progress items, oldest created first',
    jql: 'project = {{PROJECT_KEY}} AND statusCategory = "In Progress" AND statusCategoryChangedDate <= -7d ORDER BY created ASC',
    notes:
      'Cloud only: statusCategoryChangedDate limits the list to items that entered In Progress at least 7 days ago. Change -7d to suit your cycle times.',
    verification: 'verified',
  },
];
