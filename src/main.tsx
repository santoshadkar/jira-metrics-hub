import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import App from './App.tsx';
import './styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing #root element');

// Collapsed sections (sources, "not applicable" lists) would print empty, so
// open them for printing and restore them afterwards.
let openedForPrint: HTMLDetailsElement[] = [];
window.addEventListener('beforeprint', () => {
  openedForPrint = [...document.querySelectorAll('details:not([open])')] as HTMLDetailsElement[];
  for (const details of openedForPrint) details.open = true;
});
window.addEventListener('afterprint', () => {
  for (const details of openedForPrint) details.open = false;
  openedForPrint = [];
});

// Development only: validate content on start-up so authors see problems at
// once. Production builds are validated before they are built, so the
// validator (and zod) are not shipped.
if (import.meta.env.DEV) {
  void Promise.all([import('./lib/content-validation.ts'), import('./content/index.ts')]).then(
    ([{ validateContent }, { rawContent }]) => {
      const result = validateContent(rawContent);
      if (!result.ok) {
        console.error(`Invalid content:\n${result.errors.join('\n')}`);
        rootElement.insertAdjacentHTML(
          'afterbegin',
          '<p role="alert" style="background:#fee2e2;color:#7f1d1d;padding:12px;font-weight:600">Invalid content: see the browser console, or run npm run validate.</p>',
        );
      }
    },
  );
}

createRoot(rootElement).render(
  <StrictMode>
    {/* HashRouter: deep links work on any static host with no rewrite rules. */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
