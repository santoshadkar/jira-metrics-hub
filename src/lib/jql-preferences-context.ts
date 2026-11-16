import { createContext, useContext } from 'react';
import type { PlaceholderValues } from './placeholders.ts';

/** Which JQL variants to show: both editions side by side, or one edition. */
export type EditionView = 'both' | 'datacenter' | 'cloud';

export interface JqlPreferences {
  values: PlaceholderValues;
  setValue: (name: keyof PlaceholderValues, value: string) => void;
  clearValues: () => void;
  editionView: EditionView;
  setEditionView: (view: EditionView) => void;
}

export const JqlPreferencesContext = createContext<JqlPreferences | null>(null);

export function useJqlPreferences(): JqlPreferences {
  const preferences = useContext(JqlPreferencesContext);
  if (!preferences) throw new Error('useJqlPreferences must be used inside JqlPreferencesProvider');
  return preferences;
}
