import type { EditionDifference } from '../types/index.ts';
import { SOURCES } from './sources.ts';

/**
 * Data Center 10.7 versus Cloud differences that matter for JQL and dashboards.
 * Every entry was confirmed from the cited pages on the lastReviewed date.
 */
const lastReviewed = '2026-11-16';

const editionDifferences: EditionDifference[] = [
  {
    id: 'terminology',
    topic: 'Issues and projects vs work items and spaces',
    datacenter: 'The documentation and UI talk about issues and projects.',
    cloud:
      'Atlassian is renaming "issue" to "work item" and "project" to "space" in Jira Cloud. Some JQL functions and field names follow the new terms (see below).',
    whyItMatters:
      'Teams moving between editions will see different words for the same thing, and some function names differ. This portal uses "issue" and "project" in shared text.',
    sources: [SOURCES.cloudJqlOperators, SOURCES.cloudJqlFields],
    verification: 'verified',
    lastReviewed,
  },
  {
    id: 'epic-children',
    topic: 'Finding the items in an epic',
    datacenter:
      'Use "epic link" = KEY. The "parent" field finds sub-tasks only (and only if sub-tasks are enabled).',
    cloud:
      'Epic link was retired in February 2024 in favour of parent. parent = KEY finds all child work items, in company-managed and team-managed spaces. Existing filters that use Epic link still run.',
    whyItMatters:
      'Every epic-level query (epic progress, epic burnup, unestimated items in an epic) needs a different clause in each edition.',
    sources: [SOURCES.dcJqlFields, SOURCES.cloudJqlFields],
    verification: 'verified',
    lastReviewed,
  },
  {
    id: 'no-parent-query',
    topic: 'Finding items without an epic or parent',
    datacenter: '"epic link" supports IS and IS NOT, so "epic link" is EMPTY works.',
    cloud:
      'The parent field does not support IS or IS NOT, so there is no documented native JQL for "has no parent".',
    whyItMatters:
      'The hygiene check "issues without epic or parent" has a native query in Data Center only. Cloud needs a board or plan view, an export, or an app.',
    sources: [SOURCES.dcJqlFields, SOURCES.cloudJqlFields],
    verification: 'verified',
    lastReviewed,
  },
  {
    id: 'users',
    topic: 'Referencing users in JQL',
    datacenter:
      'Users can be searched by full name, ID or email address (for example assignee = jsmith).',
    cloud:
      'The fields page also mentions full name, ID or email, but the operator examples use Atlassian account IDs (for example assignee != abcde-12345-fedcba). currentUser() works in both.',
    whyItMatters:
      'Saved filters that name users by username will not carry over to Cloud unchanged. Prefer currentUser() or groups (membersOf()) in shared filters.',
    sources: [SOURCES.dcJqlFields, SOURCES.cloudJqlFields, SOURCES.cloudJqlOperators],
    verification: 'verified',
    lastReviewed,
  },
  {
    id: 'type-functions',
    topic: 'Work type field and the "not sub-task" function',
    datacenter:
      'Field: type (alias issueType). Function: standardIssueTypes(), plus subtaskIssueTypes().',
    cloud: 'Field: type (alias workType). Function: standardWorkTypes(), plus subtaskWorkTypes().',
    whyItMatters:
      'type in ({{ISSUE_TYPES}}) works in both, but any query that excludes sub-tasks needs a different function name per edition.',
    sources: [
      SOURCES.dcJqlFields,
      SOURCES.dcJqlFunctions,
      SOURCES.cloudJqlFields,
      SOURCES.cloudJqlFunctions,
    ],
    verification: 'verified',
    lastReviewed,
  },
  {
    id: 'link-fields',
    topic: 'Issue links in JQL',
    datacenter: 'Field: issueLinkType. Function: linkedIssues(issueKey, linkType).',
    cloud: 'Field: workItemLinkType. Function: linkedWorkItems(workItemKey, linkType).',
    whyItMatters:
      'Dependency and blocker queries need different names per edition. Link type names themselves ("blocks", "is blocked by") depend on each site\'s configuration.',
    sources: [
      SOURCES.dcJqlFields,
      SOURCES.dcJqlFunctions,
      SOURCES.cloudJqlFields,
      SOURCES.cloudJqlFunctions,
    ],
    verification: 'verified',
    lastReviewed,
  },
  {
    id: 'status-category-changed',
    topic: 'Time since an item entered its status category',
    datacenter:
      'No statusCategoryChangedDate field appears in the Data Center 10.7 JQL documentation.',
    cloud:
      'statusCategoryChangedDate is documented in an Atlassian Cloud-only knowledge-base article (for example statusCategoryChangedDate <= -7d).',
    whyItMatters:
      'In Cloud it gives a close proxy for work item age with plain JQL. In Data Center, age needs an export of status history.',
    sources: [SOURCES.cloudKbStatusCategory, SOURCES.dcJqlFields],
    verification: 'verified',
    lastReviewed,
  },
  {
    id: 'story-points-field',
    topic: 'The story points field',
    datacenter:
      'The Data Center JQL docs do not name the story points field. Custom fields can be searched by name or by cf[ID]; the ID is safer.',
    cloud:
      'Company-managed spaces store estimates in "Story points"; team-managed spaces use a different field, "Story point estimate". Estimates do not carry over when a space is migrated between the two.',
    whyItMatters:
      'Any query on estimates must use the right field name for the edition and the project type. Data Center queries in this portal that name "Story Points" are marked as needing verification.',
    sources: [SOURCES.dcJqlFields, SOURCES.cloudMigrateSpaces],
    verification: 'verified',
    lastReviewed,
  },
  {
    id: 'text-search',
    topic: 'Searching all text fields',
    datacenter: 'The master field is text, used with ~ (for example text ~ Fred).',
    cloud: 'text works, and the Cloud docs also document textfields with the same purpose.',
    whyItMatters: 'Minor: text ~ works in both editions, so shared queries should use text.',
    sources: [SOURCES.dcJqlFields, SOURCES.cloudJqlFields],
    verification: 'verified',
    lastReviewed,
  },
  {
    id: 'gadget-names',
    topic: 'Dashboard gadget names',
    datacenter:
      'Gadgets include Issue Statistics, Created vs. Resolved Chart, Average Age Chart, Time Since Chart, Jira Road Map, Sprint Burndown Gadget, Sprint Health Gadget, Days Remaining in Sprint Gadget, Agile Wallboard Gadget and Version Report. Average Time in Status, Average Number of Times in Status and Time to First Response are listed as requiring the Jira Charting App.',
    cloud:
      'The pre-installed list uses Work item Statistics Gadget, Created vs Resolved Gadget, Average Age Gadget, Time Since Work items Gadget and Road Map Gadget. It includes Sprint Burndown, Sprint Health and Days Remaining in Sprint gadgets, and Average Time in Status, but not the Agile Wallboard Gadget or a Version Report gadget.',
    whyItMatters:
      'Dashboard guides name gadgets per edition. A Data Center dashboard that relies on the Version Report or Agile Wallboard gadget needs another approach in Cloud.',
    sources: [SOURCES.dcGadgets, SOURCES.cloudGadgets],
    verification: 'verified',
    lastReviewed,
  },
  {
    id: 'cloud-reports-company-managed',
    topic: 'Agile reports in Cloud team-managed spaces',
    datacenter: 'Reports belong to boards; there is no company-managed / team-managed split.',
    cloud:
      'The Cloud pages for the velocity chart, control chart, sprint report, burndown chart, cumulative flow diagram and version report are written for company-managed spaces.',
    whyItMatters:
      'Teams in team-managed spaces should not assume these reports behave the same way. Check what your team-managed space offers before building a dashboard around them.',
    sources: [
      SOURCES.cloudVelocityChart,
      SOURCES.cloudControlChart,
      SOURCES.cloudSprintReport,
      SOURCES.cloudBurndownChart,
      SOURCES.cloudCumulativeFlow,
      SOURCES.cloudVersionReport,
    ],
    verification: 'verified',
    lastReviewed,
  },
  {
    id: 'scriptrunner-sprint-functions',
    topic: 'ScriptRunner sprint functions',
    datacenter:
      'ScriptRunner for Jira Data Center includes addedAfterSprintStart, removedAfterSprintStart, incompleteInSprint and completeInSprint.',
    cloud:
      'ScriptRunner Enhanced Search for Cloud includes addedAfterSprintStart (with a known issue for reopened sprints). removedAfterSprintStart, incompleteInSprint and completeInSprint are documented as not available.',
    whyItMatters:
      'Scope-change and carryover queries built on these functions only partly carry over to Cloud.',
    sources: [SOURCES.scriptRunnerDcFunctions, SOURCES.scriptRunnerCloudAgile],
    verification: 'verified',
    lastReviewed,
  },
  {
    id: 'dc-end-of-support',
    topic: 'Data Center support timeline',
    datacenter:
      'The Data Center 10.7 documentation pages state that Data Center support ends on March 28, 2029.',
    cloud: 'Not applicable.',
    whyItMatters:
      'Organisations building Data Center dashboards today should plan for their move, and may want to prefer queries that work in both editions.',
    sources: [SOURCES.dcVelocityChart],
    verification: 'verified',
    lastReviewed,
  },
];

export default editionDifferences;
