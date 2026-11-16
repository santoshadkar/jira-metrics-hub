/**
 * Build-time JQL lint. Checks every JQL string in metrics and dashboard
 * filters for empty queries, unbalanced quotes or parentheses, and unknown or
 * malformed placeholders. Exits non-zero on any issue.
 *
 * IMPORTANT: this lint does not prove a query is valid in Jira. It does not
 * know Jira's fields, functions or operators. Run queries in Jira to be sure.
 *
 * Usage: npm run lint:jql
 */
import { lintJql } from '../src/lib/jql-lint.ts';
import type { JqlVariant } from '../src/types/index.ts';
import { loadRawContent } from './load-content.ts';

interface Located {
  where: string;
  variant: JqlVariant;
}

function isVariantList(value: unknown): value is JqlVariant[] {
  return (
    Array.isArray(value) && value.every((v) => typeof v === 'object' && v !== null && 'jql' in v)
  );
}

async function main() {
  const raw = await loadRawContent();
  const found: Located[] = [];

  for (const { file, data } of raw.metrics) {
    const jql = (data as { jql?: unknown })?.jql;
    if (isVariantList(jql))
      jql.forEach((variant, i) => found.push({ where: `${file} jql.${i}`, variant }));
  }
  for (const { file, data } of raw.dashboards) {
    const filters = (data as { filters?: { name: string; jql: unknown }[] })?.filters ?? [];
    for (const filter of filters) {
      if (isVariantList(filter.jql)) {
        filter.jql.forEach((variant, i) =>
          found.push({ where: `${file} filter "${filter.name}" jql.${i}`, variant }),
        );
      }
    }
  }

  let problems = 0;
  for (const { where, variant } of found) {
    for (const issue of lintJql(variant.jql)) {
      problems++;
      console.error(`  - ${where} (${variant.edition}, "${variant.label}"): ${issue.message}`);
    }
  }

  if (problems > 0) {
    console.error(`\nJQL lint found ${problems} problem(s) in ${found.length} queries.`);
    process.exit(1);
  }
  console.log(
    `JQL lint OK: ${found.length} queries checked for empty queries, quotes, parentheses and placeholders. This does not prove the queries are valid in Jira.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
