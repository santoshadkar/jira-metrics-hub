# Jira Metrics Hub

A static reference portal for the metrics agile teams track in Jira. For each metric it
explains what it is for, how it is calculated, how to read it and how it gets misused,
which roles should track it (a **proposed baseline**), and gives copy-ready JQL with
separate Jira Data Center and Jira Cloud variants. It also has step-by-step dashboard
build guides for both editions and a page comparing the two editions.

**Reference only.** The portal never connects to Jira, never asks for credentials, tokens
or URLs, and sends no data anywhere. There is no backend, login, analytics or tracking.
The only thing stored in the browser is the light/dark theme choice.

Content is documented against **Jira Software Data Center 10.7** and **Jira Cloud**
(company-managed spaces, with notes where team-managed spaces differ).

## Getting started

Requires Node.js 22 or newer.

```bash
npm install
npm run dev        # http://localhost:3021
```

| Command             | What it does                                                            |
| ------------------- | ----------------------------------------------------------------------- |
| `npm run dev`       | Development server with hot reload (also validates content on start-up) |
| `npm run validate`  | Checks all content against the types and rules (see below)              |
| `npm run lint:jql`  | Structural check of every JQL query (see the warning below)             |
| `npm run build`     | `validate`, then `lint:jql`, then builds the static site into `dist/`   |
| `npm run preview`   | Serves the built site locally                                           |
| `npm run typecheck` | TypeScript, strict mode                                                 |
| `npm run lint`      | ESLint                                                                  |
| `npm test`          | Vitest and React Testing Library                                        |
| `npm run format`    | Prettier                                                                |

## Deploying

`npm run build` produces a fully static site in `dist/`. It uses relative asset paths and
hash-based URLs (`/#/metrics/velocity`), so it works from any folder on any static host
with no rewrite rules:

- **GitHub Pages:** publish the `dist/` folder (for example with an Actions workflow that
  runs `npm ci && npm run build`).
- **Netlify:** build command `npm run build`, publish directory `dist`.
- **Vercel:** framework preset "Vite" (or "Other"), output directory `dist`.

If a host needs an absolute base path, set it at build time: `BASE_PATH=/my/path/ npm run build`.

## How the content works

All content lives in TypeScript files under `src/content/`. There is no database.

```
src/content/
  metrics/<category>/<metric-id>.ts   one file per metric
  dashboards/<dashboard-id>.ts        one file per dashboard guide
  roles.ts                            the roles
  mandates.ts                         PROPOSED BASELINE: which role tracks which metric
  edition-differences.ts              Data Center vs Cloud differences
  sources.ts                          shared, fetched sources
  gadget-steps.ts                     gadget guide builders (exact gadget names per edition)
  dashboard-common.ts                 shared pieces for dashboard guides
```

New metric and dashboard files are picked up automatically. You never edit an import
list or any code to add content.

### The rules (they override speed)

Wrong content is worse than missing content, because this portal is used to govern real
teams.

1. Every metric needs at least one source with a real URL that was actually read. Prefer
   official Atlassian documentation. Never invent a URL, title or author.
2. Anything not confirmed gets `verification: 'needs-verification'`. The portal shows a
   visible badge and lists it on the **Content status** page.
3. No invented benchmarks. Only add `healthyRange` when a source supports it.
4. Plain, practical language, as an experienced agile coach would explain it to a team.
5. Every metric has a `misuseWarning`.
6. JQL returns lists and counts. It does not calculate velocity, cycle time, cumulative
   flow or percentiles. Set `calcMethod` to what is actually true:

   | `calcMethod`      | Use when                                                                 |
   | ----------------- | ------------------------------------------------------------------------ |
   | `jql-count`       | The count of one query _is_ the metric                                   |
   | `jql-plus-gadget` | JQL feeds a gadget that does the maths or chart                          |
   | `native-report`   | A built-in Jira report produces the number; JQL only supports it         |
   | `export-calc`     | The calculation happens outside Jira (including any ratio of two counts) |
   | `marketplace-app` | It needs a third-party app                                               |
   | `external-tool`   | Measured outside Jira entirely; no JQL allowed                           |

7. Mandates are a proposed baseline, kept only in `mandates.ts`, and labelled
   "Proposed baseline" everywhere in the UI.

### JQL placeholders

Only these placeholders are allowed (anything else fails the build):

`{{PROJECT_KEY}}` `{{TEAM}}` `{{BOARD_NAME}}` `{{SPRINT_NAME}}` `{{EPIC_KEY}}`
`{{ISSUE_TYPES}}` `{{START_DATE}}` `{{END_DATE}}` `{{LABEL}}`

Users fill them in the parameter panel on each page; every query updates live, and
unfilled placeholders stay visible.

### Validation and the JQL lint

