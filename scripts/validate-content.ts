/**
 * Build-time content validation. Runs before every `npm run build` and exits
 * non-zero on any problem, which fails the build.
 *
 * Usage: npm run validate
 */
import { validateContent } from '../src/lib/content-validation.ts';
import { loadRawContent } from './load-content.ts';

async function main() {
  const result = validateContent(await loadRawContent());
  if (!result.ok) {
    console.error(`Content validation failed with ${result.errors.length} error(s):\n`);
    for (const error of result.errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  const { metrics, dashboards, roles, editionDifferences } = result.content;
  console.log(
    `Content OK: ${metrics.length} metrics, ${roles.length} roles, ${dashboards.length} dashboards, ${editionDifferences.length} edition differences.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
