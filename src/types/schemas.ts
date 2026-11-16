import { z } from 'zod';
import {
  CALC_METHODS,
  CATEGORIES,
  FRAMEWORKS,
  JIRA_EDITIONS,
  MANDATES,
  VERIFICATIONS,
  type DashboardGuide,
  type EditionDifference,
  type MetricContent,
  type Role,
  type RoleMandate,
} from './index.ts';

const text = z.string().trim().min(1, 'must not be empty');
const kebabId = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be kebab-case (lowercase letters, digits, hyphens)');
const isoDate = z.iso.date('must be an ISO date (YYYY-MM-DD)');
const httpsUrl = z.url({ protocol: /^https$/, error: 'must be an https URL' });
const verification = z.enum(VERIFICATIONS);
const framework = z.enum(FRAMEWORKS);

export const SourceSchema = z.strictObject({
  title: text,
  url: httpsUrl,
  publisher: text,
  retrieved: isoDate,
});

export const RoleMandateSchema = z.strictObject({
  roleId: kebabId,
  mandate: z.enum(MANDATES),
  rationale: text,
  framework: framework.optional(),
});

export const JqlVariantSchema = z.strictObject({
  edition: z.enum([...JIRA_EDITIONS, 'both']),
  label: text,
  jql: text,
  notes: text.optional(),
  requiresApp: text.optional(),
  verification,
});

export const GadgetGuideSchema = z.strictObject({
  edition: z.enum(JIRA_EDITIONS),
  gadgetName: text,
  configuration: z.array(text).min(1, 'needs at least one configuration step'),
  verification,
});

export const MetricContentSchema = z.strictObject({
  id: kebabId,
  name: text,
  framework: z.array(framework).min(1, 'needs at least one framework'),
  category: z.enum(CATEGORIES),
  purpose: text,
  howToRead: text,
  formula: text,
  calcMethod: z.enum(CALC_METHODS),
  cadence: text,
  misuseWarning: text,
  healthyRange: text.optional(),
  jql: z.array(JqlVariantSchema),
  dashboardGadget: z.array(GadgetGuideSchema).optional(),
  prerequisites: z.array(text),
  sources: z.array(SourceSchema).min(1, 'every metric needs at least one source'),
  verification,
  lastReviewed: isoDate,
});

export const RoleSchema = z.strictObject({
  id: kebabId,
  name: text,
  description: text,
  framework: z.array(framework).min(1, 'needs at least one framework'),
});

export const MandateTableSchema = z.record(kebabId, z.array(RoleMandateSchema));

export const DashboardFilterSchema = z.strictObject({
  name: text,
  purpose: text,
  jql: z.array(JqlVariantSchema).min(1, 'a filter needs at least one JQL variant'),
  metricId: kebabId.optional(),
});

export const DashboardGuideSchema = z.strictObject({
  id: kebabId,
  title: text,
  roleIds: z.array(kebabId).min(1, 'needs at least one role'),
  frameworks: z.array(framework).min(1, 'needs at least one framework'),
  purpose: text,
  audience: text,
  prerequisites: z.array(text),
  filters: z.array(DashboardFilterSchema),
  gadgets: z.strictObject({
    datacenter: z.array(GadgetGuideSchema),
    cloud: z.array(GadgetGuideSchema),
  }),
  sources: z.array(SourceSchema).min(1, 'every dashboard guide needs at least one source'),
  verification,
  lastReviewed: isoDate,
});

export const EditionDifferenceSchema = z.strictObject({
  id: kebabId,
  topic: text,
  datacenter: text,
  cloud: text,
  whyItMatters: text,
  sources: z.array(SourceSchema).min(1, 'every edition difference needs at least one source'),
  verification,
  lastReviewed: isoDate,
});

// ---- Compile-time guard: schemas and hand-written interfaces must match exactly ----
type Equals<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Assert<T extends true> = T;

export type SchemaMatchesTypes = [
  Assert<Equals<z.infer<typeof MetricContentSchema>, MetricContent>>,
  Assert<Equals<z.infer<typeof RoleSchema>, Role>>,
  Assert<Equals<z.infer<typeof RoleMandateSchema>, RoleMandate>>,
  Assert<Equals<z.infer<typeof DashboardGuideSchema>, DashboardGuide>>,
  Assert<Equals<z.infer<typeof EditionDifferenceSchema>, EditionDifference>>,
];
