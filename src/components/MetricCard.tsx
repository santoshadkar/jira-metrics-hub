import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { Metric } from '../types/index.ts';
import { CalcMethodBadge, VerificationBadge } from './Badges.tsx';

interface MetricCardProps {
  metric: Metric;
  /** Extra line under the purpose, e.g. a mandate summary or search match info. */
  children?: ReactNode;
}

export default function MetricCard({ metric, children }: MetricCardProps) {
  return (
    <article className="flex h-full flex-col rounded border border-slate-200 p-4 dark:border-slate-800">
      <h3 className="font-semibold">
        <Link
          to={`/metrics/${metric.id}`}
          className="text-blue-800 underline-offset-2 hover:underline dark:text-blue-300"
        >
          {metric.name}
        </Link>
      </h3>
      <p className="mt-1 flex-1 text-sm text-slate-700 dark:text-slate-300">{metric.purpose}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <CalcMethodBadge method={metric.calcMethod} />
        {metric.verification === 'needs-verification' && (
          <VerificationBadge status={metric.verification} />
        )}
      </div>
      {children && <div className="mt-3 text-sm">{children}</div>}
    </article>
  );
}
