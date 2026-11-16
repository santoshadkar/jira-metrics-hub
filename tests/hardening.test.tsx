import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import App from '../src/App.tsx';
import { registry } from '../src/content/index.ts';
import { lintJql } from '../src/lib/jql-lint.ts';
import { csvField, matrixCsv, roleJqlText } from '../src/lib/export.ts';
import { collectNeedsVerification } from '../src/lib/content-status.ts';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

afterEach(() => vi.restoreAllMocks());

describe('lintJql', () => {
  const messages = (jql: string) => lintJql(jql).map((i) => i.message);

  it('accepts well-formed queries, including brackets and quotes inside strings', () => {
    expect(messages('project = {{PROJECT_KEY}} AND sprint in openSprints()')).toEqual([]);
    expect(messages('summary ~ "a (b" AND labels = "it\'s"')).toEqual([]);
    expect(
      messages('issueFunction in linkedIssuesOf("project != {{PROJECT_KEY}}", "blocks")'),
    ).toEqual([]);
  });

  it('flags empty queries', () => {
    expect(messages('   ')).toEqual(['empty query']);
  });

  it('flags unbalanced quotes and parentheses', () => {
    expect(messages('labels = "abc')).toEqual([expect.stringMatching(/unclosed " quote/)]);
    expect(messages('status in (A, B')).toEqual(['1 unclosed "("']);
    expect(messages('status = A)')).toEqual([expect.stringMatching(/unmatched "\)"/)]);
  });

  it('flags unknown and malformed placeholders', () => {
    expect(messages('project = {{PROJECT}}')).toEqual(['unknown placeholder {{PROJECT}}']);
    expect(messages('project = {{PROJECT_KEY}')).toEqual([
      expect.stringMatching(/malformed placeholder/),
    ]);
  });

  it('passes on every query in the portal', () => {
    const all = [
      ...registry.metrics.flatMap((m) => m.jql),
      ...registry.dashboards.flatMap((d) => d.filters.flatMap((f) => f.jql)),
    ];
    expect(all.length).toBeGreaterThan(100);
    for (const v of all) expect(lintJql(v.jql), v.jql).toEqual([]);
  });
});

describe('exports', () => {
  it('escapes CSV fields', () => {
    expect(csvField('plain')).toBe('plain');
    expect(csvField('a, b')).toBe('"a, b"');
    expect(csvField('say "hi"')).toBe('"say ""hi"""');
  });

  it('builds the mandate matrix CSV with a proposed-baseline header and per-framework detail', () => {
    const csv = matrixCsv(registry.metrics, registry.roles);
    const lines = csv.replace('﻿', '').trim().split('\r\n');
    expect(lines).toHaveLength(registry.metrics.length + 1);
    expect(lines[0]).toMatch(/^Metric \(proposed baseline mandate levels\),Category,Frameworks,/);
    const velocity = lines.find((l) => l.startsWith('Velocity,'));
    expect(velocity).toMatch(/Mandatory \(Scrum\); Optional \(Scrumban\)/);
  });

  it('builds role JQL text for one edition with filled values and flags', () => {
    const role = registry.roleById.get('scrum-master')!;
    const text = roleJqlText({
      metrics: registry.metrics,
      role,
      edition: 'cloud',
      values: { PROJECT_KEY: 'ABC' },
      generatedOn: '2026-11-16',
    });
    expect(text).toMatch(/JQL for Scrum Master — Jira Cloud/);
    expect(text).toMatch(/PROPOSED BASELINE/);
    expect(text).toMatch(/project = ABC AND sprint in closedSprints\(\)/);
    expect(text).toMatch(/REQUIRES ScriptRunner for Jira/);
    // Cloud queries must not use Data Center-only syntax (notes may mention it).
    const queries = text
      .split('\r\n')
      .filter((line) => line.startsWith('  ') && !line.startsWith('  Note:'));
    expect(queries.length).toBeGreaterThan(5);
    for (const q of queries) {
      expect(q).not.toMatch(/standardIssueTypes\(\)|issueLinkType =|"epic link"/);
    }
  });

  it('downloads the CSV from the matrix page without any network request', async () => {
    const create = vi.fn(() => 'blob:mock');
    const revoke = vi.fn();
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke }));
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    renderAt('/matrix');
    await userEvent.click(screen.getByRole('button', { name: 'Download CSV' }));
    expect(create).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('offers a JQL download on role pages', () => {
    renderAt('/roles/product-owner');
    expect(screen.getByLabelText('Download all JQL for')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download .txt' })).toBeInTheDocument();
  });
});

describe('content status', () => {
  it('collects needs-verification items grouped by type', () => {
    const groups = collectNeedsVerification(registry);
    expect(groups.map((g) => g.id)).toEqual([
      'metrics',
      'metric-jql',
      'metric-gadgets',
      'dashboards',
      'dashboard-jql',
      'dashboard-gadgets',
      'edition-differences',
    ]);
    const metrics = groups.find((g) => g.id === 'metrics')!;
    expect(metrics.items.map((i) => i.title)).toContain(
      'PI predictability (ART predictability measure)',
    );
  });

  it('shows every group and links to the items', () => {
    renderAt('/content-status');
    expect(screen.getByRole('status')).toHaveTextContent(/\d+ items? need verification/);
    const section = screen
      .getByRole('heading', { name: /^Metrics \(/ })
      .closest('section') as HTMLElement;
    expect(within(section).getByRole('link', { name: /Sprint predictability/ })).toHaveAttribute(
      'href',
      '/metrics/sprint-predictability',
    );
  });
});
