import type {DiagramNode} from '@site/src/components/TreeDiagram';

export const siteMapData: DiagramNode = {
  id: 'home',
  label: 'Portfolio home',
  description: 'The landing page, outside this documentation section.',
  href: '/',
  children: [
    {
      id: 'intro',
      label: 'Documentation Samples',
      description: 'This page, an index of every sample.',
      href: '/docs/intro',
      children: [
        {
          id: 'guide',
          label: 'Contributor Guide',
          description: 'Writing standards for the whole site.',
          href: '/docs/contributor-guide',
        },
        {
          id: 'about',
          label: 'Meridian Contract Logistics',
          description: 'The documentation sample itself.',
          href: '/docs/meridian-logistics/about-this-sample',
          children: [
            {
              id: 'process',
              label: 'My Process',
              description: 'Why the sample looks the way it does.',
              href: '/docs/meridian-logistics/my-process',
            },
            {
              id: 'explanation',
              label: 'Explanation',
              description: 'Background before acting.',
              href: '/docs/meridian-logistics/explanation/warehouse-lifecycle',
            },
            {
              id: 'howto',
              label: 'How-to Guides',
              description: 'Steps for one task.',
              href: '/docs/meridian-logistics/how-to/process-inbound-receipt-discrepancy',
            },
            {
              id: 'reference',
              label: 'Reference',
              description: 'Lookup material: tables and definitions.',
              href: '/docs/meridian-logistics/reference/audience-personas',
            },
            {
              id: 'sops',
              label: 'SOPs',
              description: 'A fixed procedure, repeated exactly.',
              href: '/docs/meridian-logistics/sops/sop-101-inbound-receiving-put-away',
            },
          ],
        },
      ],
    },
  ],
};
