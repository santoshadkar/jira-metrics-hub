import { Link } from 'react-router';
import PageHeader from '../components/PageHeader.tsx';
import { ProposedBaselineBadge } from '../components/Badges.tsx';
import { registry } from '../content/index.ts';
import { FRAMEWORK_LABELS } from '../lib/labels.ts';
import { metricsForRole } from '../lib/browse.ts';

export default function RolesPage() {
  return (
    <>
      <PageHeader title="By role">
        <p>
          Pick a role to see which metrics it should track, split into mandatory, recommended and
          optional.
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <ProposedBaselineBadge />
          The levels are a starting proposal; your organisation decides.
        </p>
      </PageHeader>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {registry.roles.map((role) => {
          const groups = metricsForRole(registry.metrics, role.id);
          return (
            <li key={role.id}>
              <Link
                to={`/roles/${role.id}`}
                className="block h-full rounded border border-slate-200 p-4 hover:border-blue-500 dark:border-slate-800"
              >
                <span className="font-semibold text-blue-800 dark:text-blue-300">{role.name}</span>
                <span className="mt-1 block text-sm text-slate-700 dark:text-slate-300">
                  {role.description}
                </span>
                <span className="mt-2 block text-xs text-slate-600 dark:text-slate-400">
                  {role.framework.map((f) => FRAMEWORK_LABELS[f]).join(' · ')}
                </span>
                <span className="mt-2 block text-sm">
                  {groups.mandatory.length} mandatory · {groups.recommended.length} recommended ·{' '}
                  {groups.optional.length} optional
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
