/**
 * Loads every content file from disk (outside Vite), for the build-time
 * scripts. Mirrors what src/content/index.ts does with import.meta.glob.
 */
import { readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { RawContent, RawFile } from '../src/lib/registry.ts';

const root = resolve(import.meta.dirname, '..');
// JMH_CONTENT_DIR lets the scripts check a copy of the content (used to prove
// that broken content fails the build without touching the real files).
const contentDir = process.env.JMH_CONTENT_DIR
  ? resolve(process.env.JMH_CONTENT_DIR)
  : join(root, 'src', 'content');

function listTsFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
    .map((entry) => join(entry.parentPath, entry.name))
    .sort();
}

const toPosix = (path: string) => relative(root, path).split('\\').join('/');

async function load(path: string): Promise<RawFile> {
  const mod = (await import(pathToFileURL(path).href)) as { default?: unknown };
  return { file: toPosix(path), data: mod.default };
}

export async function loadRawContent(): Promise<RawContent> {
  return {
    metrics: await Promise.all(listTsFiles(join(contentDir, 'metrics')).map(load)),
    dashboards: await Promise.all(listTsFiles(join(contentDir, 'dashboards')).map(load)),
    roles: await load(join(contentDir, 'roles.ts')),
    mandates: await load(join(contentDir, 'mandates.ts')),
    editionDifferences: await load(join(contentDir, 'edition-differences.ts')),
  };
}