`npm run validate` fails the build on:

- a missing, empty or unknown field
- a metric or dashboard with no source, or a non-https URL
- an unknown role, metric or placeholder
- a duplicate id, or a file name that does not match the metric id
- a metric with no key in `mandates.ts`
- an `external-tool` metric with JQL
- a dashboard marked verified that contains unverified filters or gadgets

`npm run lint:jql` checks every query for empty queries, unbalanced quotes or
parentheses, and unknown or malformed placeholders.

> **The JQL lint does not prove a query is valid in Jira.** It does not know Jira's
> fields, functions, operators or your site's configuration. Always run a query in your
> own Jira before relying on it.

## How to add a metric

1. Research it. Read the official documentation for both editions and note the exact
   page URLs. Add each new page to `src/content/sources.ts` (only pages you have read).
2. Create `src/content/metrics/<category>/<metric-id>.ts`. The file name must equal the
   `id` (kebab-case). Categories: `scrum-delivery`, `scrum-quality`, `kanban-flow`,
   `backlog-refinement`, `scaled`, `jira-hygiene`, `outside-jira`.

   ```ts
   import type { MetricContent } from '../../../types/index.ts';
   import { SOURCES } from '../../sources.ts';

   export default {
     id: 'my-metric',
     name: 'My metric',
     framework: ['scrum', 'scrumban'],
     category: 'scrum-delivery',
     purpose: 'One or two plain sentences.',
     howToRead: 'How to interpret it, and what to do about it.',
     formula: 'Plain-text formula, no invented precision.',
     calcMethod: 'export-calc',
     cadence: 'Every sprint',
     misuseWarning: 'How it gets gamed or misread.',
     jql: [
       {
         edition: 'both', // or 'datacenter' / 'cloud' when the syntax differs
         label: 'What this query lists',
         jql: 'project = {{PROJECT_KEY}} AND statusCategory = Done',
         notes: 'Optional: field or syntax differences.',
         // requiresApp: 'ScriptRunner for Jira',
         verification: 'verified',
       },
     ],
     prerequisites: ['What must be set up in Jira first.'],
     sources: [SOURCES.dcJqlFields, SOURCES.cloudJqlFields],
     verification: 'verified',
     lastReviewed: '2026-11-16',
   } satisfies MetricContent;
   ```

   When the Data Center and Cloud syntax differ, give two variants with the **same
   label**: the portal shows them side by side.

3. Add a key for the metric in `src/content/mandates.ts`, with one entry per role that
   should track it (roles you leave out count as not applicable). Add `framework` to an
   entry when the level differs by framework.
4. Run `npm run validate`, `npm run lint:jql` and `npm test`.

## How to add a role

1. Add an entry to `src/content/roles.ts` (kebab-case `id`, name, description,
   frameworks).
2. Give it mandates in `src/content/mandates.ts` for the metrics it should track.
3. Optionally add its id to the `roleIds` of relevant dashboard guides.
4. Run `npm run validate` and `npm test`. The role appears on the role pages, the
   home-page picker and the mandate matrix automatically.

## How to add a dashboard guide

1. Create `src/content/dashboards/<dashboard-id>.ts` that default-exports an object
   `satisfies DashboardGuide`. Copy an existing guide (for example `scrum-team.ts`) as a
   starting point.
2. Define the saved filters first: a `name`, a `purpose`, the `jql` variants and,
   optionally, the `metricId` the filter supports.
3. Add gadgets per edition using the builders in `src/content/gadget-steps.ts`, in the
   order they should be added. **Only name gadgets that appear in that edition's official
   gadget list.** If a configuration step is not described in the documentation, the
   builder must mark it `needs-verification`. If you add a new builder, follow the same
   rule.
4. If anything inside the guide needs verification, the guide itself must be
   `needs-verification` (validation enforces this).
5. Run `npm run validate`, `npm run lint:jql` and `npm test`.

## Changing the mandates

Open `src/content/mandates.ts` and change the levels: `mandatory`, `recommended`,
`optional`, `not-applicable`. No metric content changes are needed. The UI keeps the
"Proposed baseline" label; if your organisation adopts the levels formally, change that
wording in `src/components/Badges.tsx`.

## Working through "Needs verification"

The **Content status** page (`/#/content-status`) lists every item still marked
needs-verification, grouped by type, with links. To clear one: confirm it in the official
documentation (or in your own Jira), update the content file, add the source to
`sources.ts`, and set `verification: 'verified'`.

## Tech stack

React 19, Vite 8, TypeScript (strict), Tailwind CSS 4, React Router (hash routing),
Fuse.js (search), zod (build-time validation only; not shipped to the browser), tsx (runs
the scripts), Vitest and React Testing Library, ESLint and Prettier.
