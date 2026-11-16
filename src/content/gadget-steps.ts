import type { GadgetGuide, JiraEdition } from '../types/index.ts';

/**
 * Builders for dashboard gadget guides. Gadget names are exactly as listed in:
 *  - Data Center 10.7: "Gadgets for Jira applications"
 *  - Cloud: "Dashboard gadgets" (Jira Cloud administration)
 *
 * Configuration steps only restate what those pages document (for example
 * "based on a selected filter", "grouped by a selected field"). Where a step is
 * not documented (for example choosing a board and sprint), the guide is
 * marked needs-verification. Do not add undocumented steps as verified.
 */

type Names = Record<JiraEdition, string>;

function guide(
  edition: JiraEdition,
  names: Names,
  steps: string[],
  verification: GadgetGuide['verification'],
): GadgetGuide {
  const gadgetName = names[edition];
  return {
    edition,
    gadgetName,
    configuration: [`Add the "${gadgetName}" gadget to the dashboard.`, ...steps],
    verification,
  };
}

const FILTER_RESULTS: Names = { datacenter: 'Filter Results', cloud: 'Filter Results Gadget' };
const PIE_CHART: Names = { datacenter: 'Pie Chart', cloud: 'Pie Chart Gadget' };
const STATISTICS: Names = { datacenter: 'Issue Statistics', cloud: 'Work item Statistics Gadget' };
const TWO_D: Names = {
  datacenter: 'Two Dimensional Filter Statistics',
  cloud: 'Two Dimensional Filter Statistics Gadget',
};
const CREATED_RESOLVED: Names = {
  datacenter: 'Created vs. Resolved Chart',
  cloud: 'Created vs Resolved Gadget',
};
const AVERAGE_AGE: Names = { datacenter: 'Average Age Chart', cloud: 'Average Age Gadget' };
const RESOLUTION_TIME: Names = { datacenter: 'Resolution Time', cloud: 'Resolution Time Gadget' };
const TIME_SINCE: Names = { datacenter: 'Time Since Chart', cloud: 'Time Since Work items Gadget' };
const SPRINT_BURNDOWN: Names = {
  datacenter: 'Sprint Burndown Gadget',
  cloud: 'Sprint Burndown Gadget',
};
const SPRINT_HEALTH: Names = { datacenter: 'Sprint Health Gadget', cloud: 'Sprint Health Gadget' };
const DAYS_REMAINING: Names = {
  datacenter: 'Days Remaining in Sprint Gadget',
  cloud: 'Days Remaining in Sprint Gadget',
};
const ROAD_MAP: Names = { datacenter: 'Jira Road Map', cloud: 'Road Map Gadget' };
const AVG_TIME_IN_STATUS: Names = {
  datacenter: 'Average Time in Status',
  cloud: 'Average Time in Status',
};

/** Lists the issues of a saved filter. Documented in both editions. */
export const filterResults = (edition: JiraEdition, filter: string) =>
  guide(edition, FILTER_RESULTS, [`Select the saved filter "${filter}".`], 'verified');

/** Pie chart of a filter grouped by a field. DC: "based on a selected filter"; Cloud: "grouped by a statistic type". */
export const pieChart = (edition: JiraEdition, filter: string, groupBy: string) =>
  guide(
    edition,
    PIE_CHART,
    [`Select the saved filter "${filter}".`, `Group the results by ${groupBy}.`],
    'verified',
  );

/** Counts of a filter broken down by a field. Documented in both editions. */
export const statistics = (edition: JiraEdition, filter: string, groupBy: string) =>
  guide(
    edition,
    STATISTICS,
    [`Select the saved filter "${filter}".`, `Break the results down by ${groupBy}.`],
    'verified',
  );

/**
 * Table of a filter across two fields. DC documents "configurable axes";
 * the Cloud entry only says "tabular data based on a filter".
 */
export const twoDimensional = (
  edition: JiraEdition,
  filter: string,
  rows: string,
  columns: string,
) =>
  guide(
    edition,
    TWO_D,
    [
      `Select the saved filter "${filter}".`,
      `Set one axis to ${rows} and the other to ${columns}.`,
    ],
    edition === 'datacenter' ? 'verified' : 'needs-verification',
  );

