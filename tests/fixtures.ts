import type { MetricContent, Role } from '../src/types/index.ts';
import type { RawContent } from '../src/lib/registry.ts';

export function validMetric(overrides: Partial<MetricContent> = {}): MetricContent {
  return {
    id: 'example-metric',
    name: 'Example metric',
    framework: ['scrum'],
    category: 'scrum-delivery',
    purpose: 'Test purpose.',
    howToRead: 'Test reading guidance.',
    formula: 'Count of issues.',
    calcMethod: 'jql-count',
    cadence: 'every sprint',
    misuseWarning: 'Test misuse warning.',
    jql: [
      {
        edition: 'both',
        label: 'Example',
        jql: 'project = {{PROJECT_KEY}} AND sprint in openSprints()',
        verification: 'needs-verification',
      },
    ],
    prerequisites: [],
    sources: [
      {
        title: 'Example source',
        url: 'https://example.com/doc',
        publisher: 'Example',
        retrieved: '2026-11-16',
      },
    ],
    verification: 'needs-verification',
    lastReviewed: '2026-11-16',
    ...overrides,
  };
}

export const validRole: Role = {
  id: 'scrum-master',
  name: 'Scrum Master',
  description: 'Test role.',
  framework: ['scrum'],
};

/** A small, fully valid content set. Tests break one thing at a time. */
export function validRaw(metric: unknown = validMetric()): RawContent {
  return {
    metrics: [{ file: 'src/content/metrics/scrum-delivery/example-metric.ts', data: metric }],
    dashboards: [],
    roles: { file: 'src/content/roles.ts', data: [validRole] },
    mandates: {
      file: 'src/content/mandates.ts',
      data: {
        'example-metric': [
          { roleId: 'scrum-master', mandate: 'mandatory', rationale: 'Test rationale.' },
        ],
      },
    },
    editionDifferences: { file: 'src/content/edition-differences.ts', data: [] },
  };
}
