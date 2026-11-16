import type { ReactNode } from 'react';
import type { CalcMethod, JiraEdition, Mandate, Verification } from '../types/index.ts';
import { CALC_METHOD_LABELS, MANDATE_LABELS, VERIFICATION_LABELS } from '../lib/labels.ts';

const BASE = 'inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold whitespace-nowrap';

function Badge({ className, children }: { className: string; children: ReactNode }) {
  return <span className={`${BASE} ${className}`}>{children}</span>;
}

const NEUTRAL = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100';

export function VerificationBadge({ status }: { status: Verification }) {
  return (
    <Badge
      className={
        status === 'verified'
          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
          : 'bg-amber-100 text-amber-900 ring-1 ring-amber-400 dark:bg-amber-950 dark:text-amber-200'
      }
    >
      {status === 'needs-verification' && <span aria-hidden="true">⚠&nbsp;</span>}
      {VERIFICATION_LABELS[status]}
    </Badge>
  );
}

export function CalcMethodBadge({ method }: { method: CalcMethod }) {
  return (
    <Badge className="bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200">
      {CALC_METHOD_LABELS[method]}
    </Badge>
  );
}

const MANDATE_CLASSES: Record<Mandate, string> = {
  mandatory: 'bg-blue-700 text-white dark:bg-blue-500 dark:text-slate-950',
  recommended: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200',
  optional: NEUTRAL,
  'not-applicable':
    'bg-white text-slate-600 ring-1 ring-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700',
};

export function MandateBadge({ mandate }: { mandate: Mandate }) {
  return <Badge className={MANDATE_CLASSES[mandate]}>{MANDATE_LABELS[mandate]}</Badge>;
}

export function ProposedBaselineBadge() {
  return (
    <Badge className="bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200">
      Proposed baseline
    </Badge>
  );
}

export function RequiresAppBadge({ app }: { app: string }) {
  return (
    <Badge className="bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200">
      Requires app: {app}
    </Badge>
  );
}

const EDITION_LABELS: Record<JiraEdition | 'both', string> = {
  datacenter: 'Data Center',
  cloud: 'Cloud',
  both: 'Data Center and Cloud',
};

export function EditionBadge({ edition }: { edition: JiraEdition | 'both' }) {
  return <Badge className={NEUTRAL}>{EDITION_LABELS[edition]}</Badge>;
}
