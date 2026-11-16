import type { Source } from '../types/index.ts';

/** A list of cited sources, de-duplicated by URL. */
export default function SourceList({ sources }: { sources: Source[] }) {
  const unique = [...new Map(sources.map((s) => [s.url, s])).values()];
  return (
    <ul className="max-w-3xl space-y-2">
      {unique.map((source) => (
        <li key={source.url}>
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-blue-700 underline dark:text-blue-300"
          >
            {source.title}
          </a>
          <span className="text-sm text-slate-700 dark:text-slate-300">
            {' '}
            · {source.publisher} · retrieved{' '}
            <time dateTime={source.retrieved}>{source.retrieved}</time>
          </span>
        </li>
      ))}
    </ul>
  );
}
