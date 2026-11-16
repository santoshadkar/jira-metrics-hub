import { useId } from 'react';
import { useJqlPreferences, type EditionView } from '../lib/jql-preferences-context.ts';

const OPTIONS: { value: EditionView; label: string }[] = [
  { value: 'both', label: 'Side by side' },
  { value: 'datacenter', label: 'Data Center only' },
  { value: 'cloud', label: 'Cloud only' },
];

export default function EditionToggle() {
  const { editionView, setEditionView } = useJqlPreferences();
  const name = useId();

  return (
    <fieldset className="no-print flex flex-wrap items-center gap-2 text-sm">
      <legend className="mb-1 w-full font-semibold">Jira edition</legend>
      {OPTIONS.map((option) => (
        <label
          key={option.value}
          className="cursor-pointer rounded border border-slate-300 px-3 py-1 has-[:checked]:border-blue-700 has-[:checked]:bg-blue-50 has-[:checked]:font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-600 dark:border-slate-700 dark:has-[:checked]:border-blue-400 dark:has-[:checked]:bg-blue-950"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={editionView === option.value}
            onChange={() => setEditionView(option.value)}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
