import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import PageHeader from '../components/PageHeader.tsx';
import JqlSection from '../components/JqlSection.tsx';
import {
  CalcMethodBadge,
  MandateBadge,
  ProposedBaselineBadge,
  VerificationBadge,
} from '../components/Badges.tsx';
import { registry } from '../content/index.ts';
import { CALC_METHOD_DESCRIPTIONS, CATEGORY_LABELS, FRAMEWORK_LABELS } from '../lib/labels.ts';
import { mandateRows } from '../lib/mandates.ts';
import NotFoundPage from './NotFoundPage.tsx';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

const PROSE = 'max-w-3xl leading-relaxed text-slate-800 dark:text-slate-200';

export default function MetricPage() {
  const { metricId } = useParams();
  const metric = metricId ? registry.metricById.get(metricId) : undefined;
  if (!metric) return <NotFoundPage />;

  const jqlProducesNumber = metric.calcMethod === 'jql-count';
  const rows = mandateRows(metric, registry.roles);

  return (
    <article>
      <PageHeader title={metric.name}>
        <p>{metric.purpose}</p>
      </PageHeader>

      <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Calculated by</dt>
          <dd className="mt-1">
            <CalcMethodBadge method={metric.calcMethod} />
          </dd>
        </div>
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Content status</dt>
          <dd className="mt-1">
            <VerificationBadge status={metric.verification} />
          </dd>
        </div>
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Category</dt>
          <dd className="mt-1">{CATEGORY_LABELS[metric.category]}</dd>
        </div>
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Frameworks</dt>
          <dd className="mt-1">
            {metric.framework.map((f, i) => (
              <span key={f}>
                {i > 0 && ', '}
                <Link
                  to={`/frameworks/${f}`}
                  className="text-blue-700 underline dark:text-blue-300"
                >
                  {FRAMEWORK_LABELS[f]}
                </Link>
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Cadence</dt>
          <dd className="mt-1">{metric.cadence}</dd>
        </div>
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Last reviewed</dt>
          <dd className="mt-1">
            <time dateTime={metric.lastReviewed}>{metric.lastReviewed}</time>
          </dd>
        </div>
      </dl>

      {metric.verification === 'needs-verification' && (
        <p className="mt-6 max-w-3xl rounded border border-amber-400 bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100">
          Parts of this page could not be confirmed from an official source. Items marked
          &ldquo;Needs verification&rdquo; should be checked before you rely on them.
        </p>
      )}

      <Section title="How it is calculated">
        <p className={PROSE}>{metric.formula}</p>
        <p className={`${PROSE} mt-3`}>
          <strong>Where the number comes from:</strong>{' '}
          {CALC_METHOD_DESCRIPTIONS[metric.calcMethod]}
        </p>
      </Section>

      <Section title="How to read it">
        <p className={PROSE}>{metric.howToRead}</p>
        {metric.healthyRange && (
          <p className={`${PROSE} mt-3`}>
            <strong>Range supported by the sources:</strong> {metric.healthyRange}
          </p>
        )}
      </Section>

      <Section title="How it gets misused">
        <div className="max-w-3xl rounded border-l-4 border-rose-600 bg-rose-50 p-4 leading-relaxed text-rose-950 dark:border-rose-400 dark:bg-rose-950 dark:text-rose-50">
          {metric.misuseWarning}
        </div>
      </Section>

      <Section title="Prerequisites">
        {metric.prerequisites.length > 0 ? (
          <ul className={`${PROSE} list-disc space-y-1 pl-6`}>
            {metric.prerequisites.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className={PROSE}>None beyond a standard Jira project.</p>
        )}
      </Section>

      <Section title="Who tracks it">
        <p className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <ProposedBaselineBadge />
          These levels are a starting proposal. Your organisation decides what is mandatory.
        </p>
        {rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-300 dark:border-slate-700">
                  <th scope="col" className="py-2 pr-4">
                    Role
                  </th>
                  <th scope="col" className="py-2 pr-4">
                    Level
                  </th>
                  <th scope="col" className="py-2">
                    Why
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.flatMap(({ role, entries }) =>
                  entries.map((entry, i) => (
                    <tr
                      key={`${role.id}-${entry.framework ?? 'all'}`}
                      className="border-b border-slate-200 align-top dark:border-slate-800"
                    >
                      <th scope="row" className="py-2 pr-4 font-medium">
                        {i === 0 ? (
                          <Link
                            to={`/roles/${role.id}`}
                            className="text-blue-700 underline dark:text-blue-300"
                          >
                            {role.name}
                          </Link>
                        ) : (
                          <span className="sr-only">{role.name}</span>
                        )}
                      </th>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <MandateBadge mandate={entry.mandate} />
                        <span className="ml-2 text-slate-700 dark:text-slate-300">
                          {entry.framework
                            ? `for ${FRAMEWORK_LABELS[entry.framework]}`
                            : 'all frameworks'}
                        </span>
                      </td>
                      <td className="py-2">{entry.rationale}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              Roles not listed: not applicable. Where a role has a framework-specific level, it
              replaces the &ldquo;all frameworks&rdquo; level for that framework.
            </p>
          </div>
        ) : (
          <p className={PROSE}>No role has a mandate for this metric yet.</p>
        )}
      </Section>

      <Section title="JQL">
        {!jqlProducesNumber && metric.jql.length > 0 && (
          <p className="mb-4 max-w-3xl rounded border border-indigo-300 bg-indigo-50 p-3 text-sm text-indigo-950 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-100">
            <strong>JQL does not produce this number.</strong> JQL returns lists of issues. The
            queries below select the issues behind the metric, so you can inspect, filter or export
            them. For where the number itself comes from, see &ldquo;How it is calculated&rdquo;
            above.
          </p>
        )}
        {metric.jql.length > 0 ? (
          <JqlSection variants={metric.jql} />
        ) : (
          <p className={PROSE}>No JQL applies to this metric.</p>
        )}
      </Section>

      {metric.dashboardGadget && metric.dashboardGadget.length > 0 && (
        <Section title="Dashboard gadgets">
          <ul className="space-y-4">
            {metric.dashboardGadget.map((gadget) => (
              <li
                key={`${gadget.edition}-${gadget.gadgetName}`}
                className="rounded border border-slate-200 p-4 dark:border-slate-800"
              >
                <p className="flex flex-wrap items-center gap-2 font-medium">
                  {gadget.gadgetName}
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    ({gadget.edition === 'datacenter' ? 'Data Center' : 'Cloud'})
                  </span>
                  <VerificationBadge status={gadget.verification} />
                </p>
                <ol className="mt-2 list-decimal space-y-1 pl-6">
                  {gadget.configuration.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Sources">
        <ul className="max-w-3xl space-y-2">
          {metric.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-blue-700 underline dark:text-blue-300"
              >
                {source.title}
              </a>
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {' '}
                · {source.publisher} · retrieved{' '}
                <time dateTime={source.retrieved}>{source.retrieved}</time>
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </article>
  );
}
