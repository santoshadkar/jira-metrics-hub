import { useId } from 'react';
import type { Placeholder } from '../types/index.ts';
import { PLACEHOLDER_HELP } from '../lib/placeholders.ts';
import { useJqlPreferences } from '../lib/jql-preferences-context.ts';

/**
 * Inputs for the placeholders used on the current page. Values update every
 * JQL block live and stay in memory only.
 */
export default function ParamPanel({ placeholders }: { placeholders: Placeholder[] }) {
  const { values, setValue, clearValues } = useJqlPreferences();
  const idPrefix = useId();

  if (placeholders.length === 0) return null;

  return (
    <section
      aria-labelledby={`${idPrefix}-heading`}
      className="no-print rounded border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id={`${idPrefix}-heading`} className="font-semibold">
          Fill in your values
        </h3>
        <button
          type="button"
          onClick={clearValues}
          className="rounded border border-slate-300 px-2 py-1 text-sm hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Clear values
        </button>
      </div>
      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
        Every query below updates as you type. Anything you leave empty stays as a{' '}
        <code className="font-mono">{'{{PLACEHOLDER}}'}</code>. Values stay in this browser tab only
        and are never sent anywhere.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {placeholders.map((name) => {
          const inputId = `${idPrefix}-${name}`;
          const help = PLACEHOLDER_HELP[name];
          return (
            <div key={name}>
              <label htmlFor={inputId} className="block text-sm font-medium">
                {help.label}{' '}
                <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                  {`{{${name}}}`}
                </span>
              </label>
              <input
                id={inputId}
                type="text"
                value={values[name] ?? ''}
                placeholder={`e.g. ${help.example}`}
                onChange={(event) => setValue(name, event.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="mt-1 w-full rounded border border-slate-400 bg-white px-2 py-1 font-mono text-sm placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-950 dark:placeholder:text-slate-400"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
