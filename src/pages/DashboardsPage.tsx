import { useId } from 'react';
import { Link } from 'react-router';
import PageHeader from '../components/PageHeader.tsx';
import FrameworkFilter from '../components/FrameworkFilter.tsx';
import { VerificationBadge } from '../components/Badges.tsx';
import { registry } from '../content/index.ts';
import { FRAMEWORK_LABELS } from '../lib/labels.ts';
import { useFrameworkParam, useUrlParam } from '../lib/url-params.ts';

export default function DashboardsPage() {
  const [framework, setFramework] = useFrameworkParam();
  const [roleId, setRoleId] = useUrlParam('role');
  const roleSelectId = useId();
  const role = registry.roleById.get(roleId);

  const dashboards = registry.dashboards.filter(
    (d) =>
      (!framework || d.frameworks.includes(framework)) && (!role || d.roleIds.includes(role.id)),
  );

  return (
    <>
      <PageHeader title="Dashboards">
        <p>
          Step-by-step build guides for Jira dashboards, with separate gadget steps for Data Center
          and Cloud. Each guide lists the saved filters to create first, then the gadgets to add in
          order.
        </p>
      </PageHeader>

      <div className="no-print mb-6 flex flex-wrap items-center gap-4">
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
            <option value="">All roles</option>
            {registry.roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {dashboards.length === 0 ? (
        <p>No dashboard guide matches these filters.</p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {dashboards.map((d) => (
            <li key={d.id}>
              <article className="flex h-full flex-col rounded border border-slate-200 p-4 dark:border-slate-800">
                <h2 className="font-semibold">
                  <Link
                    to={`/dashboards/${d.id}`}
                    className="text-blue-800 underline-offset-2 hover:underline dark:text-blue-300"
                  >
                    {d.title}
                  </Link>
                </h2>
                <p className="mt-1 flex-1 text-sm text-slate-700 dark:text-slate-300">
                  {d.purpose}
                </p>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  For: {d.roleIds.map((id) => registry.roleById.get(id)?.name ?? id).join(', ')}
                  <br />
                  {d.frameworks.map((f) => FRAMEWORK_LABELS[f]).join(' · ')}
                </p>
                <div className="mt-2">
                  <VerificationBadge status={d.verification} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
