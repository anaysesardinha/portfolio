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
:::info[Audience]
This page is for **Warehouse Operations** and **Client Services** teams.
:::
```

The title goes in brackets: `:::info[Audience]`, not `:::info Audience`.
Docusaurus 3's admonition syntax only reads a custom title from the
bracketed form. Without brackets, it is not valid directive syntax, and
Docusaurus prints the raw `:::` text on the page instead of rendering a
callout.

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
  when another page already defined it. Readers rarely read pages in
  order, so a term cannot lean on a definition that lives elsewhere.
- Domain jargon in play: FIFO, FEFO, FMFO, WMS, FTZ, SKU, bonded
  warehouse, kitting, drayage, 3PL, RMA, PO, ASN, SLA. Treat the
  Glossary reference page as the canonical definition.
- On an explanation or how-to page, define the term in its own short
  sentence, or link the term's first mention to the Glossary. On an
  SOP or a terse how-to step, prefer linking the term's first mention
  straight to the Glossary instead of adding a defining sentence. A
  defining sentence dropped into an imperative step reads as a detour
  from the action the reader is mid-way through.

## 6. Bold, italics, and code: the gold-standard split

This rule follows the Google developer style guide and the Microsoft
Writing Style Guide. Both agree on the same split:

- **Bold** marks a literal UI element or a fixed field label. Nothing
  else.
- _Italics_ mark a term the text is about to define, or a title.
- `Code font` marks something the reader types or copies exactly:
  commands, filenames, code.

What counts as bold in this sample:

- A UI element the reader selects: **Log Discrepancy**, **Notify**.
- An option in a dropdown, checkbox, or similar list: **Short-ship**,
  **Over-ship**, **Damaged**, **Mislabeled**.
- A system-generated status value shown on screen: the record moves to
  **Pending Review**.
- A field label in the fixed SOP template: **Owner:**, **Applies to:**.

What does not count as bold, even though earlier drafts used it that
way:

- A role or team name, such as Warehouse Operations or Account Manager.
  It is not a UI element. Leave it as plain text.
- A category name at the start of a list item, such as Explanation or
  Reference, when the rest of the item defines it. Use italics instead:
  _Explanation_ for background a reader needs. That matches the
  first-mention-of-a-term rule both style guides use.
- A whole sentence, for emphasis. Bold on every important sentence
  reads the same as bold on nothing: the reader loses the signal. If a
  sentence needs emphasis, lead with the point instead of decorating it.

A portfolio README bulleting its own sections (for example, bolding a
linked project name in a bullet list) is a different genre from product
documentation, so this rule does not reach it.

## 7. Numbered steps (how-to guides and SOP Procedure sections)

- Give one action per numbered step.
- State the expected outcome of a step whenever it is not obvious ("The
  discrepancy log opens.").
- Place any warning immediately before the step it applies to, never after.
  A reader needs the warning before acting, not as a postscript.

## 8. No orphan pages

Every page must:
- Sit in the right folder so the sidebar picks it up automatically (Docusaurus
  builds the sidebar from `_category_.json` files), with `sidebar_position` set.
- Link to at least one other page through a "Related documents" section (SOPs)
  or a short "Related" section (everything else). Favor links across Diataxis
  types (a how-to linking to its matching SOP and a glossary term) over links
  within the same type. Cross-type links are what make the four sections read
  as one system instead of four silos.

## 9. Fixed domain vocabulary: reuse exactly, never rename

- Fictional company: Meridian Contract Logistics
- Internal WMS: Wayfinder WMS
- Client-facing real-time inventory visibility platform: ClearLane Visibility

When a page names the WMS or the visibility platform, use these exact names.
Never invent a synonym or a shortened variant.

## 10. Reference pages stay narration-free

Use tables or definition lists only. Avoid "you," "let's," or prose that
explains why something is true; that belongs on an explanation page, which
the reference page can link to.

## 11. Disclose "this is fictional" exactly once

Put the fictional-company disclosure on `about-this-sample.mdx` only. Do not
repeat it on other pages. Repeating it reads as defensive and undercuts the
sample's credibility more than it protects it.
