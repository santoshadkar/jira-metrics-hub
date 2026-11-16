import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import PageHeader from '../components/PageHeader.tsx';
import GadgetList from '../components/GadgetList.tsx';
import SourceList from '../components/SourceList.tsx';
import { JqlControls, JqlList } from '../components/JqlSection.tsx';
import { VerificationBadge } from '../components/Badges.tsx';
import { registry } from '../content/index.ts';
import { FRAMEWORK_LABELS } from '../lib/labels.ts';
import { useJqlPreferences } from '../lib/jql-preferences-context.ts';
import NotFoundPage from './NotFoundPage.tsx';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function DashboardPage() {
  const { dashboardId } = useParams();
  const { editionView } = useJqlPreferences();
  const dashboard = dashboardId ? registry.dashboardById.get(dashboardId) : undefined;
  if (!dashboard) return <NotFoundPage />;

  const allVariants = dashboard.filters.flatMap((f) => f.jql);
  const showDc = editionView !== 'cloud';
  const showCloud = editionView !== 'datacenter';

  return (
    <article className="print-guide">
      <PageHeader title={dashboard.title}>
        <p>{dashboard.purpose}</p>
      </PageHeader>

      <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Who reads it</dt>
          <dd className="mt-1 max-w-md">{dashboard.audience}</dd>
        </div>
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Roles</dt>
          <dd className="mt-1">
            {dashboard.roleIds.map((id, i) => (
              <span key={id}>
                {i > 0 && ', '}
                <Link to={`/roles/${id}`} className="text-blue-700 underline dark:text-blue-300">
                  {registry.roleById.get(id)?.name ?? id}
                </Link>
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Frameworks</dt>
          <dd className="mt-1">
            {dashboard.frameworks.map((f) => FRAMEWORK_LABELS[f]).join(', ')}
          </dd>
        </div>
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Content status</dt>
          <dd className="mt-1">
            <VerificationBadge status={dashboard.verification} />
          </dd>
        </div>
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Last reviewed</dt>
          <dd className="mt-1">
            <time dateTime={dashboard.lastReviewed}>{dashboard.lastReviewed}</time>
          </dd>
        </div>
      </dl>

      <div className="no-print mt-4">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded border border-slate-400 px-3 py-1 text-sm font-semibold hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          Print this guide
        </button>
      </div>

      {dashboard.verification === 'needs-verification' && (
        <p className="mt-6 max-w-3xl rounded border border-amber-400 bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100">
          Some steps in this guide could not be fully confirmed from official documentation. They
          are marked &ldquo;Needs verification&rdquo; below.
        </p>
      )}

      <Section title="Before you start">
        <ul className="max-w-3xl list-disc space-y-1 pl-6">
          {dashboard.prerequisites.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Section>

      <Section title="Step 1: create these saved filters">
        <JqlControls variants={allVariants} />
        <ol className="mt-6 space-y-8">
          {dashboard.filters.map((filter, i) => (
            <li key={filter.name} className="break-inside-avoid">
              <h3 className="font-semibold">
                {i + 1}. Filter name: <span className="font-mono">{filter.name}</span>
              </h3>
              <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
                {filter.purpose}
                {filter.metricId && registry.metricById.has(filter.metricId) && (
                  <>
                    {' '}
                    Supports{' '}
                    <Link
                      to={`/metrics/${filter.metricId}`}
                      className="text-blue-700 underline dark:text-blue-300"
                    >
                      {registry.metricById.get(filter.metricId)?.name}
                    </Link>
                    .
                  </>
                )}
              </p>
              <JqlList variants={filter.jql} />
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Step 2: add the gadgets, in this order">
        <div className={`grid gap-6 ${showDc && showCloud ? 'lg:grid-cols-2' : ''}`}>
          {showDc && (
            <section aria-labelledby="dc-gadgets">
              <h3 id="dc-gadgets" className="mb-3 font-semibold">
                Jira Data Center
              </h3>
              <GadgetList gadgets={dashboard.gadgets.datacenter} />
            </section>
          )}
          {showCloud && (
            <section aria-labelledby="cloud-gadgets">
              <h3 id="cloud-gadgets" className="mb-3 font-semibold">
                Jira Cloud
              </h3>
              <GadgetList gadgets={dashboard.gadgets.cloud} />
            </section>
          )}
        </div>
      </Section>

      <Section title="Sources">
        <SourceList sources={dashboard.sources} />
      </Section>
    </article>
  );
}
