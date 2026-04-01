---
name: review-task-outcome
description: Review work that an agent has just completed and audit it against the original story, requirement, or task. Use when the user wants a post-task explanation of what was done, a requirement-by-requirement verification, a completion percentage, or an explanation of any differences between the delivered work and the requested work.
---

# Review Task Outcome

1. Gather the source of truth first.
- Read the story, requirement, or task before judging the outcome.
- Read the final artifacts of the completed work: changed files, diffs, commands run, test results, generated documents, or other outputs.
- If the requirement is missing, incomplete, or ambiguous, state that explicitly and limit the audit to what can be verified.

2. Build an atomic checklist from the requirement.
- Extract explicit deliverables, acceptance criteria, constraints, and non-goals.
- Split combined requirements into separate checklist items.
- Mark each item as `required`, `optional`, or `unclear`.

3. Explain what the agent actually did.
- Summarize the completed work in plain language.
- Prefer concrete evidence such as files changed, behavior added, bugs fixed, tests run, or documents updated.
- Distinguish between `implemented`, `validated`, and `claimed but not verified`.

4. Compare the outcome against the checklist.
- Classify each checklist item as `done`, `partially done`, `not done`, `unclear`, or `out of scope`.
- Cite the evidence that supports each classification.
- Treat missing tests, missing verification, or missing artifacts as gaps rather than successes.

5. Score completion conservatively.
- Read `references/completion-rubric.md` before assigning a percentage.
- Report `requirement coverage`, `validation coverage`, and `overall completion`.
- Lower the score when implementation exists but verification is weak or incomplete.

6. Explain every deviation.
- Identify each mismatch between the delivered work and the requested work.
- For each mismatch, state what differs, whether it appears intentional or accidental, the most likely reason, and the impact.
- If the reason cannot be proven from evidence, label it as an inference.

7. Respond in the user's language and use this structure.

## What AI Did
- Summarize the work that was completed.

## Requirement Check
- `[done]` requirement or checklist item
- `[partially done]` requirement or checklist item
- `[not done]` requirement or checklist item
- `[unclear]` requirement or checklist item

## Completion Stats
- Requirement coverage: `X/Y required items complete`
- Validation coverage: `what was actually checked`
- Overall completion: `N%`

## Differences and Why
- Describe each difference from the story, requirement, or task.
- Explain the reason. Mark it as inferred when evidence is incomplete.

## Risks or Follow-ups
- List remaining gaps, validation holes, or actions needed to reach full completion.

8. Apply these guardrails.
- Do not invent missing requirements, evidence, or reasons.
- Do not treat partial completion as complete completion.
- Do not assume "tested" unless a concrete validation step is visible.
- Say `No material deviations found` only when the checklist supports that conclusion.
