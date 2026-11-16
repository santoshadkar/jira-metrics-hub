# Jira Metrics Hub

A standalone, static reference portal: every metric used for Scrum, Kanban, Scrumban
and scaled work in Jira, with role mandates, calculation method, misuse warnings,
copy-ready JQL (Data Center and Cloud variants) and dashboard build guides.

**Reference only.** It never connects to Jira, never asks for credentials, tokens or
URLs, and has no backend, authentication, analytics or tracking. The only thing kept
in the browser is the theme choice (`localStorage` key `jmh-theme`).

## Stack

- React 19, Vite 8, TypeScript 6 (`strict`, `noUncheckedIndexedAccess`)
- Tailwind CSS 4 via `@tailwindcss/vite`, class-based dark mode (`.dark` on `<html>`)
- React Router 8 with `HashRouter` (deep links work on any static host), relative
  base path `./` (override with the `BASE_PATH` env var)
- Fuse.js for client-side search
- zod 4 for content validation; tsx to run the TypeScript scripts in `/scripts`
- Vitest 5 + React Testing Library (jsdom); ESLint 10 flat config; Prettier
- Dev server port: 3021

Ask the user before adding any dependency beyond these.

## Commands

| Task                              | Command                                   |
| --------------------------------- | ----------------------------------------- |
| Dev server                        | `npm run dev`                             |
| Validate content                  | `npm run validate`                        |
| JQL lint                          | `npm run lint:jql`                        |
| Build (validate + lint:jql first) | `npm run build` → `dist/`                 |
| Type check                        | `npm run typecheck`                       |
| Lint                              | `npm run lint`                            |
| Tests                             | `npm test`                                |
| Format                            | `npm run format` / `npm run format:check` |

Run build, typecheck, lint and test after every change. The JQL lint only checks
structure (empty queries, quotes, parentheses, placeholders); it does NOT prove a query
is valid in Jira, and the docs must keep saying so.

## Folder layout

```
src/
  types/index.ts        content interfaces + enum constants (FRAMEWORKS, PLACEHOLDERS, …)
  types/schemas.ts      zod schemas; compile-time check that they equal the interfaces
  content/
    metrics/<category>/<metric-id>.ts   one file per metric, default export `satisfies MetricContent`
    dashboards/<id>.ts  one file per dashboard guide, `satisfies DashboardGuide`
    roles.ts            Role[] (11 roles from the brief)
    mandates.ts         PROPOSED BASELINE: metric id → RoleMandate[]
    sources.ts          shared Source objects; add one only after fetching the page
    edition-differences.ts  13 DC vs Cloud differences, each with sources
    gadget-steps.ts     gadget guide builders (exact gadget names per edition)
    dashboard-common.ts shared dashboard prerequisites, sources and JQL variants
    index.ts            import.meta.glob discovery → `registry` (no runtime validation in
                        production; main.tsx validates in dev only, so zod isn't shipped)
  lib/
    content-validation.ts   all schema + cross-reference rules
    registry.ts             RawContent / ParsedContent types, assembleRegistry()
    placeholders.ts         placeholdersIn / segmentJql / substitutePlaceholders
    jql-preferences*.ts(x)  in-memory parameter values + edition view (context + provider)
    jql-groups.ts           pairs DC/Cloud variants that share a label
    mandates.ts             effectiveMandate (one framework), mandateSummary (strongest
                            level + per-framework breakdown), mandateRows
    browse.ts               metricsForRole (grouped by level), metricsByCategory
    search.ts               Fuse index over name / purpose / jql.jql, reports matched fields
    url-params.ts           filters live in URL search params (shareable, nothing stored)
    jql-lint.ts             structural JQL lint (quotes, parens, placeholders)
    content-status.ts       collects every needs-verification item, grouped by type
    export.ts               matrixCsv, roleJqlText, downloadText (Blob, no network)
    labels.ts, theme.ts
  components/           Layout, ThemeToggle, PageHeader, Badges, ParamPanel,
                        EditionToggle, JqlBlock, JqlSection (+ JqlList, JqlControls),
                        MetricCard, MandateSummaryText, FrameworkFilter, GadgetList,
                        SourceList, RoleJqlExport
  pages/                one component per route (see App.tsx)
  styles/index.css      Tailwind + print styles (landscape matrix, guides, URLs after links)
scripts/
  load-content.ts       loads content from disk for the scripts
  validate-content.ts   runs before every build; exits 1 on any content error
  lint-jql.ts           runs before every build; exits 1 on any JQL lint issue
tests/                  *.test.ts(x), fixtures.ts, setup.ts
```

Adding a metric = add one file under `src/content/metrics/<category>/` (file name equals
the `id`) plus its key in `mandates.ts`. No code changes, no import edits.

## Content rules (override speed — wrong content is worse than missing content)

1. Every metric needs at least one `source` with a real URL that was actually fetched.
   Prefer official Atlassian documentation. Never invent a URL, title or author.
