import { useId, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import PageHeader from '../components/PageHeader.tsx';
import FrameworkFilter from '../components/FrameworkFilter.tsx';
import MandateSummaryText from '../components/MandateSummaryText.tsx';
import { ProposedBaselineBadge } from '../components/Badges.tsx';
import { registry } from '../content/index.ts';
import { metricsForRole } from '../lib/browse.ts';
import { MANDATE_LABELS } from '../lib/labels.ts';
import { useFrameworkParam, useUrlParam } from '../lib/url-params.ts';

const SHOWN = ['mandatory', 'recommended', 'optional'] as const;

function SearchBox() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const id = useId();
  return (
    <form
      role="search"
      className="flex max-w-xl flex-wrap items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }}
    >
      <div className="flex-1">
        <label htmlFor={id} className="mb-1 block font-semibold">
          Search metrics and JQL
        </label>
        <input
          id={id}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. velocity, aging, closedSprints"
          className="w-full rounded border border-slate-400 bg-white px-3 py-2 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-950 dark:placeholder:text-slate-400"
        />
      </div>
      <button
        type="submit"
        className="rounded bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400"
      >
        Search
      </button>
    </form>
  );
}

function Picker() {
  const [framework, setFramework] = useFrameworkParam();
  const [roleId, setRoleId] = useUrlParam('role');
  const roleSelectId = useId();
  const role = registry.roleById.get(roleId);
  const groups = role ? metricsForRole(registry.metrics, role.id, framework) : undefined;

  return (
    <section
      aria-labelledby="picker-heading"
      className="rounded border border-slate-200 p-4 dark:border-slate-800"
    >
      <h2 id="picker-heading" className="text-xl font-semibold">
        What do I need to track?
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <FrameworkFilter value={framework} onChange={setFramework} />
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <label htmlFor={roleSelectId} className="font-semibold">
            Role
          </label>
          <select
            id={roleSelectId}
            value={role?.id ?? ''}
            onChange={(event) => setRoleId(event.target.value || undefined)}
            className="rounded border border-slate-400 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-950"
          >
            <option value="">Choose a role</option>
            {registry.roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!role || !groups ? (
        <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">
          Choose a role (and optionally a framework) to see its metrics.
        </p>
      ) : (
        <div className="mt-4">
          <p className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <ProposedBaselineBadge />
            Levels are a proposal. Your organisation decides.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {SHOWN.map((mandate) => (
              <div key={mandate}>
                <h3 className="mb-2 font-semibold">
                  {MANDATE_LABELS[mandate]} ({groups[mandate].length})
                </h3>
                {groups[mandate].length === 0 ? (
                  <p className="text-sm text-slate-700 dark:text-slate-300">None.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {groups[mandate].map(({ metric, summary }) => (
                      <li key={metric.id}>
                        <Link
                          to={`/metrics/${metric.id}`}
                          className="font-medium text-blue-700 underline dark:text-blue-300"
                        >
                          {metric.name}
                        </Link>
                        {summary.varies && (
                          <div className="mt-1">
                            <MandateSummaryText summary={summary} />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm">
            <Link
              to={`/roles/${role.id}${framework ? `?framework=${framework}` : ''}`}
              className="text-blue-700 underline dark:text-blue-300"
            >
              Full details for {role.name}
            </Link>
          </p>
        </div>
      )}
    </section>
  );
}

export default function HomePage() {
  const { metrics, roles } = registry;
  return (
    <>
      <PageHeader title="Jira Metrics Hub">
        <p>
          One reference for the metrics Scrum, Kanban, Scrumban and scaled teams track in Jira: what
          each one is for, how it is calculated, how it gets misused, and the JQL and dashboards
          that support it, for both Jira Data Center and Jira Cloud.
        </p>
        <p className="mt-2 text-sm">
          {metrics.length} metrics · {roles.length} roles. Reference only: nothing here connects to
          Jira.
        </p>
      </PageHeader>

      <div className="space-y-8">
        <Picker />
        <SearchBox />
      </div>
    </>
  );
}
