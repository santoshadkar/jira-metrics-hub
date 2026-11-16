import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import App from '../src/App.tsx';

function renderMetric(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/metrics/${id}`]}>
      <App />
    </MemoryRouter>,
  );
}

afterEach(() => vi.restoreAllMocks());

describe('Metric detail page', () => {
  it('shows every required section', () => {
    renderMetric('velocity');
    expect(screen.getByRole('heading', { level: 1, name: 'Velocity' })).toBeInTheDocument();
    for (const name of [
      'How it is calculated',
      'How to read it',
      'How it gets misused',
      'Prerequisites',
      'Who tracks it',
      'JQL',
      'Sources',
    ]) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getAllByText('Proposed baseline').length).toBeGreaterThan(0);
    expect(screen.getByText('Built-in report')).toBeInTheDocument();
  });

  it('says plainly when JQL does not produce the number', () => {
    renderMetric('velocity');
    expect(screen.getByText('JQL does not produce this number.')).toBeInTheDocument();
  });

  it('updates JQL live from the parameter panel and leaves unfilled placeholders visible', async () => {
    renderMetric('velocity');
    const input = screen.getByLabelText(/Project key/);
    await userEvent.type(input, 'ABC');
    const firstQuery = screen.getAllByRole('figure')[0]!;
    expect(firstQuery).toHaveTextContent('project = ABC AND sprint in closedSprints()');
    const secondQuery = screen.getAllByRole('figure')[1]!;
    expect(secondQuery).toHaveTextContent('sprint = "{{SPRINT_NAME}}"');
    expect(within(secondQuery).getByText('1 placeholder still to fill in.')).toBeInTheDocument();
  });

  it('copies the substituted query', async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    renderMetric('velocity');
    await user.type(screen.getByLabelText(/Project key/), 'XYZ');
    await user.click(screen.getAllByRole('button', { name: /^Copy query/ })[0]!);
    expect(writeText).toHaveBeenCalledWith(
      'project = XYZ AND sprint in closedSprints() AND statusCategory = Done ORDER BY resolved DESC',
    );
    expect(await screen.findByText('Copied')).toBeInTheDocument();
  });

  it('shows identical queries once and split queries side by side, with a toggle', async () => {
    renderMetric('blocked-items');
    const split = 'Open items that have an "is blocked by" link';
    expect(screen.getAllByText('Identical in Data Center and Cloud.')).toHaveLength(1);
    // Side by side: the split query appears once per edition.
    expect(screen.getAllByText(split)).toHaveLength(2);
    expect(screen.getByText(/issueLinkType = "is blocked by"/)).toBeInTheDocument();
    expect(screen.getByText(/workItemLinkType = "is blocked by"/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('radio', { name: 'Cloud only' }));
    expect(screen.getAllByText(split)).toHaveLength(1);
    expect(screen.queryByText(/issueLinkType = "is blocked by"/)).toBeNull();
  });

  it('shows a needs-verification badge on an unconfirmed query', () => {
    renderMetric('epic-release-burnup');
    expect(screen.getAllByText('Needs verification').length).toBeGreaterThan(0);
  });

  it('shows the app badge on queries that need a Marketplace app', () => {
    renderMetric('mid-sprint-scope-change');
    expect(screen.getAllByText('Requires app: ScriptRunner for Jira').length).toBe(2);
  });

  it('flags metrics that need verification', () => {
    renderMetric('pi-predictability');
    expect(screen.getByText(/could not be confirmed from an official source/)).toBeInTheDocument();
  });

  it('shows not found for an unknown metric', () => {
    renderMetric('no-such-metric');
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
  });
});
