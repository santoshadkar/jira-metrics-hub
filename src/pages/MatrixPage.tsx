import { useId } from 'react';
import { Link } from 'react-router';
import PageHeader from '../components/PageHeader.tsx';
import FrameworkFilter from '../components/FrameworkFilter.tsx';
import { MandateBadge, ProposedBaselineBadge } from '../components/Badges.tsx';
import { registry } from '../content/index.ts';
import { CATEGORIES, type Category } from '../types/index.ts';
import { CATEGORY_LABELS, FRAMEWORK_LABELS, MANDATE_LABELS } from '../lib/labels.ts';
import { metricsByCategory } from '../lib/browse.ts';
import { mandateSummary, MANDATE_ORDER } from '../lib/mandates.ts';
import { useFrameworkParam, useUrlParam } from '../lib/url-params.ts';
import { downloadText, matrixCsv, today } from '../lib/export.ts';

const isCategory = (value: string): value is Category =>
  (CATEGORIES as readonly string[]).includes(value);

export default function MatrixPage() {
  const [framework, setFramework] = useFrameworkParam();
  const [categoryParam, setCategory] = useUrlParam('category');
  const [rolesParam, setRolesParam] = useUrlParam('roles');
  const categoryId = useId();
  const category = isCategory(categoryParam) ? categoryParam : undefined;

  const allRoles = registry.roles;
  const selectedRoleIds = rolesParam
    ? rolesParam.split(',').filter((id) => registry.roleById.has(id))
    : allRoles.map((r) => r.id);
  const roles = allRoles.filter((r) => selectedRoleIds.includes(r.id));

  const toggleRole = (roleId: string) => {
    const next = selectedRoleIds.includes(roleId)
      ? selectedRoleIds.filter((id) => id !== roleId)
      : [...selectedRoleIds, roleId];
    const all = next.length === allRoles.length;
    setRolesParam(
      all
        ? undefined
        : allRoles
            .filter((r) => next.includes(r.id))
            .map((r) => r.id)
            .join(',') || 'none',
    );
  };

  const groups = metricsByCategory(registry.metrics, framework).filter(
    (group) => !category || group.category === category,
  );
  const metricCount = groups.reduce((n, g) => n + g.metrics.length, 0);

  return (
    <div className="print-landscape">
      <PageHeader title="Mandate matrix">
        <p>
          Roles across the top, metrics down the side. Each cell shows whether the role should track
          the metric.
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <ProposedBaselineBadge />
          Every level here is a proposed baseline. Which metrics are mandatory is your
          organisation&rsquo;s decision; change them in <code>src/content/mandates.ts</code>.
        </p>
      </PageHeader>

      <div className="no-print mb-4 flex flex-wrap items-center gap-4">
        <FrameworkFilter value={framework} onChange={setFramework} />
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <label htmlFor={categoryId} className="font-semibold">
            Category
          </label>
          <select
            id={categoryId}
            value={category ?? ''}
            onChange={(event) => setCategory(event.target.value || undefined)}
            className="rounded border border-slate-400 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-950"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded border border-slate-400 px-3 py-1 text-sm font-semibold hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          Print
        </button>
        <button
          type="button"
          onClick={() =>
            downloadText(
              `mandate-matrix-proposed-baseline${framework ? `-${framework}` : ''}-${today()}.csv`,
              matrixCsv(
                groups.flatMap((g) => g.metrics),
                roles,
                framework,
              ),
              'text/csv;charset=utf-8',
            )
          }
          className="rounded border border-slate-400 px-3 py-1 text-sm font-semibold hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          Download CSV
        </button>
      </div>

      <fieldset className="no-print mb-6 text-sm">
        <legend className="mb-1 font-semibold">Roles shown</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {allRoles.map((role) => (
            <label key={role.id} className="inline-flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedRoleIds.includes(role.id)}
                onChange={() => toggleRole(role.id)}
              />
              {role.name}
            </label>
          ))}
        </div>
      </fieldset>

      <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
        {metricCount} metric{metricCount === 1 ? '' : 's'} × {roles.length} role
        {roles.length === 1 ? '' : 's'}
        {framework ? ` · ${FRAMEWORK_LABELS[framework]}` : ' · all frameworks'}
        {category ? ` · ${CATEGORY_LABELS[category]}` : ''}. Legend:{' '}
        {MANDATE_ORDER.map((m) => MANDATE_LABELS[m]).join(', ')}.
        {!framework && ' Where a level differs by framework, the cell lists each one.'}
      </p>

      {metricCount === 0 || roles.length === 0 ? (
        <p>Nothing to show with these filters.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-slate-200 dark:border-slate-800">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              Proposed baseline mandate level for each metric and role
            </caption>
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-10 min-w-48 border-b border-slate-300 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900"
                >
                  Metric
                </th>
                {roles.map((role) => (
                  <th
                    key={role.id}
                    scope="col"
                    className="min-w-28 border-b border-l border-slate-300 p-2 align-bottom font-semibold dark:border-slate-700"
                  >
                    <Link
                      to={`/roles/${role.id}`}
                      className="text-blue-800 underline dark:text-blue-300"
                    >
                      {role.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            {groups.map((group) => (
              <tbody key={group.category}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={roles.length + 1}
                    className="border-b border-slate-300 bg-slate-100 p-2 text-left font-semibold dark:border-slate-700 dark:bg-slate-800"
                  >
                    {CATEGORY_LABELS[group.category]}
                  </th>
                </tr>
                {group.metrics.map((metric) => (
                  <tr key={metric.id} className="border-b border-slate-200 dark:border-slate-800">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-white p-2 font-medium dark:bg-slate-950"
                    >
                      <Link
                        to={`/metrics/${metric.id}`}
                        className="text-blue-800 underline dark:text-blue-300"
                      >
                        {metric.name}
                      </Link>
                    </th>
                    {roles.map((role) => {
                      const summary = mandateSummary(metric, role.id, framework);
                      return (
                        <td
                          key={role.id}
                          className="border-l border-slate-200 p-2 align-top dark:border-slate-800"
                        >
                          {summary.varies ? (
                            <ul className="space-y-1">
                              {summary.perFramework.map((entry) => (
                                <li key={entry.framework}>
                                  <span className="block text-xs text-slate-700 dark:text-slate-300">
                                    {FRAMEWORK_LABELS[entry.framework]}
                                  </span>
                                  <MandateBadge mandate={entry.mandate} />
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <MandateBadge mandate={summary.mandate} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      )}
    </div>
  );
}
