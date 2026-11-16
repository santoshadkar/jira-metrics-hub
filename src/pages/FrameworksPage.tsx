import { Link } from 'react-router';
import PageHeader from '../components/PageHeader.tsx';
import { FRAMEWORKS } from '../types/index.ts';
import { FRAMEWORK_LABELS } from '../lib/labels.ts';

export default function FrameworksPage() {
  return (
    <>
      <PageHeader title="By framework">
        <p>Pick a framework to see its metrics grouped by category.</p>
      </PageHeader>
      <ul className="grid gap-3 sm:grid-cols-2">
        {FRAMEWORKS.map((framework) => (
          <li key={framework}>
            <Link
              to={`/frameworks/${framework}`}
              className="block rounded border border-slate-200 p-4 font-semibold hover:border-blue-500 dark:border-slate-800"
            >
              {FRAMEWORK_LABELS[framework]}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
