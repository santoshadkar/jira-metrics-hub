# Metric content

One file per metric, grouped in a folder per category, for example
`scrum-delivery/velocity.ts`. The file name must match the metric `id`.

Each file default-exports an object that `satisfies MetricContent`
(see `src/types/index.ts`). Do not put mandates here: they live in
`src/content/mandates.ts`, and every metric needs a key there.

New files are picked up automatically. Run `npm run validate` to check them.
