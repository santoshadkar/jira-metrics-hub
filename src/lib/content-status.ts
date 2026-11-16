import type { Registry } from './registry.ts';

export interface StatusItem {
  /** What needs checking, in words. */
  title: string;
  /** Where it lives in the portal. */
  link: string;
  /** Extra context, e.g. the edition or the query. */
  detail?: string;
}

export interface StatusGroup {
  id: string;
  title: string;
  items: StatusItem[];
}

const EDITION = { datacenter: 'Data Center', cloud: 'Cloud', both: 'Both editions' } as const;

/** Every item marked needs-verification, grouped by type. */
export function collectNeedsVerification(registry: Registry): StatusGroup[] {
  const metrics: StatusItem[] = [];
  const metricJql: StatusItem[] = [];
  const metricGadgets: StatusItem[] = [];
  const dashboards: StatusItem[] = [];
  const dashboardJql: StatusItem[] = [];
  const dashboardGadgets: StatusItem[] = [];
  const editions: StatusItem[] = [];

  for (const m of registry.metrics) {
    const link = `/metrics/${m.id}`;
    if (m.verification === 'needs-verification') metrics.push({ title: m.name, link });
    for (const v of m.jql) {
      if (v.verification === 'needs-verification') {
        metricJql.push({
          title: `${m.name}: ${v.label}`,
          link,
          detail: `${EDITION[v.edition]} · ${v.jql}`,
        });
      }
    }
    for (const gadget of m.dashboardGadget ?? []) {
      if (gadget.verification === 'needs-verification') {
        metricGadgets.push({
          title: `${m.name}: ${gadget.gadgetName}`,
          link,
          detail: EDITION[gadget.edition],
        });
      }
    }
  }

  for (const d of registry.dashboards) {
    const link = `/dashboards/${d.id}`;
    if (d.verification === 'needs-verification') dashboards.push({ title: d.title, link });
    for (const f of d.filters) {
      for (const v of f.jql) {
        if (v.verification === 'needs-verification') {
          dashboardJql.push({
            title: `${d.title}: ${f.name}`,
            link,
            detail: `${EDITION[v.edition]} · ${v.jql}`,
          });
        }
      }
    }
    for (const gadget of [...d.gadgets.datacenter, ...d.gadgets.cloud]) {
      if (gadget.verification === 'needs-verification') {
        dashboardGadgets.push({
          title: `${d.title}: ${gadget.gadgetName}`,
          link,
          detail: `${EDITION[gadget.edition]} · configuration steps`,
        });
      }
    }
  }

  for (const e of registry.editionDifferences) {
    if (e.verification === 'needs-verification')
      editions.push({ title: e.topic, link: '/editions' });
  }

  return [
    { id: 'metrics', title: 'Metrics', items: metrics },
    { id: 'metric-jql', title: 'Metric JQL queries', items: metricJql },
    { id: 'metric-gadgets', title: 'Metric gadget guides', items: metricGadgets },
    { id: 'dashboards', title: 'Dashboard guides', items: dashboards },
    { id: 'dashboard-jql', title: 'Dashboard filter queries', items: dashboardJql },
    { id: 'dashboard-gadgets', title: 'Dashboard gadget steps', items: dashboardGadgets },
    { id: 'edition-differences', title: 'Edition differences', items: editions },
  ];
}
