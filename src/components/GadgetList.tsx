import type { GadgetGuide } from '../types/index.ts';
import { VerificationBadge } from './Badges.tsx';

/** Ordered gadget guides for one edition. */
export default function GadgetList({ gadgets }: { gadgets: GadgetGuide[] }) {
  if (gadgets.length === 0) {
    return (
      <p className="text-sm text-slate-700 dark:text-slate-300">No gadgets for this edition.</p>
    );
  }
  return (
    <ol className="space-y-3">
      {gadgets.map((gadget, i) => (
        <li
          key={`${gadget.gadgetName}-${i}`}
          className="break-inside-avoid rounded border border-slate-200 p-3 dark:border-slate-800"
        >
          <p className="flex flex-wrap items-center gap-2 font-medium">
            <span className="text-slate-600 dark:text-slate-400">{i + 1}.</span>
            {gadget.gadgetName}
            <VerificationBadge status={gadget.verification} />
          </p>
          <ol className="mt-2 list-[lower-alpha] space-y-1 pl-6 text-sm">
            {gadget.configuration.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {gadget.verification === 'needs-verification' && (
            <p className="mt-2 text-sm text-amber-900 dark:text-amber-200">
              The gadget exists in this edition&rsquo;s official list, but these configuration steps
              are not fully described in the documentation. Check them in your Jira before relying
              on them.
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
