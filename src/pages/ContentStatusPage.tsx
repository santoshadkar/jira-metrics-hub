import { Link } from 'react-router';
import PageHeader from '../components/PageHeader.tsx';
import { registry } from '../content/index.ts';
import { collectNeedsVerification } from '../lib/content-status.ts';

const groups = collectNeedsVerification(registry);

export default function ContentStatusPage() {
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <PageHeader title="Content status">
        <p>
          Every item still marked &ldquo;Needs verification&rdquo;, grouped by type. Each one could
          not be fully confirmed from an official source. To clear an item: confirm it against the
          documentation (or in your own Jira), update the content file, add the source, and set{' '}
          <code>verification: &apos;verified&apos;</code>.
        </p>
      </PageHeader>

      <p className="mb-6 font-semibold" role="status">
        {total} item{total === 1 ? '' : 's'} need verification.
      </p>

      <nav aria-label="Groups on this page" className="no-print mb-8">
        <ul className="flex flex-wrap gap-2 text-sm">
          {groups.map((group) => (
            <li key={group.id}>
              <span className="inline-block rounded border border-slate-300 px-2 py-1 dark:border-slate-700">
                {group.title}: {group.items.length}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group.id} aria-labelledby={`status-${group.id}`}>
            <h2 id={`status-${group.id}`} className="mb-3 text-xl font-semibold">
              {group.title} ({group.items.length})
            </h2>
            {group.items.length === 0 ? (
              <p className="text-sm text-slate-700 dark:text-slate-300">Nothing to verify.</p>
            ) : (
              <ul className="space-y-3">
                {group.items.map((item, i) => (
                  <li
                    key={`${item.title}-${i}`}
                    className="rounded border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950"
                  >
                    <Link
                      to={item.link}
                      className="font-medium text-blue-800 underline dark:text-blue-300"
                    >
                      {item.title}
                    </Link>
                    {item.detail && (
                      <p className="mt-1 font-mono text-xs break-words text-slate-800 dark:text-slate-200">
                        {item.detail}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
