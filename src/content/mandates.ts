import type { Framework, MandateTable, RoleMandate } from '../types/index.ts';

/**
 * PROPOSED BASELINE. Which metrics are mandatory is your organisation's
 * governance decision. Edit this file to change mandates without touching any
 * metric content. The UI labels every value from here "Proposed baseline".
 *
 * Shape: metric id → one entry per role. Add `framework` to an entry when a
 * role's mandate differs by framework (for example velocity for a Scrum Master
 * on a Scrum team versus a Scrumban team). An entry without `framework`
 * applies to every framework the metric lists; a framework-specific entry
 * overrides it for that framework. A role with no entry for a metric is
 * treated as not-applicable. Every metric must have a key here.
 */
const mandates: MandateTable = {
  velocity: [
    {
      roleId: 'scrum-master',
      mandate: 'mandatory',
      framework: 'scrum',
      rationale:
        'The Scrum Master helps the team use its own completed-work history to make a realistic sprint forecast.',
    },
    {
      roleId: 'scrum-master',
      mandate: 'optional',
      framework: 'scrumban',
      rationale:
        'Scrumban teams that still run sprints can use it, but throughput and cycle time usually serve them better.',
    },
    {
      roleId: 'product-owner',
      mandate: 'mandatory',
      framework: 'scrum',
      rationale:
        'The Product Owner needs a range of likely sprint capacity to forecast when backlog items could be delivered.',
    },
    {
      roleId: 'product-owner',
      mandate: 'optional',
      framework: 'scrumban',
      rationale: 'Useful only if the team still plans in sprints with estimates.',
    },
    {
      roleId: 'team-member',
      mandate: 'recommended',
      rationale:
        'Helps the team check that its sprint forecast is grounded in what it actually finished.',
    },
    {
      roleId: 'agile-coach',
      mandate: 'recommended',
      rationale:
        'Lets the coach spot unstable forecasting and coach against misuse such as cross-team comparison.',
    },
    {
      roleId: 'engineering-manager',
      mandate: 'optional',
      rationale: 'A trend signal only; never a measure of individual or team performance.',
    },
    {
      roleId: 'delivery-manager',
      mandate: 'optional',
      rationale: 'Feeds release forecasts when combined with remaining backlog size.',
    },
    {
      roleId: 'jira-admin',
      mandate: 'recommended',
      rationale:
        'The chart only works when boards have an estimation statistic and statuses mapped to columns correctly.',
    },
  ],

  'cycle-time': [
    {
      roleId: 'flow-manager',
      mandate: 'mandatory',
      rationale: 'Cycle time is one of the four flow measures the Kanban Guide requires.',
    },
    {
      roleId: 'team-member',
      mandate: 'mandatory',
      framework: 'kanban',
      rationale:
        'Kanban team members use cycle time to set and check their service level expectation.',
    },
    {
      roleId: 'team-member',
      mandate: 'recommended',
      framework: 'scrumban',
      rationale: 'Shows how long items really take, independent of sprint boundaries.',
    },
    {
      roleId: 'team-member',
      mandate: 'optional',
      framework: 'scrum',
      rationale: 'Helps a Scrum team see items that take longer than a sprint.',
    },
    {
      roleId: 'scrum-master',
      mandate: 'recommended',
      rationale:
        'Long or highly variable cycle times are a strong prompt for a retrospective conversation.',
    },
    {
      roleId: 'product-owner',
      mandate: 'recommended',
      rationale:
        'Cycle time history lets the Product Owner answer "when will this item be done?" with a range.',
    },
    {
      roleId: 'agile-coach',
      mandate: 'mandatory',
      framework: 'kanban',
      rationale: 'A coach supporting Kanban teams needs the required flow measures in view.',
    },
    {
      roleId: 'agile-coach',
      mandate: 'recommended',
      rationale: 'Useful across frameworks to discuss flow and variability.',
    },
    {
      roleId: 'engineering-manager',
      mandate: 'recommended',
      rationale:
        'Persistently long cycle times often point to systemic causes a manager can remove.',
    },
    {
      roleId: 'delivery-manager',
      mandate: 'optional',
      rationale: 'Helps with item-level forecasting across teams.',
    },
    {
      roleId: 'jira-admin',
      mandate: 'optional',
      rationale:
        'Workflow statuses must map to clear start and finish points for the chart to mean anything.',
    },
  ],

  'aging-wip': [
    {
      roleId: 'flow-manager',
      mandate: 'mandatory',
      rationale: 'Work item age is one of the four flow measures the Kanban Guide requires.',
    },
    {
      roleId: 'team-member',
      mandate: 'mandatory',
      framework: 'kanban',
      rationale:
        'Checking the age of in-progress items at every replenishment or daily meeting stops work from stalling.',
    },
    {
      roleId: 'team-member',
      mandate: 'recommended',
      framework: 'scrumban',
      rationale: 'Shows which items are stuck before they spill over.',
    },
    {
      roleId: 'scrum-master',
      mandate: 'recommended',
      rationale: 'Old items in progress are the earliest warning that a sprint goal is at risk.',
    },
    {
      roleId: 'agile-coach',
      mandate: 'mandatory',
      framework: 'kanban',
      rationale: 'A coach supporting Kanban teams needs the required flow measures in view.',
    },
    {
      roleId: 'agile-coach',
      mandate: 'recommended',
      framework: 'scrumban',
      rationale: 'Helps the coach show hybrid teams where flow is blocked.',
    },
    {
      roleId: 'product-owner',
      mandate: 'optional',
      rationale: 'Helps the Product Owner see items whose value is waiting on stuck work.',
    },
    {
      roleId: 'engineering-manager',
      mandate: 'optional',
      rationale:
        'Clusters of old items often share a cause outside the team, such as a dependency.',
    },
  ],

  'pi-predictability': [
    {
      roleId: 'rte',
      mandate: 'mandatory',
      rationale:
        'The RTE facilitates Inspect and Adapt, where the predictability measure is reviewed.',
    },
    {
      roleId: 'tribe-lead',
      mandate: 'mandatory',
      rationale:
        'Shows whether the group of teams delivered the business value it planned for the PI.',
    },
    {
      roleId: 'product-owner',
      mandate: 'recommended',
      rationale: "Product Owners help write the team's PI objectives that the score is based on.",
    },
    {
      roleId: 'agile-coach',
      mandate: 'recommended',
      rationale: 'Coaches use the trend to discuss planning quality, not to rank teams.',
    },
    {
      roleId: 'scrum-master',
      mandate: 'optional',
      rationale: 'Helps the team reflect on how well it planned the PI.',
    },
    {
      roleId: 'delivery-manager',
      mandate: 'recommended',
      rationale: 'A PI-level reliability signal for coordinating delivery across teams.',
    },
    {
      roleId: 'senior-leadership',
      mandate: 'recommended',
      rationale: 'A small, trend-level signal of whether trains deliver what they commit to.',
    },
    {
      roleId: 'team-member',
      mandate: 'optional',
      rationale: 'Gives the team feedback on the objectives it committed to.',
    },
  ],

  // ---------------- Scrum: delivery ----------------
  'sprint-burndown': [
    m(
      'team-member',
      'recommended',
      'Lets the team see daily whether the Sprint Goal is at risk and adjust.',
    ),
    m('scrum-master', 'recommended', 'A prompt for the Daily Scrum when progress stalls.', 'scrum'),
    m('scrum-master', 'optional', 'Less useful when work flows continuously.', 'scrumban'),
    m('product-owner', 'optional', 'Shows mid-sprint whether the goal is likely to be met.'),
    m(
      'agile-coach',
      'optional',
      'Burndown shape reveals item size and flow problems worth coaching on.',
    ),
  ],
  'commitment-reliability': [
    m(
      'scrum-master',
      'mandatory',
      'Grounds sprint planning in what the team actually finishes.',
      'scrum',
    ),
    m(
      'scrum-master',
      'optional',
      'Relevant only where the team still commits to sprint scope.',
      'scrumban',
    ),
    m(
      'product-owner',
      'recommended',
      'Tells the Product Owner how far sprint forecasts can be relied on.',
    ),
    m('team-member', 'recommended', 'Helps the team calibrate how much to pull into a sprint.'),
    m('agile-coach', 'recommended', 'Persistent over-commitment is a coaching topic.'),
    m('engineering-manager', 'optional', 'A trend to understand, never a target to set.'),
    m('delivery-manager', 'optional', 'Feeds confidence levels for delivery forecasts.'),
  ],
  'sprint-goal-achievement': [
    m(
      'scrum-master',
      'mandatory',
      'The Sprint Goal is the commitment for the Sprint Backlog in Scrum.',
    ),
    m(
      'product-owner',
      'mandatory',
      'The Product Owner shapes the goal and needs to know if sprints deliver it.',
    ),
    m(
      'team-member',
      'recommended',
      'Keeps the team focused on the goal rather than on finishing every item.',
    ),
    m('agile-coach', 'recommended', 'Shows whether goals are meaningful and protected.'),
    m('senior-leadership', 'optional', 'A simple outcome-oriented signal for sprint-based teams.'),
  ],
  carryover: [
    m('scrum-master', 'recommended', 'Repeated carryover is a clear retrospective topic.'),
    m('team-member', 'recommended', 'Shows the team which items keep slipping.'),
    m('product-owner', 'optional', 'Helps re-prioritise items that keep rolling over.'),
    m(
      'agile-coach',
      'optional',
      'A pattern across teams can reveal sizing or dependency problems.',
    ),
  ],
  'mid-sprint-scope-change': [
    m(
      'scrum-master',
      'recommended',
      'Helps protect the sprint and see where interruptions come from.',
    ),
    m(
      'product-owner',
      'recommended',
      'The Product Owner negotiates scope changes during the sprint.',
    ),
    m('agile-coach', 'optional', 'Useful to diagnose unstable planning.'),
    m('engineering-manager', 'optional', 'Interruptions often come from outside the team.'),
    m('jira-admin', 'optional', 'The queries need ScriptRunner if the organisation wants them.'),
  ],
  'unplanned-work-ratio': [
    m('scrum-master', 'recommended', 'Lets the team reserve realistic capacity for interruptions.'),
    m(
      'engineering-manager',
      'recommended',
      'Support load and interruptions are systemic issues a manager can address.',
    ),
    m('product-owner', 'optional', 'Shows how much capacity is really available for planned work.'),
    m('delivery-manager', 'optional', 'Explains forecast misses caused by interruptions.'),
  ],
  'sprint-predictability': [
    m(
      'scrum-master',
      'optional',
      'Useful once commitment reliability is tracked for several sprints.',
    ),
    m(
      'product-owner',
      'recommended',
      'Lets the Product Owner give stakeholders honest forecast ranges.',
    ),
    m('delivery-manager', 'recommended', 'Supports multi-team forecasting.'),
    m('agile-coach', 'optional', 'Shows whether planning is stabilising over time.'),
    m('senior-leadership', 'optional', 'A trend-level reliability signal.'),
  ],
  'epic-release-burnup': [
    m(
      'product-owner',
      'mandatory',
      'The Product Owner forecasts and communicates when epics and releases will be done.',
    ),
    m('delivery-manager', 'recommended', 'Core input for release coordination.'),
    m('scrum-master', 'optional', 'Helps the team see larger goals beyond the sprint.'),
    m('team-member', 'optional', 'Shows progress towards the bigger outcome.'),
    m('senior-leadership', 'optional', 'Release-level progress without team detail.'),
  ],

  // ---------------- Scrum: quality ----------------
  'escaped-defects': [
    m(
      'engineering-manager',
      'mandatory',
      'Escaped defects show whether quality practices protect users.',
    ),
    m(
      'team-member',
      'recommended',
      'Each escaped defect is a lesson for the team’s Definition of Done.',
    ),
    m('scrum-master', 'recommended', 'A strong input to retrospectives.'),
    m('product-owner', 'recommended', 'Defects reaching users affect value and priorities.'),
    m('agile-coach', 'optional', 'Useful to coach on built-in quality.'),
    m('senior-leadership', 'optional', 'A trend-level quality signal.'),
  ],
  'bug-ratio': [
    m(
      'engineering-manager',
      'recommended',
      'Shows how much capacity goes into fixing rather than building.',
    ),
    m('product-owner', 'recommended', 'Helps balance new features against quality work.'),
    m('scrum-master', 'optional', 'Context for capacity discussions.'),
    m('flow-manager', 'optional', 'Bug work competes for the same flow capacity.'),
  ],
  'defect-age': [
    m(
      'product-owner',
      'recommended',
      'The Product Owner decides whether old bugs are fixed or closed.',
    ),
    m('engineering-manager', 'recommended', 'Old defects are a form of technical debt.'),
    m('team-member', 'optional', 'Keeps old bugs visible during refinement.'),
    m('jira-admin', 'optional', 'Supports backlog clean-up rules.'),
  ],
  'reopened-items': [
    m('scrum-master', 'recommended', 'Reopened work points at the Definition of Done.'),
    m('team-member', 'recommended', 'Helps the team see where "done" was not done.'),
    m('engineering-manager', 'optional', 'A quality signal alongside escaped defects.'),
    m('flow-manager', 'optional', 'Rework inflates cycle time.'),
  ],

  // ---------------- Kanban: flow (with explicit Scrumban levels) ----------------
  'lead-time': [
    m(
      'flow-manager',
      'recommended',
      'Shows the customer’s full wait, including time before work starts.',
    ),
    m(
      'product-owner',
      'recommended',
      'Long waits before work starts are a backlog and priority question.',
    ),
    m('delivery-manager', 'recommended', 'What customers and stakeholders actually experience.'),
    m('agile-coach', 'optional', 'Compared with cycle time, it shows where waiting happens.'),
    m('senior-leadership', 'optional', 'A customer-facing responsiveness signal.'),
  ],
  throughput: [
    m(
      'flow-manager',
      'mandatory',
      'Throughput is one of the four flow measures the Kanban Guide requires.',
    ),
    m('team-member', 'mandatory', 'Kanban teams forecast from their own throughput.', 'kanban'),
    m(
      'team-member',
      'mandatory',
      'Scrumban teams replace velocity-based planning with throughput.',
      'scrumban',
    ),
    m('team-member', 'optional', 'An item-count view alongside velocity.', 'scrum'),
    m('scrum-master', 'recommended', 'A simple, estimate-free view of delivery.', 'scrumban'),
    m('scrum-master', 'optional', 'Useful alongside velocity.', 'scrum'),
    m('product-owner', 'recommended', 'The basis for "how many items by when" forecasts.'),
    m('agile-coach', 'mandatory', 'A required flow measure for Kanban teams.', 'kanban'),
    m(
      'agile-coach',
      'recommended',
      'Coaches teams moving from velocity to flow-based forecasting.',
    ),
    m('delivery-manager', 'recommended', 'Feeds probabilistic delivery forecasts.'),
  ],
  'work-in-progress': [
    m(
      'flow-manager',
      'mandatory',
      'WIP is one of the four flow measures the Kanban Guide requires.',
    ),
    m('team-member', 'mandatory', 'Limiting WIP is how the team keeps work flowing.', 'kanban'),
    m(
      'team-member',
      'mandatory',
      'Scrumban relies on WIP limits within the sprint cadence.',
      'scrumban',
    ),
    m('team-member', 'optional', 'Too much parallel work also slows Scrum teams.', 'scrum'),
    m('scrum-master', 'recommended', 'High WIP explains slow sprints and spillover.'),
    m('agile-coach', 'mandatory', 'A required flow measure for Kanban teams.', 'kanban'),
    m('agile-coach', 'recommended', 'WIP is the first lever to coach on.'),
    m('engineering-manager', 'optional', 'Overloaded teams show up as high WIP.'),
  ],
  'cumulative-flow': [
    m(
      'flow-manager',
      'recommended',
      'The quickest way to see bottlenecks across the whole workflow.',
    ),
    m('team-member', 'recommended', 'Shows the team where work piles up.', 'kanban'),
    m(
      'team-member',
      'recommended',
      'Shows where work piles up within and across sprints.',
      'scrumban',
    ),
    m('scrum-master', 'optional', 'Helps diagnose why sprint work stalls.'),
    m('agile-coach', 'recommended', 'A visual coaching tool for flow.'),
  ],
  'flow-efficiency': [
    m(
      'flow-manager',
      'optional',
      'Points at waiting time once statuses separate active and waiting work.',
    ),
    m('agile-coach', 'optional', 'Shows teams and leaders that most delay is waiting.'),
    m('rte', 'optional', 'One of the SAFe flow metrics at train level.'),
    m('engineering-manager', 'optional', 'Highlights waits caused by hand-offs and dependencies.'),
  ],
  'blocked-items': [
    m('team-member', 'mandatory', 'Blocked work should be acted on first, every day.'),
    m('flow-manager', 'mandatory', 'Blockers are the biggest source of unpredictable cycle time.'),
    m('scrum-master', 'mandatory', 'Removing impediments is a core Scrum Master responsibility.'),
    m('engineering-manager', 'recommended', 'Recurring blockers often need management action.'),
    m('agile-coach', 'recommended', 'Patterns of blockers reveal systemic problems.'),
    m('delivery-manager', 'optional', 'Cross-team blockers affect delivery dates.'),
  ],
  'service-level-expectation': [
    m('flow-manager', 'mandatory', 'The SLE is part of the Kanban Guide’s Definition of Workflow.'),
    m('team-member', 'mandatory', 'Kanban teams check item age against the SLE.', 'kanban'),
    m(
      'team-member',
      'recommended',
      'Gives hybrid teams a date-free answer to "when?".',
      'scrumban',
    ),
    m('product-owner', 'recommended', 'Lets the Product Owner give customers honest expectations.'),
    m('agile-coach', 'recommended', 'Teaches forecasting from data.'),
  ],
  'due-date-performance': [
    m(
      'delivery-manager',
      'recommended',
      'Fixed-date commitments are the delivery manager’s concern.',
    ),
    m('product-owner', 'optional', 'Relevant when there are external deadlines.'),
    m('flow-manager', 'optional', 'Fixed-date items may need their own class of service.'),
  ],
  'flow-load': [
    m('rte', 'recommended', 'Shows whether the train has started more than it can finish.'),
    m('tribe-lead', 'recommended', 'The same signal for a tribe or product line.'),
    m('flow-manager', 'optional', 'WIP viewed across a whole service or value stream.'),
    m('agile-coach', 'optional', 'Supports coaching leaders to start less.'),
    m('senior-leadership', 'optional', 'Signals overload at portfolio level.'),
  ],

  // ---------------- Backlog and refinement ----------------
  'ready-backlog-depth': [
    m(
      'product-owner',
      'mandatory',
      'The Product Owner keeps enough ready work for the team to pull.',
    ),
    m(
      'scrum-master',
      'recommended',
      'Prevents planning sessions that start with nothing ready.',
      'scrum',
    ),
    m('scrum-master', 'recommended', 'Keeps the replenishment queue healthy.', 'scrumban'),
    m('flow-manager', 'recommended', 'Keeps the replenishment queue healthy.'),
    m('team-member', 'optional', 'Shows whether refinement is keeping pace.'),
  ],
  'backlog-items-without-estimate': [
    m('product-owner', 'recommended', 'Unestimated top items cannot be forecast.'),
    m('scrum-master', 'recommended', 'Points refinement time at the right items.'),
    m('team-member', 'optional', 'A to-do list for refinement.'),
    m('jira-admin', 'optional', 'Needs the estimation field on the right screens.'),
  ],
  'items-without-acceptance-criteria': [
    m('product-owner', 'recommended', 'Clear acceptance criteria are part of making items ready.'),
    m(
      'team-member',
      'recommended',
      'The team needs to know what "done" looks like before starting.',
    ),
    m('scrum-master', 'optional', 'A refinement health check.'),
    m('flow-manager', 'optional', 'Unclear items cause rework and long cycle times.'),
  ],
  'stale-backlog-items': [
    m('product-owner', 'recommended', 'Pruning the backlog is a Product Owner responsibility.'),
    m('scrum-master', 'optional', 'Supports the Product Owner in backlog management.'),
    m('jira-admin', 'optional', 'Supports clean-up conventions across projects.'),
  ],
  'backlog-age': [
    m('product-owner', 'optional', 'Shows whether the backlog is a plan or an archive.'),
    m('agile-coach', 'optional', 'A conversation starter about backlog management.'),
    m('delivery-manager', 'optional', 'Very old backlogs distort roadmap expectations.'),
  ],

  // ---------------- Scaled ----------------
  'feature-completion-per-pi': [
    m('rte', 'mandatory', 'Shows whether the train delivers the features it plans each PI.'),
    m('tribe-lead', 'mandatory', 'The equivalent delivery view for a tribe or product line.'),
    m('product-owner', 'recommended', 'Product Owners own the features their teams deliver.'),
    m('delivery-manager', 'recommended', 'Feeds release and roadmap coordination.'),
    m('senior-leadership', 'optional', 'A PI-level delivery signal, read with PI predictability.'),
  ],
  'cross-team-dependencies': [
    m('rte', 'mandatory', 'Managing dependencies is central to running a train.'),
    m('tribe-lead', 'recommended', 'Dependencies between squads drive most delivery risk.'),
    m(
      'delivery-manager',
      'recommended',
      'Dependencies are the main source of schedule risk across teams.',
    ),
    m(
      'scrum-master',
      'recommended',
      'Teams on a train need to see and manage their dependencies.',
      'scaled',
    ),
    m('agile-coach', 'optional', 'Many dependencies can point to team design problems.'),
    m('jira-admin', 'optional', 'Needs agreed link types and, for the best query, ScriptRunner.'),
  ],
  'cross-team-blockers': [
    m('rte', 'mandatory', 'Clearing blockers between teams is a core RTE activity.'),
    m('tribe-lead', 'recommended', 'Blockers between squads often need a lead to decide.'),
    m('scrum-master', 'recommended', 'Raises the team’s blockers at the train sync.', 'scaled'),
    m('delivery-manager', 'recommended', 'Blockers threaten delivery dates.'),
    m('engineering-manager', 'optional', 'Some blockers need management intervention.'),
  ],
  'epic-progress': [
    m(
      'product-owner',
      'recommended',
      'Shows progress on the larger outcomes the Product Owner owns.',
    ),
    m('rte', 'recommended', 'Progress across the train’s epics.', 'scaled'),
    m('tribe-lead', 'recommended', 'Progress across the tribe’s epics.', 'scaled'),
    m('delivery-manager', 'recommended', 'Progress reporting without reading team boards.'),
    m('senior-leadership', 'optional', 'High-level progress view.'),
  ],
  'team-capacity-load': [
    m('rte', 'recommended', 'Overloaded teams make the PI plan unrealistic.'),
    m('tribe-lead', 'recommended', 'Balancing load across squads.'),
    m('engineering-manager', 'recommended', 'Protects teams from sustained overload.'),
    m('delivery-manager', 'optional', 'Supports realistic plans.'),
  ],
  'release-readiness': [
    m('delivery-manager', 'mandatory', 'The go/no-go picture for a release.'),
    m('rte', 'recommended', 'Supports release planning on the train.', 'scaled'),
    m('product-owner', 'recommended', 'Decides what moves out of the release.'),
    m(
      'engineering-manager',
      'recommended',
      'Open bugs and blockers before release are a quality risk.',
    ),
    m('team-member', 'optional', 'Shows what is left before release.'),
  ],

  // ---------------- Jira hygiene and governance ----------------
  'issues-without-assignee': [
    m('scrum-master', 'recommended', 'Keeps the board an honest picture of who is doing what.'),
    m('flow-manager', 'recommended', 'Unowned WIP distorts flow metrics.'),
    m('team-member', 'recommended', 'Taking ownership in Jira keeps the board trustworthy.'),
    m('jira-admin', 'optional', 'A data quality signal across projects.'),
  ],
  'issues-without-parent': [
    m('product-owner', 'recommended', 'Unlinked work is missing from epic and roadmap views.'),
    m('jira-admin', 'recommended', 'A structural data quality check.'),
    m('delivery-manager', 'optional', 'Roadmaps understate work when items are unlinked.'),
    m('rte', 'optional', 'Feature and epic roll-ups depend on links.', 'scaled'),
  ],
  'issues-without-estimate': [
    m('scrum-master', 'recommended', 'Unestimated sprint items break burndown and velocity.'),
    m('team-member', 'optional', 'A sprint-start checklist item.'),
    m('jira-admin', 'optional', 'Supports estimation field configuration.'),
  ],
  'stale-in-progress': [
    m('scrum-master', 'recommended', 'Abandoned items distort WIP and the sprint picture.'),
    m('flow-manager', 'recommended', 'Abandoned WIP inflates flow metrics.'),
    m('team-member', 'optional', 'Housekeeping for the team’s own board.'),
    m('jira-admin', 'optional', 'A data quality signal across projects.'),
  ],
  'items-open-in-closed-sprints': [
    m('scrum-master', 'recommended', 'Catches work that fell through at sprint close.'),
    m('product-owner', 'optional', 'Decides where left-behind items go.'),
    m('jira-admin', 'optional', 'A data quality signal across Scrum boards.'),
  ],
  'label-component-compliance': [
    m('jira-admin', 'recommended', 'Filters, boards and reports depend on these fields.'),
    m('delivery-manager', 'optional', 'Cross-team reports often rely on components or labels.'),
    m('engineering-manager', 'optional', 'Component ownership depends on consistent data.'),
  ],
  'workflow-status-misuse': [
    m(
      'jira-admin',
      'mandatory',
      'Workflow design is the Jira administrator’s responsibility, and every flow metric depends on it.',
    ),
    m('agile-coach', 'optional', 'Misuse patterns reveal process friction.'),
    m('flow-manager', 'optional', 'Zero-time items distort cycle time.'),
    m('scrum-master', 'optional', 'Helps the team keep its workflow honest.'),
  ],

  // ---------------- Outside Jira (optional by design) ----------------
  'deployment-frequency': [
    m('engineering-manager', 'optional', 'A delivery throughput signal from the pipeline.'),
    m('team-member', 'optional', 'Shows how small and frequent the team’s releases are.'),
    m('agile-coach', 'optional', 'Supports conversations about batch size.'),
    m('senior-leadership', 'optional', 'A widely used delivery capability signal.'),
  ],
  'change-lead-time': [
    m('engineering-manager', 'optional', 'Shows how quickly committed changes reach users.'),
    m('team-member', 'optional', 'Highlights slow reviews and pipelines.'),
    m('agile-coach', 'optional', 'Complements Jira-based flow metrics with pipeline data.'),
  ],
  'change-fail-rate': [
    m('engineering-manager', 'optional', 'The stability counterpart to deployment frequency.'),
    m('team-member', 'optional', 'Shows whether speed is costing stability.'),
    m('senior-leadership', 'optional', 'A widely used stability signal.'),
  ],
  'failed-deployment-recovery-time': [
    m(
      'engineering-manager',
      'optional',
      'Shows how quickly the team restores service after a bad deployment.',
    ),
    m('team-member', 'optional', 'Highlights gaps in rollback and incident practice.'),
  ],
  'deployment-rework-rate': [
    m(
      'engineering-manager',
      'optional',
      'Shows how much deployment effort goes into production fixes.',
    ),
    m('team-member', 'optional', 'A view of unplanned, incident-driven work.'),
  ],
};

export default mandates;

/** Shorthand for one mandate entry. */
function m(
  roleId: string,
  mandate: RoleMandate['mandate'],
  rationale: string,
  framework?: Framework,
): RoleMandate {
  return framework ? { roleId, mandate, rationale, framework } : { roleId, mandate, rationale };
}
