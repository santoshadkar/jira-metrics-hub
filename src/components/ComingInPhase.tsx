/** Placeholder shown on pages whose content arrives in a later build phase. */
export default function ComingInPhase({ phase, what }: { phase: number; what: string }) {
  return (
    <p className="rounded border border-dashed border-slate-300 p-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
      {what} arrives in build phase {phase}.
    </p>
  );
}
