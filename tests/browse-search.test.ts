import { describe, expect, it } from 'vitest';
import { CATEGORIES } from '../src/types/index.ts';
import { registry } from '../src/content/index.ts';
import { metricsByCategory, metricsForRole } from '../src/lib/browse.ts';
import { mandateSummary } from '../src/lib/mandates.ts';
import { createMetricSearch } from '../src/lib/search.ts';

const velocity = registry.metricById.get('velocity')!;
const ids = (items: { metric: { id: string } }[]) => items.map((i) => i.metric.id);

describe('mandateSummary', () => {
  it('uses the strongest level and flags variation across frameworks', () => {
    const summary = mandateSummary(velocity, 'scrum-master');
    expect(summary.mandate).toBe('mandatory');
    expect(summary.varies).toBe(true);
    expect(summary.perFramework).toEqual([
      expect.objectContaining({ framework: 'scrum', mandate: 'mandatory' }),
      expect.objectContaining({ framework: 'scrumban', mandate: 'optional' }),
    ]);
  });

  it('uses only the filtered framework', () => {
    const summary = mandateSummary(velocity, 'scrum-master', 'scrumban');
    expect(summary.mandate).toBe('optional');
    expect(summary.varies).toBe(false);
  });

  it('treats a metric outside the filtered framework as not applicable', () => {
    expect(mandateSummary(velocity, 'scrum-master', 'kanban').mandate).toBe('not-applicable');
  });
});

describe('metricsForRole', () => {
  it('groups by strongest level across frameworks', () => {
    const groups = metricsForRole(registry.metrics, 'scrum-master');
    expect(ids(groups.mandatory)).toContain('velocity');
    expect(ids(groups.recommended)).toEqual(expect.arrayContaining(['cycle-time', 'aging-wip']));
  });

  it('respects the framework filter and drops metrics outside it', () => {
    const groups = metricsForRole(registry.metrics, 'scrum-master', 'scrumban');
    expect(ids(groups.optional)).toContain('velocity');
    const all = Object.values(groups).flatMap(ids);
    expect(all).not.toContain('pi-predictability');
  });

  it('puts roles with no entry under not-applicable', () => {
    const groups = metricsForRole(registry.metrics, 'rte');
    expect(ids(groups.mandatory)).toContain('pi-predictability');
    expect(ids(groups['not-applicable'])).toContain('velocity');
  });
});

describe('metricsByCategory', () => {
  it('groups by category in the fixed order and filters by framework', () => {
    const all = metricsByCategory(registry.metrics).map((g) => g.category);
    // Same relative order as CATEGORIES, no duplicates, no empty groups.
    expect(all).toEqual(CATEGORIES.filter((c) => all.includes(c)));
    for (const group of metricsByCategory(registry.metrics)) {
      expect(group.metrics.length).toBeGreaterThan(0);
    }
    const kanban = metricsByCategory(registry.metrics, 'kanban');
    expect(kanban.flatMap((g) => g.metrics).every((m) => m.framework.includes('kanban'))).toBe(
      true,
    );
    expect(kanban.flatMap((g) => g.metrics).map((m) => m.id)).not.toContain('pi-predictability');
  });
});

describe('metric search', () => {
  const search = createMetricSearch(registry.metrics);

  it('finds by name, tolerating a typo', () => {
    expect(search('velocty')[0]?.metric.id).toBe('velocity');
  });

  it('finds by JQL text and reports where it matched', () => {
    const hit = search('closedSprints').find((h) => h.metric.id === 'velocity');
    expect(hit?.matchedIn).toContain('jql');
  });

  it('finds by purpose text', () => {
    expect(search('business value').map((h) => h.metric.id)).toContain('pi-predictability');
  });

  it('ignores queries shorter than two characters', () => {
    expect(search('v')).toEqual([]);
  });
});