2. Anything not fetched or confirmed gets `verification: 'needs-verification'` and shows
   a visible "Needs verification" badge. Never state it as fact.
3. No invented benchmarks. `healthyRange` only when a source supports it.
4. Plain, practical language, as an experienced agile coach would explain it to a team.
   No marketing words, filler or generic AI phrasing.
5. Every metric has a `misuseWarning` (e.g. velocity compared across teams, team metrics
   used for individual performance, targets that distort behaviour).
6. `/content-status` lists every `needs-verification` item, grouped by type.
7. Mandates are a proposed baseline. They live only in `src/content/mandates.ts` and are
   labelled "Proposed baseline" everywhere in the UI.

### JQL honesty

- JQL returns lists and counts. It does not calculate velocity, cycle time, cumulative
  flow or percentiles. `calcMethod` must say what is actually true; when the number
  comes from a report, gadget or export, the JQL is only the filter that feeds it.
- Placeholders allowed: `{{PROJECT_KEY}} {{TEAM}} {{BOARD_NAME}} {{SPRINT_NAME}}
{{EPIC_KEY}} {{ISSUE_TYPES}} {{START_DATE}} {{END_DATE}} {{LABEL}}`. Anything else fails
  validation.
- Data Center vs Cloud differences only where confirmed from official Atlassian docs.
- Anything needing an app (e.g. ScriptRunner `issueFunction`) sets `requiresApp`.
- Gadgets: only names from official docs for that edition; otherwise `needs-verification`.

### What validation enforces (build fails otherwise)

Schema (strict: unknown keys rejected, no empty strings, https URLs, ISO dates, at least
one source); unique ids; file name equals metric id; every metric has a mandates key;
mandate roleIds and metric ids exist; mandate `framework` is one the metric lists;
no duplicate role/framework mandate; known placeholders only; `external-tool` metrics
have no JQL or gadgets; `jql-count` / `jql-plus-gadget` metrics have at least one JQL.

## Build phases (stop after each for approval)

1. ✅ Foundation: scaffold, types, validation, routing, layout, theme, CLAUDE.md
2. ✅ Content engine: roles, mandates, velocity / cycle-time / aging-wip /
   pi-predictability, metric detail page, JQL block (copy + edition toggle), parameter panel
3. ✅ Browse and search: home picker, by-role, by-framework, search, mandate matrix
   (filters: framework, category, roles; print button, landscape print)
4. ✅ Full catalogue: 48 metrics across 7 categories (4 metric-level and 4 JQL-level
   needs-verification items at the end of the phase)
5. ✅ Dashboards (12 guides, user-approved count) and the compare-editions page
   (13 differences). Validation: a dashboard can't be `verified` if any filter or
   gadget inside it is needs-verification; no duplicate filter names.
6. ✅ Hardening: content-status page, JQL lint in the build, CSV + JQL text exports,
   print styles (details opened for print), browser a11y audit (WCAG AA contrast light
   and dark on 9 pages, control names, one h1), README with how-tos, bundle split into
   app / content / vendor chunks (no chunk over 500 kB)

## Decisions taken

- `RoleMandate.framework` is optional; omitted means the mandate applies to all of the
  metric's frameworks. A role with no entry for a metric counts as not-applicable.
- Scrumban has no category of its own: applicable metrics list `'scrumban'` in `framework`.
- Data Center content is documented against **Jira Software Data Center 10.7** docs
  (`confluence.atlassian.com/jirasoftwareserver107/...`). Unversioned
  `jirasoftwareserver/` URLs now serve the 11.3 docs, so always use the versioned 10.7
  URL. (Atlassian has shipped DC 11.x; the user chose 10.x on 2026-11-16.)
- Cloud JQL is written for company-managed spaces, with a note wherever team-managed
  spaces differ.
- Mandates: a framework-specific entry overrides the general entry for that framework.
  With no framework filter, browse views group a metric by the role's strongest level
  across the metric's frameworks and write the per-framework breakdown out in text.
- Ratios (X ÷ Y) use calcMethod `export-calc`, even when both counts come from JQL: JQL
  returns counts, not divisions. `jql-count` only when one query's count IS the metric.
- Organisation conventions (labels for "unplanned", "found in production", PI labels,
  "ready") are stated as conventions in the content, with the label in `{{LABEL}}`.
- The hygiene "Sprint issues without estimate" (committed sprint work) is kept separate
  from the backlog "Backlog items without estimate" (not-started items).
