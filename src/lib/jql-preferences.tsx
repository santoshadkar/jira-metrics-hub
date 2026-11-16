import { useMemo, useState, type ReactNode } from 'react';
import type { PlaceholderValues } from './placeholders.ts';
import {
  JqlPreferencesContext,
  type EditionView,
  type JqlPreferences,
} from './jql-preferences-context.ts';

/**
 * Holds the parameter-panel values and the edition toggle for the whole app.
 * Kept in memory only: nothing is stored or sent anywhere, and a page reload
 * clears it.
 */
export function JqlPreferencesProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<PlaceholderValues>({});
  const [editionView, setEditionView] = useState<EditionView>('both');

  const preferences = useMemo<JqlPreferences>(
    () => ({
      values,
      setValue: (name, value) => setValues((current) => ({ ...current, [name]: value })),
      clearValues: () => setValues({}),
      editionView,
      setEditionView,
    }),
    [values, editionView],
  );

  return (
    <JqlPreferencesContext.Provider value={preferences}>{children}</JqlPreferencesContext.Provider>
  );
}
