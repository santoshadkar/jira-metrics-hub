import { Link, useParams } from 'react-router';
import PageHeader from '../components/PageHeader.tsx';
import FrameworkFilter from '../components/FrameworkFilter.tsx';
import MetricCard from '../components/MetricCard.tsx';
import MandateSummaryText from '../components/MandateSummaryText.tsx';
import { ProposedBaselineBadge } from '../components/Badges.tsx';
import { registry } from '../content/index.ts';
import { metricsForRole, type RoleMetric } from '../lib/browse.ts';
import { FRAMEWORK_LABELS } from '../lib/labels.ts';
import { useFrameworkParam } from '../lib/url-params.ts';
import RoleJqlExport from '../components/RoleJqlExport.tsx';
import NotFoundPage from './NotFoundPage.tsx';

const GROUPS = [
  {
    mandate: 'mandatory',
    title: 'Mandatory',
    blurb: 'Track these. Proposed as the minimum for this role.',
    border: 'border-blue-700 dark:border-blue-400',
  },
  {
    mandate: 'recommended',
    title: 'Recommended',
    blurb: 'Worth tracking for most teams in this role.',
    border: 'border-blue-300 dark:border-blue-700',
  },
  {
    mandate: 'optional',
    title: 'Optional',
    blurb: 'Useful in some contexts. Add them when they answer a real question.',
    border: 'border-slate-300 dark:border-slate-700',
  },
] as const;

function MetricGrid({ items, emptyText }: { items: RoleMetric[]; emptyText: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-700 dark:text-slate-300">{emptyText}</p>;
  }
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {items.map(({ metric, summary }) => {
        const rationale = summary.perFramework.find(
          (e) => e.mandate === summary.mandate,
        )?.rationale;
        return (
          <li key={metric.id}>
            <MetricCard metric={metric}>
              <MandateSummaryText summary={summary} />
              {rationale && <p className="mt-2 text-slate-700 dark:text-slate-300">{rationale}</p>}
            </MetricCard>
          </li>
        );
      })}
    </ul>
  );
}

export default function RolePage() {
  const { roleId } = useParams();
  const role = roleId ? registry.roleById.get(roleId) : undefined;
  const [framework, setFramework] = useFrameworkParam();
  if (!role) return <NotFoundPage />;

  const groups = metricsForRole(registry.metrics, role.id, framework);
  const scope = framework ? FRAMEWORK_LABELS[framework] : 'any framework';

  return (
    <>
      <PageHeader title={role.name}>
        <p>{role.description}</p>
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <FrameworkFilter value={framework} onChange={setFramework} options={role.framework} />
        <span className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <ProposedBaselineBadge />
          Levels are a proposal. Your organisation decides.
        </span>
        <RoleJqlExport role={role} framework={framework} />
      </div>
      {!framework && (
        <p className="mb-6 max-w-3xl text-sm text-slate-700 dark:text-slate-300">
          Showing every framework. Where a metric&rsquo;s level differs between frameworks, it is
          grouped by its highest level and the breakdown is shown on the card.
        </p>
      )}

      {GROUPS.map((group) => (
        <section
          key={group.mandate}
          aria-labelledby={`group-${group.mandate}`}
          className={`mb-8 border-l-4 pl-4 ${group.border}`}
        >
          <h2 id={`group-${group.mandate}`} className="text-xl font-semibold">
            {group.title}{' '}
            <span className="text-base font-normal text-slate-600 dark:text-slate-400">
              ({groups[group.mandate].length})
            </span>
          </h2>
          <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">{group.blurb}</p>
          <MetricGrid
            items={groups[group.mandate]}
            emptyText={`No ${group.title.toLowerCase()} metrics for this role in ${scope}.`}
          />
        </section>
      ))}

      {groups['not-applicable'].length > 0 && (
        <details className="mb-8">
          <summary className="cursor-pointer font-semibold">
            Not applicable to this role ({groups['not-applicable'].length})
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-sm">
            {groups['not-applicable'].map(({ metric }) => (
              <li key={metric.id}>
                <Link
                  to={`/metrics/${metric.id}`}
                  className="text-blue-700 underline dark:text-blue-300"
                >
                  {metric.name}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}