- DORA: five metrics (DORA's current model incl. deployment rework rate), all
  `external-tool`, no JQL, every role `optional`.
- Filters (framework, role, category, search query) are URL search params, so filtered
  views can be linked. Printing always switches to light mode (beforeprint/afterprint).

## Research method

- Atlassian Cloud support pages are too long for the web-fetch tool (it truncates to
  navigation). Download with `curl -sL` into the session scratchpad, strip HTML to text
  (`python -I strip.py page.html page.txt`), then grep. Many Cloud pages render the body
  client-side, but the full article is embedded in the HTML as JSON (`"body":"…"`):
  extract it with a small script (json-decode the string, strip tags) and read it
  verbatim. Only fall back to the web-fetch agent if that fails, and note it.
- SAFe framework pages are behind a login. The public facilitator-guide PDFs
  (`framework.scaledagile.com/wp-content/uploads/...`, read with `pdftotext`) and the
  glossary page are readable.
- Only a page that actually loaded may be cited. Record what each fact rests on.

## Confirmed edition facts (sources in `src/content/sources.ts`)

- Epic children: DC 10.7 uses `"epic link"`; DC `parent` finds sub-tasks only. Cloud
  retired Epic link (Feb 2024) in favour of `parent`, which finds all child work items
  in company- and team-managed spaces.
- Users: DC searches by full name, ID or email. Cloud examples use Atlassian account IDs.
- Work type field: `type` in both (DC alias `issueType`, Cloud alias `workType`).
- `sprint` (name or ID), `openSprints()`, `closedSprints()`, `futureSprints()`: both.
- `statusCategory`: DC 10.7 documents values To Do / In Progress / Done. Cloud: the fields
  page shows `statusCategory = Done`; a Cloud-only Atlassian KB shows
  `StatusCategory in ("To Do","In Progress")` and `statusCategoryChangedDate <= -7d`
  (Cloud only; not in the DC docs).
- Link type field: DC `issueLinkType`, Cloud `workItemLinkType`. Linked-issue function:
  DC `linkedIssues()`, Cloud `linkedWorkItems()`.
- Non-sub-task function: DC `standardIssueTypes()`, Cloud `standardWorkTypes()`.
- Cloud `parent` does not support IS / IS NOT, so "no parent" has no native Cloud query.
  DC `"epic link"` supports IS EMPTY.
- Flag: both editions store it in the custom checkbox field "Flagged" with the single value
  Impediment → `Flagged = Impediment`. WAS/CHANGED are documented only for Assignee, Fix
  Version, Priority, Reporter, Resolution and Status, so flag history needs an export.
- `earliestUnreleasedVersion(KEY)`, `due`, `fixVersion`, `originalEstimate`, `resolution`
  (IS EMPTY), `component`/`labels` (IS EMPTY), `description` (~, !~, IS): both.
- DC never names the story points field in its docs → DC "Story Points" JQL is
  needs-verification. Custom fields are searchable by name or `cf[ID]` (ID is safer).
- ScriptRunner: `addedAfterSprintStart` and `linkedIssuesOf` exist in DC and in Cloud
  Enhanced Search (same `issueFunction in …` syntax); `removedAfterSprintStart`,
  `incompleteInSprint`, `completeInSprint` are documented as NOT available in Cloud.
- Reports (DC 10.7, verbatim): Sprint Report marks issues added after sprint start with an
  asterisk; Burndown/Burnup/Sprint/Version/Epic reports use board filter + column mapping
  (right-most column = Done); Burnup excludes sub-task story points; Version Report
  predicts a release date from velocity; CFD widening band = bottleneck.
- Cloud report pages (read verbatim from the embedded JSON body): velocity, control chart,
  sprint report, burndown, CFD and version report pages are written for company-managed
  spaces; burndown, burnup, sprint report and version report apply to Scrum boards; the
  Cloud sprint report page does not mention the asterisk for added issues.
- Gadgets: names must match "Gadgets for Jira applications" (DC 10.7) or "Dashboard
  gadgets" (Cloud admin) exactly. They differ: Issue Statistics ↔ Work item Statistics
  Gadget, Created vs. Resolved Chart ↔ Created vs Resolved Gadget, Average Age Chart ↔
  Average Age Gadget, Time Since Chart ↔ Time Since Work items Gadget, Jira Road Map ↔ Road
  Map Gadget. DC-only: Version Report, Agile Wallboard Gadget. DC's Average Time in Status
  needs the Jira Charting App; Cloud lists it as pre-installed. Gadget configuration steps
  come from `src/content/gadget-steps.ts`; steps the docs don't describe (choosing a board
  or sprint, Cloud filter selection for chart gadgets) are needs-verification.
- Atlassian states Data Center support ends on March 28, 2029 (banner on DC 10.7 pages).
- `CHANGED` with FROM / TO / DURING / BY / BEFORE / AFTER / ON: both.
- Cloud estimates: company-managed "Story points" vs team-managed "Story point estimate"
  are different fields.
- Velocity chart: Scrum boards only, board filter based, 120-sprint cap (DC). Control
  chart: average, rolling average, standard deviation; **no percentiles** in either edition.
- "Days in column" card dots: time in the current column (cumulative on revisits), on by
  default for Kanban boards, off for Scrum boards, both editions.
