---
name: meridian-doc-standards
description: Use this skill whenever drafting, editing, or reviewing a page in the Meridian Contract Logistics documentation sample (docs/meridian-logistics/** in this portfolio repo) or the portfolio's Documentation Standards page (docs/contributor-guide.mdx). It enforces Diataxis discipline, the required frontmatter schema, the exact SOP template, audience labeling, plain-language rules, and no-orphan-page cross-linking so every page in this sample stays consistent by construction. Always consult this skill before writing a new explanation, how-to, reference, or SOP page in this project, and before editing an existing one.
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

| Field | Value |
|---|---|
| Owner | [Role, never a person's name] |
| Last reviewed | [Date] |
| Review cadence | [Quarterly / Biannual] |
| Applies to | [Which teams or sites] |

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

Owner, Last reviewed, Review cadence, and Applies to appear both here as a
small table and in frontmatter. That duplication is intentional, not sloppy:
frontmatter serves tooling, this table serves the person reading the
page. If you write the Documentation Standards page's explanation of this pattern, state
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
- Keep the subject and its main verb close together. A relative clause
  wedged between them ("Every unit that enters a Meridian warehouse
  passes through four stages") makes the reader hold the subject in
  memory while they wait for the verb. Drop the clause or move it:
  "Every unit passes through four stages in a Meridian warehouse."
- Break up a stack of three or more nouns with a preposition. "Wayfinder
  WMS receiving module access" reads as one dense block. "Access to the
  receiving module in Wayfinder WMS" reads in the order the reader
  processes it. Same fix for "inbound discrepancy protocol" versus
  "process for inbound receipt discrepancies."
- When you list a small set of categories, roles, or examples, use a
  short bullet list instead of naming all of them inside one sentence.
- Lead with the point. Do not build up to it with context first. Cut
  preambles that announce what a sentence is about to do instead of
  doing it: "It is recommended that staff check the shipment" becomes
  "Staff must check the shipment." "In order to complete put-away, you
  will need to scan the barcode" becomes "To complete put-away, scan
  the barcode."
- Cut meta-referential tails that describe the instruction instead of
  adding information: "follow the linked guide instead of continuing
  this step for it" becomes "follow the linked guide instead."
- Cut illustrative "this happens when..." asides that justify a rule.
  State the rule on its own; trust the reader to apply it.
- When a paragraph enumerates parallel reasons, failure modes, or
  outcomes ("First... Second...", or two or more sentences each making a
  separate point), convert it to a numbered or bulleted list with a
  one-line lead-in. Reserve prose paragraphs for a single point or a
  narrative transition, not a stacked list of them.
- Use active voice: "Scan the pallet," not "The pallet should be
  scanned."
- Define every domain term the first time it appears on a page, even
  when another page already defined it. Readers rarely read pages in
  order, so a term cannot lean on a definition that lives elsewhere.
- Domain jargon in play: FIFO, FEFO, FMFO, WMS, FTZ, SKU, bonded
  warehouse, kitting, drayage, 3PL, RMA, PO, ASN, SLA. Define each one
  inline the first time it appears on a page. There is no shared
  glossary page to lean on.
- When introducing an acronym or initialism inline, write the full term
  first and the acronym second, in parentheses: "a stock keeping unit
  (SKU)," never "a SKU (stock keeping unit)."

Two patterns cover every term definition on a page. Pick the one that
matches how many terms you are defining at that point:

1. **Single term: inline appositive.** Define the term inline the
   first time it appears, even inside a numbered step, an SOP
   procedure, or a bulleted UI option. Use a short comma appositive
   right after the term: "a stock keeping unit (SKU), the identifier
   for a distinct product," not a separate sentence before or after
   the step. This keeps the definition in the same clause as the
   action, so the reader never has to leave the page to understand a
   term.
2. **A set of three or more related terms: a bulleted list.** When
   several terms form one cohesive set, such as the three picking
   strategies, name the set in the surrounding prose, then list the
   definitions in a plain bulleted list right after that sentence.
   Give each term its own bullet, bolded term first, then a colon:

   ```
   Wayfinder WMS calculates picking priority automatically, using one
   of three methods:

   - **FIFO** (first in, first out): ships whichever unit arrived
     first, regardless of expiration date.
   - **FEFO** (first expired, first out): ships the unit closest to
     its expiration date first.
   - **FMFO** (first manufactured, first out): ships the unit with
     the earliest manufacture date first.
   ```

   Never wrap a term list in a `:::info[...]` callout; that pattern
   is reserved for the Audience admonition (Section 3). Never use a
   bulleted list for one or two terms either; that is what the inline
   appositive is for.

## 6. Bold, italics, and code: the gold-standard split

This rule follows the Google developer style guide and the Microsoft
Writing Style Guide. Both agree on the same split:

- **Bold** marks a literal UI element, a fixed field label, or a
  category name at the start of a list item when the rest of the item
  defines it.
- _Italics_ mark a title, or a term the text is about to define inline,
  mid-sentence, not at the start of a list item.
- `Code font` marks something the reader types or copies exactly:
  commands, filenames, code.

What counts as bold in this sample:

- A UI element the reader selects: **Log Discrepancy**, **Notify**.
- An option in a dropdown, checkbox, or similar list: **Short-ship**,
  **Over-ship**, **Damaged**, **Mislabeled**.
- A system-generated status value shown on screen: the record moves to
  **Pending Review**.
- A field label in the fixed SOP template: **Owner:**, **Applies to:**.
- A category name at the start of a list item, such as Explanation or
  Reference, when the rest of the item defines it: **Explanation** for
  background a reader needs.

What does not count as bold, even though earlier drafts used it that
way:

- A role or team name, such as Warehouse Operations or Account Manager.
  It is not a UI element. Leave it as plain text.
- A whole sentence, for emphasis. Bold on every important sentence
  reads the same as bold on nothing: the reader loses the signal. If a
  sentence needs emphasis, lead with the point instead of decorating it.

A portfolio README bulleting its own sections (for example, bolding a
linked project name in a bullet list) is a different genre from product
documentation, so this rule does not reach it.

## 7. Numbered steps (how-to guides and SOP Procedure sections)

- Give one action per numbered step. A physical action that includes
  logging it in the system counts as one action, not two: "Count the
  cartons and enter the count," "Photograph the damage and attach the
  photos." The log is how the reader finishes the task, not a separate
  task. Two actions that do not share that relationship, such as
  opening a record and then selecting a different button, still need
  two steps.
- State the expected outcome of a step whenever it is not obvious ("The
  discrepancy log opens.").
- Place any warning immediately before the step it applies to, never after.
  A reader needs the warning before acting, not as a postscript.

## 8. Lead-ins: never drop a list, table, or diagram in cold

Write a short sentence right before any list, table, or diagram,
stating what it contains. A reader who hits a bullet list or a table
with no setup has to infer its purpose from its contents; a lead-in
sentence removes that guesswork.

Good: "Once received, inventory moves into one of three storage
types:" followed by the three bullets. Bad: the same three bullets
with no sentence in front of them.

Exception: a heading that already states exactly what follows, right
above a short, self-evident list, can stand in for the sentence. A
"## Related documents" heading above a bare links list does not also
need a sentence saying "here are related documents."

## 9. No orphan pages

Every page must:
- Sit in the right folder so the sidebar picks it up automatically (Docusaurus
  builds the sidebar from `_category_.json` files), with `sidebar_position` set.
- Link to at least one other page through a "Related documents" section (SOPs)
  or a short "Related" section (everything else). Favor links across Diataxis
  types (a how-to linking to its matching SOP and an explanation page) over
  links within the same type. Cross-type links are what make the four
  sections read as one system instead of four silos.
- After each link, add one short line summarizing what that page covers.
  Reuse that page's own frontmatter `description` field; it is already
  written as a one-line summary. A reader scanning for where to go next
  should know what's on the other side before they click. This rule
  applies to every page in the portfolio, not only pages inside this
  sample.

## 10. Fixed domain vocabulary: reuse exactly, never rename

- Fictional company: Meridian Contract Logistics
- Internal WMS: Wayfinder WMS
- Client-facing real-time inventory visibility platform: ClearLane Visibility

When a page names the WMS or the visibility platform, use these exact names.
Never invent a synonym or a shortened variant.

## 11. Reference pages stay narration-free

Use tables or definition lists only. Avoid "you," "let's," or prose that
explains why something is true; that belongs on an explanation page, which
the reference page can link to.

## 12. Describe the current state, never its history

State what a page, section, or scope is now. Do not narrate what it used
to be ("an earlier version had four SOPs," "I cut it down to..."). A
reader needs the current shape of things, not its edit history. Save
that history for a commit message or a portfolio write-up outside the
docs themselves.

## 13. Disclose "this is fictional" exactly once

Put the fictional-company disclosure on `about-this-sample.mdx` only. Do not
repeat it on other pages. Repeating it reads as defensive and undercuts the
sample's credibility more than it protects it.
