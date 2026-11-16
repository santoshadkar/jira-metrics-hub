import type { JqlVariant } from '../types/index.ts';

export interface VariantGroup {
  label: string;
  both?: JqlVariant;
  datacenter?: JqlVariant;
  cloud?: JqlVariant;
}

/** Groups variants by label so the Data Center and Cloud versions of one query sit together. */
export function groupVariants(variants: JqlVariant[]): VariantGroup[] {
  const groups = new Map<string, VariantGroup>();
  for (const variant of variants) {
    const group = groups.get(variant.label) ?? { label: variant.label };
    group[variant.edition] = variant;
    groups.set(variant.label, group);
  }
  return [...groups.values()];
}
