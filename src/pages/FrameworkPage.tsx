import { Link, useParams } from 'react-router';
import PageHeader from '../components/PageHeader.tsx';
import MetricCard from '../components/MetricCard.tsx';
import { registry } from '../content/index.ts';
import { FRAMEWORKS, type Framework } from '../types/index.ts';
import { CATEGORY_LABELS, FRAMEWORK_LABELS } from '../lib/labels.ts';
import { metricsByCategory } from '../lib/browse.ts';
import NotFoundPage from './NotFoundPage.tsx';

const INTROS: Record<Framework, string> = {
  scrum: 'Metrics for teams that plan and deliver in fixed-length sprints.',
  kanban: 'Metrics for teams that manage a continuous flow of work with explicit WIP limits.',
  scrumban:
    'Metrics for hybrid teams that combine sprint cadences with flow practices. Most come from Scrum and Kanban; each metric page shows which roles should track it for Scrumban.',
  scaled:
    'Metrics for groups of teams working together, such as a SAFe Agile Release Train or a tribe.',
};

export default function FrameworkPage() {
  const { framework } = useParams();
  if (!framework || !(FRAMEWORKS as readonly string[]).includes(framework)) {
    return <NotFoundPage />;
  }
  const f = framework as Framework;
  const groups = metricsByCategory(registry.metrics, f);

  return (
    <>
      <PageHeader title={FRAMEWORK_LABELS[f]}>
        <p>{INTROS[f]}</p>
      </PageHeader>

      <nav aria-label="Frameworks" className="no-print mb-6 flex flex-wrap gap-2 text-sm">
        {FRAMEWORKS.map((other) => (
          <Link
            key={other}
            to={`/frameworks/${other}`}
            aria-current={other === f ? 'page' : undefined}
            className="rounded border border-slate-300 px-3 py-1 aria-[current=page]:border-blue-700 aria-[current=page]:bg-blue-50 aria-[current=page]:font-semibold dark:border-slate-700 dark:aria-[current=page]:border-blue-400 dark:aria-[current=page]:bg-blue-950"
          >
            {FRAMEWORK_LABELS[other]}
          </Link>
        ))}
      </nav>

      {groups.length === 0 ? (
        <p>No metrics for this framework yet.</p>
      ) : (
        groups.map((group) => (
          <section key={group.category} className="mb-8" aria-labelledby={`cat-${group.category}`}>
            <h2 id={`cat-${group.category}`} className="mb-3 text-xl font-semibold">
              {CATEGORY_LABELS[group.category]}
            </h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {group.metrics.map((metric) => (
                <li key={metric.id}>
                  <MetricCard metric={metric} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  );
}