/** Created vs resolved over a period. DC documents project/filter choice and cumulative option. */
export const createdVsResolved = (edition: JiraEdition, filter: string) =>
  edition === 'datacenter'
    ? guide(
        edition,
        CREATED_RESOLVED,
        [
          `Base it on the saved filter "${filter}".`,
          'Choose the period, and whether to show cumulative totals or counts per period.',
        ],
        'verified',
      )
    : guide(
        edition,
        CREATED_RESOLVED,
        [`Base it on the saved filter "${filter}".`, 'Choose the period to show.'],
        'needs-verification',
      );

/** Average age of unresolved items. DC documents project/filter and time unit. */
export const averageAge = (edition: JiraEdition, filter: string) =>
  edition === 'datacenter'
    ? guide(
        edition,
        AVERAGE_AGE,
        [
          `Base it on the saved filter "${filter}".`,
          'Choose the unit of time (for example days or weeks).',
        ],
        'verified',
      )
    : guide(
        edition,
        AVERAGE_AGE,
        [`Base it on the saved filter "${filter}".`],
        'needs-verification',
      );

/** Average resolution time. DC documents project/filter and time unit. */
export const resolutionTime = (edition: JiraEdition, filter: string) =>
  edition === 'datacenter'
    ? guide(
        edition,
        RESOLUTION_TIME,
        [`Base it on the saved filter "${filter}".`, 'Choose the unit of time.'],
        'verified',
      )
    : guide(
        edition,
        RESOLUTION_TIME,
        [`Base it on the saved filter "${filter}".`],
        'needs-verification',
      );

/** Items for which a date field was set in each period. Both editions document choosing the date field. */
export const timeSince = (edition: JiraEdition, filter: string, dateField: string) =>
  guide(
    edition,
    TIME_SINCE,
    [`Base it on the saved filter "${filter}".`, `Choose the date field "${dateField}".`],
    edition === 'datacenter' ? 'verified' : 'needs-verification',
  );

/** Average time in a selected status. DC: needs the Jira Charting App. */
export const averageTimeInStatus = (edition: JiraEdition, filter: string) =>
  edition === 'datacenter'
    ? guide(
        edition,
        AVG_TIME_IN_STATUS,
        [
          'Requires the Jira Charting App on Data Center.',
          `Base it on the saved filter "${filter}".`,
          'Select the status to measure and the period.',
        ],
        'verified',
      )
    : guide(
        edition,
        AVG_TIME_IN_STATUS,
        [`Base it on the saved filter "${filter}".`, 'Select the status to measure.'],
        'needs-verification',
      );

/** Sprint gadgets: the docs do not describe how the board and sprint are chosen. */
export const sprintBurndown = (edition: JiraEdition) =>
  guide(
    edition,
    SPRINT_BURNDOWN,
    [
      "Select the team's board and the active sprint.",
      ...(edition === 'datacenter'
        ? [
            "The vertical axis uses the board's estimation statistic; only sprints that are not completed are shown.",
          ]
        : []),
    ],
    'needs-verification',
  );

export const sprintHealth = (edition: JiraEdition) =>
  guide(
    edition,
    SPRINT_HEALTH,
    ["Select the team's board and the active sprint."],
    'needs-verification',
  );

export const daysRemaining = (edition: JiraEdition) =>
  guide(edition, DAYS_REMAINING, ["Select the team's board."], 'needs-verification');

/** Versions due for release in a period. Both editions document the period. */
export const roadMap = (edition: JiraEdition) =>
  guide(edition, ROAD_MAP, ['Choose the period of upcoming releases to show.'], 'verified');

/** Data Center only. Configuration is not described on the gadget list page. */
export const versionReport = () =>
  guide(
    'datacenter',
    { datacenter: 'Version Report', cloud: '' },
    ['Select the board and the version to track.'],
    'needs-verification',
  );
