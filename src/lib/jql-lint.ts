import { PLACEHOLDERS } from '../types/index.ts';

/**
 * A deliberately simple, structural JQL check. It catches typing slips:
 * empty queries, unbalanced quotes or parentheses, and placeholder names that
 * are not in the allowed list. It does NOT parse JQL and does NOT prove that a
 * query is valid in Jira: field names, functions, operators and values are not
 * checked. Always run a query in your own Jira before relying on it.
 */
export interface JqlLintIssue {
  message: string;
}

const KNOWN = new Set<string>(PLACEHOLDERS);
const PLACEHOLDER = /\{\{\s*([^{}]*?)\s*\}\}/g;

export function lintJql(jql: string): JqlLintIssue[] {
  const issues: JqlLintIssue[] = [];
  if (jql.trim() === '') return [{ message: 'empty query' }];

  // Quotes and parentheses, scanning outside and inside string literals.
  let quote: '"' | "'" | null = null;
  let quoteStart = -1;
  let depth = 0;
  for (let i = 0; i < jql.length; i++) {
    const ch = jql[i];
    if (quote) {
      if (ch === '\\') {
        i++; // skip the escaped character
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      quoteStart = i;
    } else if (ch === '(') {
      depth++;
    } else if (ch === ')') {
      depth--;
      if (depth < 0) {
        issues.push({ message: `unmatched ")" at position ${i + 1}` });
        depth = 0;
      }
    }
  }
  if (quote)
    issues.push({ message: `unclosed ${quote} quote starting at position ${quoteStart + 1}` });
  if (depth > 0) issues.push({ message: `${depth} unclosed "("` });

  // Placeholders: only the allowed names, and no stray braces.
  for (const match of jql.matchAll(PLACEHOLDER)) {
    const name = match[1] ?? '';
    if (!KNOWN.has(name)) issues.push({ message: `unknown placeholder {{${name}}}` });
  }
  const withoutPlaceholders = jql.replace(PLACEHOLDER, '');
  if (withoutPlaceholders.includes('{{') || withoutPlaceholders.includes('}}')) {
    issues.push({ message: 'malformed placeholder: stray "{{" or "}}"' });
  }

  return issues;
}
