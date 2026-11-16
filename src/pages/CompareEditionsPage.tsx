import PageHeader from '../components/PageHeader.tsx';
import SourceList from '../components/SourceList.tsx';
import { VerificationBadge } from '../components/Badges.tsx';
import { registry } from '../content/index.ts';

export default function CompareEditionsPage() {
  const differences = registry.editionDifferences;
  return (
    <>
      <PageHeader title="Compare editions">
        <p>
          Differences between Jira Data Center 10.7 and Jira Cloud that matter for JQL and
          dashboards. Each one is confirmed from the official documentation linked under it.
        </p>
      </PageHeader>

      <nav aria-label="Differences on this page" className="no-print mb-8">
        <ul className="flex flex-wrap gap-2 text-sm">
          {differences.map((d) => (
            <li key={d.id}>
              <a
                href={`#/editions`}
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById(`diff-${d.id}`)?.scrollIntoView();
                  document.getElementById(`diff-${d.id}`)?.focus();
                }}
                className="inline-block rounded border border-slate-300 px-2 py-1 hover:border-blue-500 dark:border-slate-700"
              >
                {d.topic}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-10">
        {differences.map((d) => (
          <section
            key={d.id}
            id={`diff-${d.id}`}
            tabIndex={-1}
            aria-labelledby={`diff-${d.id}-title`}
            className="break-inside-avoid"
          >
            <h2
              id={`diff-${d.id}-title`}
              className="flex flex-wrap items-center gap-3 text-xl font-semibold"
            >
              {d.topic}
              <VerificationBadge status={d.verification} />
            </h2>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="rounded border border-slate-200 p-4 dark:border-slate-800">
                <h3 className="mb-1 font-semibold">Data Center</h3>
                <p>{d.datacenter}</p>
              </div>
              <div className="rounded border border-slate-200 p-4 dark:border-slate-800">
                <h3 className="mb-1 font-semibold">Cloud</h3>
                <p>{d.cloud}</p>
              </div>
            </div>
            <p className="mt-3 max-w-3xl">
              <strong>Why it matters:</strong> {d.whyItMatters}
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-semibold">Sources</summary>
              <div className="mt-2 text-sm">
                <SourceList sources={d.sources} />
              </div>
            </details>
          </section>
        ))}
      </div>
    </>
  );
}
