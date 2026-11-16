import { useSearchParams } from 'react-router';
import { FRAMEWORKS, type Framework } from '../types/index.ts';

const isFramework = (value: string | null): value is Framework =>
  value !== null && (FRAMEWORKS as readonly string[]).includes(value);

/**
 * A single URL search parameter as state, so filtered views can be linked and
 * bookmarked. Nothing is stored anywhere else.
 */
export function useUrlParam(name: string): [string, (value: string | undefined) => void] {
  const [params, setParams] = useSearchParams();
  const value = params.get(name) ?? '';
  const setValue = (next: string | undefined) =>
    setParams(
      (current) => {
        const updated = new URLSearchParams(current);
        if (next) updated.set(name, next);
        else updated.delete(name);
        return updated;
      },
      { replace: true },
    );
  return [value, setValue];
}

/** The `framework` URL parameter, ignoring unknown values. */
export function useFrameworkParam(): [
  Framework | undefined,
  (value: Framework | undefined) => void,
] {
  const [value, setValue] = useUrlParam('framework');
  return [isFramework(value) ? value : undefined, setValue];
}
