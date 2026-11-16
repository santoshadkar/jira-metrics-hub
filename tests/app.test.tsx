import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
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

describe('App shell', () => {
  it('renders the home page with main navigation', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Jira Metrics Hub' })).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav).toHaveTextContent('Mandate matrix');
    expect(nav).toHaveTextContent('Content status');
  });

  it('routes to each section', () => {
    renderAt('/editions');
    expect(screen.getByRole('heading', { level: 1, name: 'Compare editions' })).toBeInTheDocument();
  });

  it('shows a not-found page for unknown routes', () => {
    renderAt('/nope');
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
  });

  it('lists all four frameworks', () => {
    renderAt('/frameworks');
    for (const name of ['Scrum', 'Kanban', 'Scrumban', 'Scaled (SAFe or tribe-level)']) {
      expect(screen.getByRole('link', { name })).toBeInTheDocument();
    }
  });

  it('switches to dark mode from the keyboard-accessible theme control', async () => {
    renderAt('/');
    await userEvent.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(document.documentElement).toHaveClass('dark');
    await userEvent.click(screen.getByRole('radio', { name: 'Light' }));
    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('states that the portal never connects to Jira', () => {
    renderAt('/');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('never connects to Jira');
  });
});
