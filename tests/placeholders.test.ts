import { describe, expect, it } from 'vitest';
import { placeholdersIn, segmentJql, substitutePlaceholders } from '../src/lib/placeholders.ts';
import { groupVariants } from '../src/lib/jql-groups.ts';
import { effectiveMandate, mandateRows } from '../src/lib/mandates.ts';
import { registry } from '../src/content/index.ts';

const JQL =
  'project = {{PROJECT_KEY}} AND sprint = "{{SPRINT_NAME}}" AND project = {{PROJECT_KEY}}';

describe('placeholders', () => {
  it('lists each placeholder once, in order', () => {
    expect(placeholdersIn(JQL)).toEqual(['PROJECT_KEY', 'SPRINT_NAME']);
  });

  it('substitutes filled values and keeps unfilled placeholders visible', () => {
    expect(substitutePlaceholders(JQL, { PROJECT_KEY: 'ABC' })).toBe(
      'project = ABC AND sprint = "{{SPRINT_NAME}}" AND project = ABC',
    );
  });

  it('treats whitespace-only values as unfilled', () => {
    expect(substitutePlaceholders('x = {{LABEL}}', { LABEL: '   ' })).toBe('x = {{LABEL}}');
  });

  it('marks segments as filled or unfilled', () => {
    const segments = segmentJql('a {{LABEL}} b {{TEAM}}', { LABEL: 'pi-1' });
    expect(segments).toEqual([
      { text: 'a ' },
      { text: 'pi-1', placeholder: 'LABEL', filled: true },
      { text: ' b ' },
      { text: '{{TEAM}}', placeholder: 'TEAM', filled: false },
    ]);
  });
});

describe('groupVariants', () => {
  it('pairs Data Center and Cloud variants that share a label', () => {
    const groups = groupVariants([
      { edition: 'datacenter', label: 'A', jql: 'x', verification: 'verified' },
      { edition: 'cloud', label: 'A', jql: 'y', verification: 'verified' },
      { edition: 'both', label: 'B', jql: 'z', verification: 'verified' },
    ]);
    expect(groups).toHaveLength(2);
    expect(groups[0]?.datacenter?.jql).toBe('x');
    expect(groups[0]?.cloud?.jql).toBe('y');
    expect(groups[1]?.both?.jql).toBe('z');
  });
});

describe('mandates', () => {
  const velocity = registry.metricById.get('velocity')!;

  it('uses a framework-specific mandate over the general one', () => {
    expect(effectiveMandate(velocity, 'scrum-master', 'scrum').mandate).toBe('mandatory');
    expect(effectiveMandate(velocity, 'scrum-master', 'scrumban').mandate).toBe('optional');
  });

  it('falls back to the general mandate, then to not-applicable', () => {
    expect(effectiveMandate(velocity, 'team-member', 'scrum').mandate).toBe('recommended');
    expect(effectiveMandate(velocity, 'rte').mandate).toBe('not-applicable');
  });

  it('lists only roles that have an entry', () => {
    const ids = mandateRows(velocity, registry.roles).map((row) => row.role.id);
    expect(ids).toContain('scrum-master');
    expect(ids).not.toContain('rte');
  });
});

describe('seeded content', () => {
  it('has the 11 roles from the brief', () => {
    expect(registry.roles).toHaveLength(11);
  });

  it('has one example metric per framework', () => {
    for (const framework of ['scrum', 'kanban', 'scrumban', 'scaled'] as const) {
      expect(registry.metrics.some((m) => m.framework.includes(framework))).toBe(true);
    }
  });

  it('never claims JQL produces a number for metrics that are not jql-count', () => {
    for (const metric of registry.metrics) {
      if (metric.calcMethod === 'jql-count') continue;
      for (const variant of metric.jql) {
        expect(variant.label.toLowerCase()).not.toMatch(/^(the )?\w+ (query|number)$/);
      }
    }
  });
});
