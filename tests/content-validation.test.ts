import { describe, expect, it } from 'vitest';
import { unknownPlaceholders, validateContent } from '../src/lib/content-validation.ts';
import { assembleRegistry } from '../src/lib/registry.ts';
import { rawContent } from '../src/content/index.ts';
import { validMetric, validRaw } from './fixtures.ts';

function errorsFor(raw: ReturnType<typeof validRaw>): string[] {
  const result = validateContent(raw);
  return result.ok ? [] : result.errors;
}

describe('validateContent', () => {
  it('accepts a valid content set and joins mandates into metrics', () => {
    const result = validateContent(validRaw());
    expect(result.errors).toEqual([]);
    if (!result.ok) throw new Error('expected ok');
    const registry = assembleRegistry(result.content);
    expect(registry.metricById.get('example-metric')?.roles).toHaveLength(1);
  });

  it('accepts the real content in src/content', () => {
    expect(validateContent(rawContent).errors).toEqual([]);
  });

  it('fails on a missing required field', () => {
    const { misuseWarning: _omit, ...withoutMisuse } = validMetric();
    expect(errorsFor(validRaw(withoutMisuse)).join('\n')).toMatch(/misuseWarning/);
  });

  it('fails on an empty required string', () => {
    expect(errorsFor(validRaw(validMetric({ purpose: '   ' }))).join('\n')).toMatch(/purpose/);
  });

  it('fails when a metric has no source', () => {
    expect(errorsFor(validRaw(validMetric({ sources: [] }))).join('\n')).toMatch(
      /at least one source/,
    );
  });

  it('fails on a non-https source URL', () => {
    const metric = validMetric({
      sources: [{ title: 't', url: 'http://example.com', publisher: 'p', retrieved: '2026-11-16' }],
    });
    expect(errorsFor(validRaw(metric)).join('\n')).toMatch(/https/);
  });

  it('fails on an unknown role in mandates', () => {
    const raw = validRaw();
    raw.mandates.data = {
      'example-metric': [{ roleId: 'wizard', mandate: 'optional', rationale: 'x' }],
    };
    expect(errorsFor(raw).join('\n')).toMatch(/unknown role "wizard"/);
  });

  it('fails when a metric has no mandate entry', () => {
    const raw = validRaw();
    raw.mandates.data = {};
    expect(errorsFor(raw).join('\n')).toMatch(/no mandate entry for metric "example-metric"/);
  });

  it('fails on a mandate for an unknown metric', () => {
    const raw = validRaw();
    raw.mandates.data = { ...(raw.mandates.data as object), ghost: [] };
    expect(errorsFor(raw).join('\n')).toMatch(/"ghost" is not a known metric id/);
  });

  it('fails on a mandate framework the metric does not list', () => {
    const raw = validRaw();
    raw.mandates.data = {
      'example-metric': [
        { roleId: 'scrum-master', mandate: 'optional', rationale: 'x', framework: 'kanban' },
      ],
    };
    expect(errorsFor(raw).join('\n')).toMatch(/framework "kanban"/);
  });

  it('fails on an unknown placeholder', () => {
    const metric = validMetric({
      jql: [
        {
          edition: 'cloud',
          label: 'Bad',
          jql: 'project = {{PROJECT}}',
          verification: 'needs-verification',
        },
      ],
    });
    expect(errorsFor(validRaw(metric)).join('\n')).toMatch(/unknown placeholder \{\{PROJECT\}\}/);
  });

  it('fails when an external-tool metric has JQL', () => {
    const metric = validMetric({ calcMethod: 'external-tool', category: 'outside-jira' });
    expect(errorsFor(validRaw(metric)).join('\n')).toMatch(/must not have JQL/);
  });

  it('fails when a JQL-based metric has no JQL', () => {
    expect(errorsFor(validRaw(validMetric({ jql: [] }))).join('\n')).toMatch(
      /needs at least one JQL variant/,
    );
  });

  it('fails when the file name does not match the id', () => {
    expect(errorsFor(validRaw(validMetric({ id: 'other-id' }))).join('\n')).toMatch(
      /file name must match/,
    );
  });

  it('fails on duplicate metric ids', () => {
    const raw = validRaw();
    raw.metrics.push({ ...raw.metrics[0]!, file: 'src/content/metrics/x/example-metric.ts' });
    expect(errorsFor(raw).join('\n')).toMatch(/duplicate metric id/);
  });

  it('fails on unknown fields (catches typos)', () => {
    expect(errorsFor(validRaw({ ...validMetric(), purpouse: 'typo' })).join('\n')).toMatch(
      /purpouse/,
    );
  });

  it('fails on a bad ISO date', () => {
    expect(errorsFor(validRaw(validMetric({ lastReviewed: '16/11/2026' }))).join('\n')).toMatch(
      /lastReviewed/,
    );
  });
});

describe('unknownPlaceholders', () => {
  it('returns only names outside the allowed list', () => {
    expect(unknownPlaceholders('a = {{PROJECT_KEY}} and b = {{ FOO }} and {{LABEL}}')).toEqual([
      'FOO',
    ]);
  });
});
