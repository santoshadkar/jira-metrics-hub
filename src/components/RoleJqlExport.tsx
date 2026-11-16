import { useId, useState } from 'react';
import type { Framework, JiraEdition, Role } from '../types/index.ts';
import { registry } from '../content/index.ts';
import { downloadText, roleJqlText, today } from '../lib/export.ts';
import { useJqlPreferences } from '../lib/jql-preferences-context.ts';

/** Downloads every JQL query for a role and one edition as a text file. */
export default function RoleJqlExport({ role, framework }: { role: Role; framework?: Framework }) {
  const [edition, setEdition] = useState<JiraEdition>('datacenter');
  const { values } = useJqlPreferences();
  const id = useId();

  return (
    <div className="no-print flex flex-wrap items-center gap-2 text-sm">
      <label htmlFor={id} className="font-semibold">
        Download all JQL for
      </label>
      <select
        id={id}
        value={edition}
        onChange={(event) => setEdition(event.target.value as JiraEdition)}
        className="rounded border border-slate-400 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-950"
      >
        <option value="datacenter">Jira Data Center</option>
        <option value="cloud">Jira Cloud</option>
      </select>
      <button
        type="button"
        onClick={() =>
          downloadText(
            `jql-${role.id}-${edition}${framework ? `-${framework}` : ''}-${today()}.txt`,
            roleJqlText({
              metrics: registry.metrics,
              role,
              edition,
              framework,
              values,
              generatedOn: today(),
            }),
            'text/plain;charset=utf-8',
          )
        }
        className="rounded border border-slate-400 px-3 py-1 font-semibold hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
      >
        Download .txt
      </button>
    </div>
  );
}
