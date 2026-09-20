import type {DiagramNode} from '@site/src/components/TreeDiagram';

export const siteMapData: DiagramNode = {
  id: 'home',
  label: 'Portfolio home',
  description: 'The landing page, outside this documentation section.',
  href: '/',
  kind: 'Landing',
  children: [
    {
      id: 'intro',
      label: 'Writing Samples',
      description: 'This page, an index of every sample.',
      href: '/docs/intro',
      kind: 'Index',
      children: [
        {
          id: 'guide',
          label: 'Documentation Standards',
          description: 'Writing standards for the whole site.',
          href: '/docs/contributor-guide',
          kind: 'Standards',
        },
        {
          id: 'about',
          label: 'Meridian Contract Logistics',
          description: 'The documentation sample itself.',
          href: '/docs/meridian-logistics/about-this-sample',
          kind: 'Sample',
          children: [
            {
              id: 'explanation',
              label: 'Explanation',
              description: 'Background before acting.',
              href: '/docs/meridian-logistics/warehouse-lifecycle',
              kind: 'Explanation',
            },
            {
              id: 'howto',
              label: 'How-to Guides',
              description: 'Steps for one task.',
              href: '/docs/meridian-logistics/process-inbound-receipt-discrepancy',
              kind: 'How-to',
            },
            {
              id: 'sops',
              label: 'SOPs',
              description: 'A fixed procedure, repeated exactly.',
              href: '/docs/meridian-logistics/sop-101-inbound-receiving-put-away',
              kind: 'SOP',
            },
            {
              id: 'reference',
              label: 'Reference',
              description: 'Lookup material: tables and definitions.',
              href: '/docs/meridian-logistics/reference/storage-type-comparison',
              kind: 'Reference',
            },
          ],
        },
      ],
    },
  ],
};
