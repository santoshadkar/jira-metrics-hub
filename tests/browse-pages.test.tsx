import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import App from '../src/App.tsx';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

const section = (name: RegExp) =>
  screen.getByRole('heading', { level: 2, name }).closest('section') as HTMLElement;

describe('Role page', () => {
  it('shows mandatory, recommended and optional groups with a proposed-baseline label', () => {
    renderAt('/roles/scrum-master');
    expect(screen.getByRole('heading', { level: 1, name: 'Scrum Master' })).toBeInTheDocument();
    expect(
      within(section(/^Mandatory/)).getByRole('link', { name: 'Velocity' }),
    ).toBeInTheDocument();
    expect(
      within(section(/^Recommended/)).getByRole('link', { name: 'Cycle time' }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Proposed baseline').length).toBeGreaterThan(0);
    // Variation is written out, not hidden behind hover.
    expect(
      screen.getAllByText(/Mandatory for Scrum · Optional for Scrumban/).length,
    ).toBeGreaterThan(0);
  });

  it('filters by framework', async () => {
    renderAt('/roles/scrum-master');
    await userEvent.selectOptions(screen.getByLabelText('Framework'), 'scrumban');
    expect(
      within(section(/^Optional/)).getByRole('link', { name: 'Velocity' }),
    ).toBeInTheDocument();
    expect(within(section(/^Mandatory/)).queryByRole('link', { name: 'Velocity' })).toBeNull();
  });

  it('reads the framework filter from the URL', () => {
    renderAt('/roles/scrum-master?framework=scrumban');
    expect(screen.getByLabelText('Framework')).toHaveValue('scrumban');
  });
});

describe('Roles list', () => {
  it('lists every role', () => {
    renderAt('/roles');
    expect(screen.getAllByRole('listitem')).toHaveLength(11 + 8); // 11 roles + 8 nav items
  });
});

describe('Framework page', () => {
  it('groups metrics by category', () => {
    renderAt('/frameworks/kanban');
    const flow = section(/Kanban: flow/);
    expect(within(flow).getByRole('link', { name: 'Cycle time' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Velocity' })).toBeNull();
  });

  it('shows not found for an unknown framework', () => {
    renderAt('/frameworks/waterfall');
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
  });
});

describe('Search page', () => {
  it('searches as you type and explains matches', async () => {
    renderAt('/search');
    await userEvent.type(screen.getByLabelText('Search metrics'), 'closedSprints');
    expect(screen.getByRole('link', { name: 'Velocity' })).toBeInTheDocument();
    expect(screen.getAllByText(/Matched in: .*JQL/).length).toBeGreaterThan(0);
  });

  it('runs the query from the URL', () => {
    renderAt('/search?q=predictability');
    expect(screen.getByRole('link', { name: /PI predictability/ })).toBeInTheDocument();
  });

  it('says when nothing matches', async () => {
    renderAt('/search');
    await userEvent.type(screen.getByLabelText('Search metrics'), 'zzzzqqq');
    expect(screen.getByText('No metrics match "zzzzqqq".')).toBeInTheDocument();
  });

  it('follows the URL when the query changes while on the page', async () => {
    renderAt('/');
    await userEvent.type(screen.getByLabelText('Search metrics and JQL'), 'velocity{Enter}');
    expect(screen.getByLabelText('Search metrics')).toHaveValue('velocity');
    expect(screen.getByRole('link', { name: 'Velocity' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: 'Home' }));
    await userEvent.type(screen.getByLabelText('Search metrics and JQL'), 'predictability{Enter}');
    expect(screen.getByLabelText('Search metrics')).toHaveValue('predictability');
    expect(screen.queryByRole('link', { name: 'Velocity' })).toBeNull();
  });
});

describe('Home picker', () => {
  it('shows what a role needs to track for a framework', async () => {
    renderAt('/');
    await userEvent.selectOptions(screen.getByLabelText('Role'), 'flow-manager');
    await userEvent.selectOptions(screen.getByLabelText('Framework'), 'kanban');
    const picker = screen
      .getByRole('heading', { name: 'What do I need to track?' })
      .closest('section') as HTMLElement;
    expect(within(picker).getByRole('link', { name: 'Cycle time' })).toBeInTheDocument();
    expect(
      within(picker).getByRole('link', { name: /Aging work in progress/ }),
    ).toBeInTheDocument();
    expect(within(picker).getByText('Proposed baseline')).toBeInTheDocument();
  });
});

describe('Mandate matrix', () => {
  it('shows roles as columns and metrics as rows', () => {
    renderAt('/matrix');
    const table = screen.getByRole('table');
    expect(within(table.querySelector('thead')!).getAllByRole('columnheader')).toHaveLength(12); // Metric + 11 roles
    expect(within(table).getByRole('rowheader', { name: 'Velocity' })).toBeInTheDocument();
  });

  it('filters metrics by framework and category', async () => {
    renderAt('/matrix');
    await userEvent.selectOptions(screen.getByLabelText('Framework'), 'scaled');
    const table = screen.getByRole('table');
    expect(within(table).getByRole('rowheader', { name: /PI predictability/ })).toBeInTheDocument();
    expect(within(table).queryByRole('rowheader', { name: 'Velocity' })).toBeNull();

    await userEvent.selectOptions(screen.getByLabelText('Framework'), '');
    await userEvent.selectOptions(screen.getByLabelText('Category'), 'kanban-flow');
    expect(
      within(screen.getByRole('table')).queryByRole('rowheader', { name: 'Velocity' }),
    ).toBeNull();
  });

  it('hides and shows role columns', async () => {
    renderAt('/matrix');
    await userEvent.click(screen.getByRole('checkbox', { name: 'Release Train Engineer' }));
    expect(
      within(screen.getByRole('table').querySelector('thead')!).getAllByRole('columnheader'),
    ).toHaveLength(11);
  });

  it('labels every level as a proposed baseline and offers printing', () => {
    renderAt('/matrix');
    expect(screen.getByText('Proposed baseline')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Print' })).toBeInTheDocument();
  });
});
