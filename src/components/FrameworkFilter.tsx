import { useId } from 'react';
import { FRAMEWORKS, type Framework } from '../types/index.ts';
import { FRAMEWORK_LABELS } from '../lib/labels.ts';

interface FrameworkFilterProps {
  value: Framework | undefined;
  onChange: (value: Framework | undefined) => void;
  /** Limit the choices, e.g. to the frameworks a role works in. */
  options?: readonly Framework[];
}

export default function FrameworkFilter({
  value,
  onChange,
  options = FRAMEWORKS,
}: FrameworkFilterProps) {
  const id = useId();
  return (
    <div className="no-print flex flex-wrap items-center gap-2 text-sm">
      <label htmlFor={id} className="font-semibold">
        Framework
      </label>
      <select
        id={id}
        value={value ?? ''}
        onChange={(event) => onChange((event.target.value || undefined) as Framework | undefined)}
        className="rounded border border-slate-400 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-950"
      >
        <option value="">All frameworks</option>
        {options.map((framework) => (
          <option key={framework} value={framework}>
            {FRAMEWORK_LABELS[framework]}
          </option>
        ))}
      </select>
    </div>
  );
}
