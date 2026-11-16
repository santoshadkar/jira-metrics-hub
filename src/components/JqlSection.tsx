import type { JiraEdition, JqlVariant } from '../types/index.ts';
import { useJqlPreferences, type EditionView } from '../lib/jql-preferences-context.ts';
import { placeholdersIn } from '../lib/placeholders.ts';
import JqlBlock from './JqlBlock.tsx';
import ParamPanel from './ParamPanel.tsx';
import EditionToggle from './EditionToggle.tsx';

import { groupVariants, type VariantGroup } from '../lib/jql-groups.ts';

const EDITION_NAMES: Record<JiraEdition, string> = { datacenter: 'Data Center', cloud: 'Cloud' };

function Missing({ edition }: { edition: JiraEdition }) {
  return (
    <p className="rounded border border-dashed border-slate-300 p-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300">
      No {EDITION_NAMES[edition]} version of this query.
    </p>
  );
}

function SameInBoth() {
  return (
    <p className="mb-2 text-sm text-slate-700 dark:text-slate-300">
      Identical in Data Center and Cloud.
    </p>
  );
}

function renderGroup(group: VariantGroup, view: EditionView) {
  if (group.both) {
    return (
      <>
        <SameInBoth />
        <JqlBlock variant={group.both} />
      </>
    );
  }
  if (view === 'both') {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {group.datacenter ? (
          <JqlBlock variant={group.datacenter} />
        ) : (
          <Missing edition="datacenter" />
        )}
        {group.cloud ? <JqlBlock variant={group.cloud} /> : <Missing edition="cloud" />}
      </div>
    );
  }
  const variant = group[view];
  return variant ? <JqlBlock variant={variant} /> : <Missing edition={view} />;
}

/** The JQL blocks only, without the parameter panel and edition toggle. */
export function JqlList({ variants }: { variants: JqlVariant[] }) {
  const { editionView } = useJqlPreferences();
  return (
    <ul className="space-y-6">
      {groupVariants(variants).map((group) => (
        <li key={group.label}>{renderGroup(group, editionView)}</li>
      ))}
    </ul>
  );
}

/** Parameter panel and edition toggle for a set of JQL variants. */
export function JqlControls({ variants }: { variants: JqlVariant[] }) {
  const placeholders = [...new Set(variants.flatMap((v) => placeholdersIn(v.jql)))];
  return (
    <div className="space-y-4">
      <ParamPanel placeholders={placeholders} />
      <EditionToggle />
    </div>
  );
}

export default function JqlSection({ variants }: { variants: JqlVariant[] }) {
  return (
    <div className="space-y-4">
      <JqlControls variants={variants} />
      <JqlList variants={variants} />
    </div>
  );
}
