import Fuse, { type FuseResultMatch } from 'fuse.js';
import type { Metric } from '../types/index.ts';

export type MatchField = 'name' | 'purpose' | 'jql';

export interface SearchHit {
  metric: Metric;
  /** Which fields matched, so the results can say why a metric was found. */
  matchedIn: MatchField[];
  /** Lower is better (Fuse score). */
  score: number;
}

const FIELD_BY_KEY: Record<string, MatchField> = {
  name: 'name',
  purpose: 'purpose',
  'jql.jql': 'jql',
};

/** Builds a client-side fuzzy index over metric names, purposes and JQL text. */
export function createMetricSearch(metrics: Metric[]) {
  const fuse = new Fuse(metrics, {
    keys: [
      { name: 'name', weight: 3 },
      { name: 'purpose', weight: 2 },
      { name: 'jql.jql', weight: 1 },
    ],
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true,
    threshold: 0.35,
    minMatchCharLength: 2,
  });

  return (query: string): SearchHit[] => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];
    return fuse.search(trimmed).map((result) => ({
      metric: result.item,
      score: result.score ?? 1,
      matchedIn: matchedFields(result.matches ?? []),
    }));
  };
}

function matchedFields(matches: readonly FuseResultMatch[]): MatchField[] {
  const fields = new Set<MatchField>();
  for (const match of matches) {
    const field = match.key ? FIELD_BY_KEY[match.key] : undefined;
    if (field) fields.add(field);
  }
  return (['name', 'purpose', 'jql'] as const).filter((f) => fields.has(f));
}
