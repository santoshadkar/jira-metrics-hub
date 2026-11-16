import type { Source } from '../types/index.ts';

/**
 * Sources shared by several content files. Every URL here was fetched and read
 * on the `retrieved` date. Add a source here only after fetching it.
 */
const retrieved = '2026-11-16';

export const SOURCES = {
  dcVelocityChart: {
    title: 'Velocity Chart (Jira Software Data Center 10.7)',
    url: 'https://confluence.atlassian.com/jirasoftwareserver107/velocity-chart-1587940696.html',
    publisher: 'Atlassian',
    retrieved,
  },
  cloudVelocityChart: {
    title: 'View and understand the velocity chart (Jira Cloud)',
    url: 'https://support.atlassian.com/jira-software-cloud/docs/view-and-understand-the-velocity-chart/',
    publisher: 'Atlassian',
    retrieved,
  },
  dcControlChart: {
    title: 'Control Chart (Jira Software Data Center 10.7)',
    url: 'https://confluence.atlassian.com/jirasoftwareserver107/control-chart-1587940623.html',
    publisher: 'Atlassian',
    retrieved,
  },
  cloudControlChart: {
    title: 'View and understand the control chart (Jira Cloud)',
    url: 'https://support.atlassian.com/jira-software-cloud/docs/view-and-understand-the-control-chart/',
    publisher: 'Atlassian',
    retrieved,
  },
  dcCustomizingCards: {
    title: 'Customizing cards (Jira Software Data Center 10.7)',
    url: 'https://confluence.atlassian.com/jirasoftwareserver107/customizing-cards-1587940048.html',
    publisher: 'Atlassian',
    retrieved,
  },
  cloudCustomizeCards: {
    title: 'Customize cards (Jira Cloud)',
    url: 'https://support.atlassian.com/jira-software-cloud/docs/customize-cards/',
    publisher: 'Atlassian',
    retrieved,
  },
  dcJqlFields: {
    title: 'Advanced searching - fields reference (Jira Software Data Center 10.7)',
    url: 'https://confluence.atlassian.com/jirasoftwareserver107/advanced-searching-fields-reference-1587940830.html',
    publisher: 'Atlassian',
    retrieved,
  },
  dcJqlFunctions: {
    title: 'Advanced searching - functions reference (Jira Software Data Center 10.7)',
    url: 'https://confluence.atlassian.com/jirasoftwareserver107/advanced-searching-functions-reference-1587940834.html',
    publisher: 'Atlassian',
    retrieved,
  },
  dcJqlOperators: {
    title: 'Advanced searching - operators reference (Jira Software Data Center 10.7)',
    url: 'https://confluence.atlassian.com/jirasoftwareserver107/advanced-searching-operators-reference-1587940833.html',
    publisher: 'Atlassian',
    retrieved,
  },
  cloudJqlFields: {
    title: 'JQL fields (Jira Cloud)',
    url: 'https://support.atlassian.com/jira-software-cloud/docs/jql-fields/',
    publisher: 'Atlassian',
    retrieved,
  },
  cloudJqlFunctions: {
    title: 'JQL functions (Jira Cloud)',
    url: 'https://support.atlassian.com/jira-software-cloud/docs/jql-functions/',
    publisher: 'Atlassian',
    retrieved,
  },
  cloudJqlOperators: {
    title: 'JQL operators (Jira Cloud)',
    url: 'https://support.atlassian.com/jira-software-cloud/docs/jql-operators/',
    publisher: 'Atlassian',
    retrieved,
  },
  cloudMigrateSpaces: {
    title: 'Migrate between team-managed and company-managed spaces (Jira Cloud)',
    url: 'https://support.atlassian.com/jira-software-cloud/docs/migrate-between-team-managed-and-company-managed-projects/',
    publisher: 'Atlassian',
    retrieved,
  },
  kanbanGuide: {
    title: 'The Kanban Guide (May 2025)',
    url: 'https://kanbanguides.org/the-kanban-guide/',
    publisher: 'Kanban Guides (Orderly Disruption Limited and Daniel S. Vacanti, Inc.)',
    retrieved,
  },
  safeInspectAdaptGuide: {
    title: "SAFe Inspect and Adapt Facilitator's Guide",
    url: 'https://framework.scaledagile.com/wp-content/uploads/2026/03/SAFe-Inspect-and-Adapt-Facilitators-Guide.pdf',
    publisher: 'Scaled Agile, Inc.',
    retrieved,
  },
  safeGlossary: {
    title: 'SAFe Glossary',
    url: 'https://framework.scaledagile.com/glossary/',
    publisher: 'Scaled Agile, Inc.',
    retrieved,
  },

  // ---- Data Center 10.7 reports and features (read verbatim) ----
  dcSprintReport: dc('Sprint Report', 'sprint-report-1587940684'),
  dcBurndownChart: dc('Burndown Chart', 'burndown-chart-1587940615'),
  dcBurnupChart: dc('Burnup Chart', 'burnup-chart-1587940611'),
  dcCumulativeFlow: dc('Cumulative Flow Diagram', 'cumulative-flow-diagram-1587940651'),
  dcEpicReport: dc('Epic Report', 'epic-report-1587940660'),
  dcEpicBurndown: dc('Epic Burndown', 'epic-burndown-1587940655'),
  dcReleaseBurndown: dc('Release Burndown', 'release-burndown-1587940664'),
  dcVersionReport: dc('Version Report', 'version-report-1587940703'),
  dcFlagging: dc('Flagging an issue', 'flagging-an-issue-1587940332'),
  dcGadgets: dc('Gadgets for Jira applications', 'gadgets-for-jira-applications-1587941174'),
  dcConfiguringDashboards: dc('Configuring dashboards', 'configuring-dashboards-1587941130'),

  cloudGadgets: {
    title: 'Dashboard gadgets (Jira Cloud administration)',
    url: 'https://support.atlassian.com/jira-cloud-administration/docs/use-dashboard-gadgets/',
    publisher: 'Atlassian',
    retrieved,
  },

  // ---- Jira Cloud reports. The page body is embedded as JSON in the HTML and
  // was read verbatim from there (re-checked 2026-11-16). ----
  cloudSprintReport: cloud(
    'View and understand the sprint report',
    'view-and-understand-the-sprint-report',
  ),
  cloudBurndownChart: cloud(
    'View and understand the burndown chart',
    'view-and-understand-the-burndown-chart',
  ),
  cloudBurnupChart: cloud(
    'View and understand the Burnup chart',
    'view-and-understand-the-burnup-chart',
  ),
  cloudCumulativeFlow: cloud(
    'View and understand the cumulative flow diagram',
    'view-and-understand-the-cumulative-flow-diagram',
  ),
  cloudEpicBurndown: cloud(
    'View and understand the epic burndown report',
    'view-and-understand-the-epic-burndown-report',
  ),
  cloudReleaseBurndown: cloud(
    'What is the release burndown report?',
    'view-and-understand-the-release-burndown-report',
  ),
  cloudVersionReport: cloud(
    'View and understand the version report',
    'view-and-understand-the-version-report',
  ),
  cloudFlag: cloud('Flag a work item', 'flag-an-issue'),

  cloudKbStatusCategory: {
    title:
      'How to search using statusCategory() & statusCategoryChangedDate() function with JQL (Cloud only)',
    url: 'https://support.atlassian.com/jira/kb/how-to-search-using-statuscategory-statuscategorychangeddate-function-with-jql/',
    publisher: 'Atlassian Support',
    retrieved,
  },

  // ---- Other publishers ----
  atlassianAgileMetrics: {
    title: 'Five agile metrics you won’t hate',
    url: 'https://www.atlassian.com/agile/project-management/metrics',
    publisher: 'Atlassian (Agile Coach)',
    retrieved,
  },
  atlassianKanbanMetrics: {
    title: 'Kanban metrics',
    url: 'https://www.atlassian.com/agile/project-management/kanban-metrics',
    publisher: 'Atlassian (Agile Coach)',
    retrieved,
  },
  atlassianSoftwareDev: {
    title: 'Agile software development',
    url: 'https://www.atlassian.com/agile/software-development',
    publisher: 'Atlassian (Agile Coach)',
    retrieved,
  },
  scrumGuide: {
    title: 'The Scrum Guide (2020)',
    url: 'https://scrumguides.org/scrum-guide.html',
    publisher: 'Ken Schwaber and Jeff Sutherland',
    retrieved,
  },
  doraMetrics: {
    title: 'DORA’s software delivery performance metrics',
    url: 'https://dora.dev/guides/dora-metrics-four-keys/',
    publisher: 'DORA (Google Cloud)',
    retrieved,
  },
  scriptRunnerDcFunctions: {
    title: 'ScriptRunner for Jira Data Center: Included JQL Functions',
    url: 'https://docs.adaptavist.com/sr4js/latest/features/jql-functions/included-jql-functions/',
    publisher: 'Adaptavist',
    retrieved,
  },
  scriptRunnerDcLinks: {
    title: 'ScriptRunner for Jira Data Center: Issue Links JQL functions',
    url: 'https://docs.adaptavist.com/sr4js/latest/features/jql-functions/included-jql-functions/issue-links/',
    publisher: 'Adaptavist',
    retrieved,
  },
  scriptRunnerCloudLinks: {
    title: 'ScriptRunner for Jira Cloud: Links and Relationships (Enhanced Search)',
    url: 'https://docs.adaptavist.com/sr4jc/latest/features/scriptrunner-enhanced-search/scriptrunner-enhanced-search-jql-functions/links-and-relationships/',
    publisher: 'Adaptavist',
    retrieved,
  },
  scriptRunnerCloudAgile: {
    title: 'ScriptRunner for Jira Cloud: Agile and Sprint Management (Enhanced Search)',
    url: 'https://docs.adaptavist.com/sr4jc/latest/features/scriptrunner-enhanced-search/scriptrunner-enhanced-search-jql-functions/agile-and-sprint-management/',
    publisher: 'Adaptavist',
    retrieved,
  },
} satisfies Record<string, Source>;

function dc(title: string, slug: string): Source {
  return {
    title: `${title} (Jira Software Data Center 10.7)`,
    url: `https://confluence.atlassian.com/jirasoftwareserver107/${slug}.html`,
    publisher: 'Atlassian',
    retrieved,
  };
}

function cloud(title: string, slug: string): Source {
  return {
    title: `${title} (Jira Cloud)`,
    url: `https://support.atlassian.com/jira-software-cloud/docs/${slug}/`,
    publisher: 'Atlassian',
    retrieved,
  };
}
