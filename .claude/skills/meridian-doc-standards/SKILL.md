---
name: meridian-doc-standards
description: Use this skill whenever drafting, editing, or reviewing a page in the Meridian Contract Logistics documentation sample (docs/meridian-logistics/** in this portfolio repo) or the portfolio's Contributor Guide (docs/contributor-guide.mdx). It enforces Diataxis discipline, the required frontmatter schema, the exact SOP template, audience labeling, plain-language rules, and no-orphan-page cross-linking so every page in this sample stays consistent by construction. Always consult this skill before writing a new explanation, how-to, reference, or SOP page in this project, and before editing an existing one.
---

# Meridian documentation standards

This sample exists to prove a point: a technical writer can build a documentation
system, not just a stack of pages. Every rule below exists to make that visible.
Run through this checklist before writing a page, and again before calling it done.

Write every sentence in this skill, and every page it produces, in active voice
and in short, flat sentences (see Section 5). Do not use em dashes anywhere;
use a period, colon, comma, or parentheses instead.

## 1. Pick one Diataxis type. Never mix

Every page is exactly one of:

| `doc_type`    | Purpose                          | Voice                          |
|---------------|-----------------------------------|---------------------------------|
| `explanation` | Background the reader needs before acting | Narrative, can use "you"  |
| `how-to`      | One specific task, for someone who knows the basics | Imperative, numbered steps |
| `reference`   | Lookup material                   | Tables/definitions, no narrative, no "you" |
| `sop`         | A procedure a team must run identically every time | Imperative, the exact template in Section 3 |

If a page needs both concept and steps, split it. A how-to can link to an
explanation page, but it should never contain one.

## 2. Frontmatter: every page, no exceptions

```yaml
---
title: "..."
description: "..."
sidebar_position: N
doc_type: explanation | how-to | reference | sop
audience: "Warehouse Operations, Client Services"
owner: "Warehouse Operations Manager"   # a ROLE, never a person's name
last_reviewed: YYYY-MM-DD
review_cadence: Quarterly | Biannual
applies_to: "All Meridian fulfillment sites"
---
```

This frontmatter forms the structured, machine-readable layer. A real team
could build tooling on it later: audits, dashboards, staleness alerts.

## 3. Audience labeling

Every non-SOP page carries this admonition right under the H1. Fill it in for
that specific page; do not copy the same audience onto every page.

```
:::info Audience
This page is for **Warehouse Operations** and **Client Services** teams.
:::
```

SOPs state audience through the Applies to line in the template instead
(Section 4). Do not add the admonition there too; that would state the same
fact twice for no reason.

## 4. SOPs: the exact template, word for word

```markdown
# SOP-XXX: [Title]

**Owner:** [Role, never a person's name]
**Last reviewed:** [Date]
**Review cadence:** [Quarterly / Biannual]
**Applies to:** [Which teams or sites]

## Purpose
One or two sentences. What this procedure achieves.

## Prerequisites
System access, permissions, physical requirements.

## Procedure
Numbered steps. One action per step. Imperative voice.

## Troubleshooting
Common failure points and what to do about each.

## Related documents
Links to other pages.
```

Owner, Last reviewed, Review cadence, and Applies to appear both here as bold
text and in frontmatter. That duplication is intentional, not sloppy:
frontmatter serves tooling, this bold block serves the person reading the
page. If you write the Contributor Guide's explanation of this pattern, state
that the duplication is deliberate so it does not read as an oversight.

No SOP may skip a section of this template. If a step does not fit under
Purpose, Prerequisites, Procedure, Troubleshooting, or Related documents,
narrow the SOP's scope instead of adding a new section.

## 5. Plain language: short, flat sentences

Write one idea per sentence. Do not stack a claim, its reason, and an
example together with colons or subordinate clauses. Split them into
separate short sentences, or a short list.

Before (one long, layered sentence):

> Mixing types is the most common failure mode in operational docs: a
> procedure buried inside a conceptual page gets skipped by someone who
> scans for a numbered list, and a definition buried inside a how-to
> guide gets missed by someone who only needed the term.

After (flat, listed, no buried reasoning):

> Avoid mixing types in operational docs. Mixed pages hide key details
> from readers.
>
> - Concepts explain ideas.
> - Procedures show the steps.
> - Definitions clarify terms.
>
> Separate your content by type so readers know what to expect before
> they open a page.

Concrete rules:

- Keep most sentences under 20 words. If a sentence has more than one
  comma-joined clause, split it into two sentences.
- When you list a small set of categories, roles, or examples, use a
  short bullet list instead of naming all of them inside one sentence.
- Lead with the point. Do not build up to it with context first.
- Cut illustrative "this happens when..." asides that justify a rule.
  State the rule on its own; trust the reader to apply it.
- Use active voice: "Scan the pallet," not "The pallet should be
  scanned."
- Define every domain term the first time it appears on a page, even
  when another page already defined it, in its own short sentence, not
  tucked inside a parenthetical. Readers rarely read pages in order.
- Domain jargon in play: FIFO, FEFO, FMFO, WMS, FTZ, SKU, bonded
  warehouse, kitting, drayage, 3PL, RMA, PO. Treat the Glossary reference
  page as the canonical definition and link to it instead of
  re-explaining a term at length.

## 6. Numbered steps (how-to guides and SOP Procedure sections)

- Give one action per numbered step.
- State the expected outcome of a step whenever it is not obvious ("The
  discrepancy log opens.").
- Place any warning immediately before the step it applies to, never after.
  A reader needs the warning before acting, not as a postscript.

## 7. No orphan pages

Every page must:
- Sit in the right folder so the sidebar picks it up automatically (Docusaurus
  builds the sidebar from `_category_.json` files), with `sidebar_position` set.
- Link to at least one other page through a "Related documents" section (SOPs)
  or a short "Related" section (everything else). Favor links across Diataxis
  types (a how-to linking to its matching SOP and a glossary term) over links
  within the same type. Cross-type links are what make the four sections read
  as one system instead of four silos.

## 8. Fixed domain vocabulary: reuse exactly, never rename

- Fictional company: Meridian Contract Logistics
- Internal WMS: Wayfinder WMS
- Client-facing real-time inventory visibility platform: ClearLane Visibility

When a page names the WMS or the visibility platform, use these exact names.
Never invent a synonym or a shortened variant.

## 9. Reference pages stay narration-free

Use tables or definition lists only. Avoid "you," "let's," or prose that
explains why something is true; that belongs on an explanation page, which
the reference page can link to.

## 10. Disclose "this is fictional" exactly once

Put the fictional-company disclosure on `about-this-sample.mdx` only. Do not
repeat it on other pages. Repeating it reads as defensive and undercuts the
sample's credibility more than it protects it.
