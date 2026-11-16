import { useEffect, type ReactNode } from 'react';

const SITE_NAME = 'Jira Metrics Hub';

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

/** Page title (also sets document.title) with an optional intro paragraph. */
export default function PageHeader({ title, children }: PageHeaderProps) {
  useEffect(() => {
    document.title = title === SITE_NAME ? SITE_NAME : `${title} · ${SITE_NAME}`;
  }, [title]);

  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {children && (
        <div className="mt-2 max-w-3xl text-slate-700 dark:text-slate-300">{children}</div>
      )}
    </header>
  );
}
