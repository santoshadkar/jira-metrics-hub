import { PLACEHOLDERS, type Placeholder } from '../types/index.ts';

export type PlaceholderValues = Partial<Record<Placeholder, string>>;

export interface JqlSegment {
  text: string;
  /** Set when this segment came from a placeholder. */
  placeholder?: string;
  /** True when the placeholder had a value and `text` is that value. */
  filled?: boolean;
}

const PATTERN = /\{\{\s*([A-Z_]+)\s*\}\}/g;
const KNOWN = new Set<string>(PLACEHOLDERS);

export const PLACEHOLDER_HELP: Record<Placeholder, { label: string; example: string }> = {
  PROJECT_KEY: { label: 'Project key', example: 'ABC' },
  TEAM: { label: 'Team', example: 'Team Phoenix' },
  BOARD_NAME: { label: 'Board name', example: 'ABC board' },
  SPRINT_NAME: { label: 'Sprint name', example: 'ABC Sprint 42' },
  EPIC_KEY: { label: 'Epic key', example: 'ABC-123' },
  ISSUE_TYPES: { label: 'Issue types (comma-separated)', example: 'Story, Bug' },
  START_DATE: { label: 'Start date', example: '2026-01-01' },
  END_DATE: { label: 'End date', example: '2026-03-31' },
  LABEL: { label: 'Label', example: 'PI-2026-1' },
};

/** Placeholder names used in a JQL string, in order of first appearance, without duplicates. */
export function placeholdersIn(jql: string): Placeholder[] {
  const found: Placeholder[] = [];
  for (const match of jql.matchAll(PATTERN)) {
    const name = match[1] ?? '';
    if (KNOWN.has(name) && !found.includes(name as Placeholder)) found.push(name as Placeholder);
  }
  return found;
}

/** Splits JQL into plain text and placeholder segments, substituting filled values. */
export function segmentJql(jql: string, values: PlaceholderValues): JqlSegment[] {
  const segments: JqlSegment[] = [];
  let last = 0;
  for (const match of jql.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) segments.push({ text: jql.slice(last, index) });
    const name = match[1] ?? '';
    const value = KNOWN.has(name) ? values[name as Placeholder]?.trim() : undefined;
    segments.push(
      value
        ? { text: value, placeholder: name, filled: true }
        : { text: match[0], placeholder: name, filled: false },
    );
    last = index + match[0].length;
  }
  if (last < jql.length) segments.push({ text: jql.slice(last) });
  return segments;
}

/** Returns the JQL with filled placeholders substituted. Unfilled ones stay as {{NAME}}. */
export function substitutePlaceholders(jql: string, values: PlaceholderValues): string {
  return segmentJql(jql, values)
    .map((segment) => segment.text)
    .join('');
}
