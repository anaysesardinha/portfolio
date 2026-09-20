#!/usr/bin/env node
'use strict';

// Validates that every page under docs/ follows the structure defined in
// docs/contributor-guide.mdx and .claude/skills/meridian-doc-standards/SKILL.md.
// Minimal, dependency-free frontmatter parser: this repo's frontmatter is
// always flat scalar key: value pairs, so a full YAML parser is not needed.

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');

const REQUIRED_FIELDS = [
  'title',
  'description',
  'sidebar_position',
  'doc_type',
  'audience',
  'owner',
  'last_reviewed',
  'review_cadence',
  'applies_to',
];

const VALID_DOC_TYPES = ['explanation', 'how-to', 'reference', 'sop'];
const VALID_REVIEW_CADENCES = ['Quarterly', 'Biannual', 'Annual'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const SOP_SECTIONS = [
  '## Purpose',
  '## Prerequisites',
  '## Procedure',
  '## Troubleshooting',
  '## Related documents',
];

function findMdxFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMdxFiles(full));
    } else if (entry.isFile() && full.endsWith('.mdx')) {
      results.push(full);
    }
  }
  return results;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!kv) continue;
    data[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, '$1');
  }
  return data;
}

function checkFile(file) {
  const errors = [];
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(process.cwd(), file);

  const frontmatter = parseFrontmatter(content);
  if (!frontmatter) {
    errors.push(`${rel}: missing frontmatter block`);
    return errors;
  }

  for (const field of REQUIRED_FIELDS) {
    if (!frontmatter[field]) {
      errors.push(`${rel}: missing required frontmatter field "${field}"`);
    }
  }

  const docType = frontmatter.doc_type;
  if (docType && !VALID_DOC_TYPES.includes(docType)) {
    errors.push(
      `${rel}: doc_type "${docType}" is not one of ${VALID_DOC_TYPES.join(', ')}`
    );
  }

  if (frontmatter.last_reviewed && !DATE_RE.test(frontmatter.last_reviewed)) {
    errors.push(
      `${rel}: last_reviewed "${frontmatter.last_reviewed}" is not in YYYY-MM-DD format`
    );
  }

  if (
    frontmatter.review_cadence &&
    !VALID_REVIEW_CADENCES.includes(frontmatter.review_cadence)
  ) {
    errors.push(
      `${rel}: review_cadence "${frontmatter.review_cadence}" is not one of ${VALID_REVIEW_CADENCES.join(', ')}`
    );
  }

  if (docType === 'sop') {
    for (const section of SOP_SECTIONS) {
      if (!content.includes(section)) {
        errors.push(`${rel}: SOP is missing the required "${section}" section`);
      }
    }
  } else if (docType && !content.includes(':::info[Audience]')) {
    errors.push(`${rel}: non-SOP page is missing the Audience admonition`);
  }

  if (!/\]\(\/docs\//.test(content)) {
    errors.push(`${rel}: page has no link to another doc page (orphan page)`);
  }

  return errors;
}

const files = findMdxFiles(DOCS_DIR);
const allErrors = files.flatMap(checkFile);

if (allErrors.length > 0) {
  console.error(`Found ${allErrors.length} documentation standard violation(s):\n`);
  for (const error of allErrors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log(`Checked ${files.length} doc page(s). All documentation standards passed.`);
