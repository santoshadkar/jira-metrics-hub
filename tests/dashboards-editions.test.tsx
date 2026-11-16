import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import App from '../src/App.tsx';
import { registry } from '../src/content/index.ts';
import { validateContent } from '../src/lib/content-validation.ts';
import type { DashboardGuide } from '../src/types/index.ts';
import { validRaw } from './fixtures.ts';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

const DC_GADGETS = new Set([
  'Filter Results',
  'Pie Chart',
  'Issue Statistics',
  'Two Dimensional Filter Statistics',
  'Created vs. Resolved Chart',
  'Average Age Chart',
  'Resolution Time',
  'Time Since Chart',
  'Sprint Burndown Gadget',
  'Sprint Health Gadget',
  'Days Remaining in Sprint Gadget',
  'Jira Road Map',
  'Version Report',
  'Average Time in Status',
]);
const CLOUD_GADGETS = new Set([
  'Filter Results Gadget',
  'Pie Chart Gadget',
  'Work item Statistics Gadget',
  'Two Dimensional Filter Statistics Gadget',
  'Created vs Resolved Gadget',
  'Average Age Gadget',
  'Resolution Time Gadget',
  'Time Since Work items Gadget',
  'Sprint Burndown Gadget',
  'Sprint Health Gadget',
  'Days Remaining in Sprint Gadget',
  'Road Map Gadget',
  'Average Time in Status',
]);

describe('dashboard content', () => {
  it('has the 12 agreed guides', () => {
    expect(registry.dashboards).toHaveLength(12);
  });

  it('only names gadgets from each edition’s official list', () => {
    for (const d of registry.dashboards) {
      for (const gadget of d.gadgets.datacenter) expect(DC_GADGETS).toContain(gadget.gadgetName);
      for (const gadget of d.gadgets.cloud) expect(CLOUD_GADGETS).toContain(gadget.gadgetName);
    }
  });

  it('never puts a Data Center-only gadget in a Cloud guide', () => {
    for (const d of registry.dashboards) {
      const names = d.gadgets.cloud.map((g) => g.gadgetName);
      expect(names).not.toContain('Version Report');
    }
  });

  it('only refers to saved filters the guide defines', () => {
    for (const d of registry.dashboards) {
      const names = d.filters.map((f) => f.name);
      for (const gadget of [...d.gadgets.datacenter, ...d.gadgets.cloud]) {
        for (const step of gadget.configuration) {
          const referenced = step.match(/"(JMH: [^"]+)"/)?.[1];
          if (referenced) expect(names).toContain(referenced);
        }
      }
    }
  });

  it('covers every role and every framework with at least one guide', () => {
    for (const role of registry.roles) {
      expect(registry.dashboards.some((d) => d.roleIds.includes(role.id))).toBe(true);
    }
    for (const f of ['scrum', 'kanban', 'scrumban', 'scaled'] as const) {
      expect(registry.dashboards.some((d) => d.frameworks.includes(f))).toBe(true);
    }
  });
});

describe('dashboard validation', () => {
  const base: DashboardGuide = {
    id: 'x',
    title: 'X',
    roleIds: ['scrum-master'],
    frameworks: ['scrum'],
    purpose: 'p',
    audience: 'a',
    prerequisites: [],
    filters: [],
    gadgets: {
      datacenter: [
        {
          edition: 'datacenter',
          gadgetName: 'Sprint Health Gadget',
          configuration: ['x'],
          verification: 'needs-verification',
        },
      ],
      cloud: [],
    },
    sources: [{ title: 't', url: 'https://example.com', publisher: 'p', retrieved: '2026-11-16' }],
    verification: 'verified',
    lastReviewed: '2026-11-16',
  };

  it('rejects a verified dashboard that contains unverified gadgets', () => {
    const raw = validRaw();
    raw.dashboards = [{ file: 'src/content/dashboards/x.ts', data: base }];
    const result = validateContent(raw);
    expect(result.ok ? [] : result.errors).toEqual([
      expect.stringMatching(/marked verified but contains/),
    ]);
  });

  it('rejects unknown roles', () => {
    const raw = validRaw();
    raw.dashboards = [
      {
        file: 'src/content/dashboards/x.ts',
        data: { ...base, verification: 'needs-verification', roleIds: ['ghost'] },
      },
    ];
    const result = validateContent(raw);
    expect((result.ok ? [] : result.errors).join('\n')).toMatch(/unknown role "ghost"/);
  });
});

describe('Dashboards pages', () => {
  it('lists guides and filters them by role', async () => {
    renderAt('/dashboards');
    expect(screen.getAllByRole('article')).toHaveLength(12);
    await userEvent.selectOptions(screen.getByLabelText('Role'), 'rte');
    expect(screen.getByRole('link', { name: /RTE: Agile Release Train/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Kanban team/ })).toBeNull();
  });

  it('shows filters first, then separate Data Center and Cloud gadget sections', () => {
    renderAt('/dashboards/scrum-team');
    expect(
      screen.getByRole('heading', { name: 'Step 1: create these saved filters' }),
    ).toBeInTheDocument();
    const dc = screen
      .getByRole('heading', { name: 'Jira Data Center' })
      .closest('section') as HTMLElement;
    const cloud = screen
      .getByRole('heading', { name: 'Jira Cloud' })
      .closest('section') as HTMLElement;
    expect(within(dc).getByText('Sprint Burndown Gadget')).toBeInTheDocument();
    expect(within(cloud).getByText('Work item Statistics Gadget')).toBeInTheDocument();
    expect(within(dc).getByText('Issue Statistics')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Print this guide' })).toBeInTheDocument();
  });

  it('hides the other edition’s gadgets when one edition is chosen', async () => {
    renderAt('/dashboards/delivery-manager-release');
    await userEvent.click(screen.getByRole('radio', { name: 'Cloud only' }));
    expect(screen.queryByRole('heading', { name: 'Jira Data Center' })).toBeNull();
    expect(screen.getByRole('heading', { name: 'Jira Cloud' })).toBeInTheDocument();
  });

  it('updates the filter JQL from the parameter panel', async () => {
    renderAt('/dashboards/scrum-team');
    await userEvent.type(screen.getByLabelText(/Project key/), 'ABC');
    const code = [...document.querySelectorAll('figure pre')].map((p) => p.textContent);
    expect(code.length).toBe(3);
    for (const jql of code) expect(jql).toMatch(/^project = ABC AND sprint in openSprints\(\)/);
  });
});

describe('Compare editions page', () => {
  it('shows each difference with both editions and its sources', () => {
    renderAt('/editions');
    const section = screen
      .getByRole('heading', { level: 2, name: /Finding the items in an epic/ })
      .closest('section') as HTMLElement;
    expect(within(section).getByText(/"epic link" = KEY/)).toBeInTheDocument();
    expect(within(section).getByText(/Epic link was retired in February 2024/)).toBeInTheDocument();
    expect(within(section).getByText('Sources')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(
      registry.editionDifferences.length,
    );
  });
});
