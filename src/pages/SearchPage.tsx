import { useId, useMemo } from 'react';
import PageHeader from '../components/PageHeader.tsx';
import MetricCard from '../components/MetricCard.tsx';
import { registry } from '../content/index.ts';
import { createMetricSearch, type MatchField } from '../lib/search.ts';
import { useUrlParam } from '../lib/url-params.ts';

const search = createMetricSearch(registry.metrics);

const FIELD_LABELS: Record<MatchField, string> = {
  name: 'name',
  purpose: 'purpose',
  jql: 'JQL',
};

export default function SearchPage() {
  // The URL is the single source of truth, so links and back/forward always
  // show the matching results.
  const [query, setQuery] = useUrlParam('q');
  const inputId = useId();
  const hits = useMemo(() => search(query), [query]);
  const searching = query.trim().length >= 2;

  return (
    <>
      <PageHeader title="Search">
        <p>Fuzzy search across metric names, purposes and JQL. Typos are tolerated.</p>
      </PageHeader>

      <form role="search" className="mb-6 max-w-xl" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor={inputId} className="mb-1 block font-semibold">
          Search metrics
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value || undefined)}
          placeholder="e.g. cycle time, closedSprints, predictability"
          autoComplete="off"
          className="w-full rounded border border-slate-400 bg-white px-3 py-2 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-950 dark:placeholder:text-slate-400"
        />
      </form>

      <p
        role="status"
        aria-live="polite"
        className="mb-4 text-sm text-slate-700 dark:text-slate-300"
      >
        {!searching
          ? 'Type at least two characters.'
          : hits.length === 0
            ? `No metrics match "${query.trim()}".`
            : `${hits.length} metric${hits.length === 1 ? '' : 's'} found.`}
      </p>

      <ul className="grid gap-3 md:grid-cols-2">
        {hits.map(({ metric, matchedIn }) => (
          <li key={metric.id}>
            <MetricCard metric={metric}>
              {matchedIn.length > 0 && (
                <span className="text-slate-700 dark:text-slate-300">
                  Matched in: {matchedIn.map((field) => FIELD_LABELS[field]).join(', ')}
                </span>
              )}
            </MetricCard>
          </li>
        ))}
      </ul>
    </>
  );
}
