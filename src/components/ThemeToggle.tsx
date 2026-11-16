import { useEffect, useState } from 'react';
import { applyTheme, readThemeChoice, saveThemeChoice, type ThemeChoice } from '../lib/theme.ts';

const OPTIONS: { value: ThemeChoice; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export default function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>(readThemeChoice);

  useEffect(() => {
    applyTheme(choice);
    if (choice !== 'system' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [choice]);

  // Always print in light mode, whatever the screen theme.
  useEffect(() => {
    const toLight = () => document.documentElement.classList.remove('dark');
    const restore = () => applyTheme(choice);
    window.addEventListener('beforeprint', toLight);
    window.addEventListener('afterprint', restore);
    return () => {
      window.removeEventListener('beforeprint', toLight);
      window.removeEventListener('afterprint', restore);
    };
  }, [choice]);

  return (
    <fieldset className="flex items-center gap-1 text-sm">
      <legend className="sr-only">Colour theme</legend>
      {OPTIONS.map((option) => (
        <label
          key={option.value}
          className="cursor-pointer rounded px-2 py-1 has-[:checked]:bg-slate-200 has-[:checked]:font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-600 dark:has-[:checked]:bg-slate-700"
        >
          <input
            type="radio"
            name="theme"
            value={option.value}
            checked={choice === option.value}
            onChange={() => {
              setChoice(option.value);
              saveThemeChoice(option.value);
            }}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
