import { useState } from 'react';
import type { JqlVariant } from '../types/index.ts';
import { segmentJql, substitutePlaceholders } from '../lib/placeholders.ts';
import { useJqlPreferences } from '../lib/jql-preferences-context.ts';
import { EditionBadge, RequiresAppBadge, VerificationBadge } from './Badges.tsx';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers or contexts without the async clipboard API.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand?.('copy') ?? false;
    area.remove();
    return ok;
  }
}

export default function JqlBlock({ variant }: { variant: JqlVariant }) {
  const { values } = useJqlPreferences();
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const segments = segmentJql(variant.jql, values);
  const unfilled = segments.filter((s) => s.placeholder && !s.filled).length;

  const onCopy = async () => {
    const ok = await copyText(substitutePlaceholders(variant.jql, values));
    setStatus(ok ? 'copied' : 'failed');
    window.setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <figure className="flex h-full flex-col rounded border border-slate-200 dark:border-slate-800">
      <figcaption className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <span className="mr-auto font-medium">{variant.label}</span>
        <EditionBadge edition={variant.edition} />
        <VerificationBadge status={variant.verification} />
        {variant.requiresApp && <RequiresAppBadge app={variant.requiresApp} />}
      </figcaption>
      <div className="relative flex-1">
        <pre className="overflow-x-auto bg-slate-50 p-3 pr-20 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words dark:bg-slate-900">
          <code>
            {segments.map((segment, i) =>
              segment.placeholder ? (
                <mark
                  key={i}
                  className={
                    segment.filled
                      ? 'rounded bg-emerald-100 px-0.5 text-emerald-950 dark:bg-emerald-900 dark:text-emerald-50'
                      : 'rounded bg-amber-100 px-0.5 text-amber-950 dark:bg-amber-900 dark:text-amber-50'
                  }
                  title={segment.filled ? `${segment.placeholder} (filled)` : 'Not filled in yet'}
                >
                  {segment.text}
                </mark>
              ) : (
                <span key={i}>{segment.text}</span>
              ),
            )}
          </code>
        </pre>
        <button
          type="button"
          onClick={onCopy}
          className="no-print absolute top-2 right-2 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
          aria-label={`Copy query: ${variant.label}`}
        >
          {status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Copy'}
        </button>
        <span className="sr-only" role="status" aria-live="polite">
          {status === 'copied'
            ? 'Query copied to clipboard'
            : status === 'failed'
              ? 'Copy failed'
              : ''}
        </span>
      </div>
      {(variant.notes || unfilled > 0) && (
        <div className="space-y-1 border-t border-slate-200 px-3 py-2 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-300">
          {unfilled > 0 && (
            <p>
              {unfilled} placeholder{unfilled === 1 ? '' : 's'} still to fill in.
            </p>
          )}
          {variant.notes && <p>{variant.notes}</p>}
        </div>
      )}
    </figure>
  );
}
