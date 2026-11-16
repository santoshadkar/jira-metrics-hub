import { FRAMEWORK_LABELS, MANDATE_LABELS } from '../lib/labels.ts';
import type { MandateSummary } from '../lib/mandates.ts';
import { MandateBadge } from './Badges.tsx';

/**
 * Shows a role's mandate for a metric. When the level differs by framework,
 * the breakdown is written out in text (never hover-only).
 */
export default function MandateSummaryText({ summary }: { summary: MandateSummary }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      <MandateBadge mandate={summary.mandate} />
      {summary.varies && (
        <span className="text-xs text-slate-700 dark:text-slate-300">
          {summary.perFramework
            .map(
              (entry) =>
                `${MANDATE_LABELS[entry.mandate]} for ${FRAMEWORK_LABELS[entry.framework]}`,
            )
            .join(' · ')}
        </span>
      )}
    </span>
  );
}
