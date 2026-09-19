# Anayse Sardinha: Technical Writing Portfolio

[![CI](https://github.com/anaysesardinha/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/anaysesardinha/portfolio/actions/workflows/ci.yml)

A docs-as-code technical writing portfolio, built with
[Docusaurus](https://docusaurus.io/). Content lives in Markdown/MDX,
versions in Git, and ships through the same pull-request-and-CI workflow
engineers use for code.

## What's here

- **[Meridian Contract Logistics](docs/meridian-logistics/about-this-sample.mdx)**,
  a fictional third-party logistics company. The sample covers one topic,
  inbound receiving and put-away, with one page each of explanation,
  how-to, reference, and SOP content, organized with the
  [Diataxis](https://diataxis.fr/) framework.
- **[Documentation Standards](docs/contributor-guide.mdx)** describing the
  writing standards behind that sample: frontmatter schema, named
  ownership, audience labeling, and the no-orphan-pages rule.
- A project-scoped Claude Code skill at
  [`.claude/skills/meridian-doc-standards`](.claude/skills/meridian-doc-standards/SKILL.md),
  used to keep the sample's pages consistent while drafting.

Run the site locally (see below) to browse these as rendered pages. A
live deployed link will replace these paths once the site is published.

## Setup

```bash
npm install
```

## Local development

```bash
npm run start
```

This starts a local dev server and opens a browser window. Most changes
appear live, without a server restart.

## Build

```bash
npm run build
```

This generates static files into the `build` directory and serves as the
production build. `onBrokenLinks` is set to `throw`, so the build fails on
any broken internal link.

Preview the production build locally with:

```bash
npm run serve
```

## Continuous integration

Every push and pull request to `main` runs a GitHub Actions workflow
(`.github/workflows/ci.yml`) that builds the site and checks for broken
links, both internal (via the Docusaurus build) and external (via
[lychee](https://github.com/lycheeverse/lychee)).
