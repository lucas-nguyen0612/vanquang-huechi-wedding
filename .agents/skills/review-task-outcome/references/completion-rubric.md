# Completion Rubric

Use evidence-first scoring. Reward verified delivery, not just plausible implementation.

## Required outputs

- `Requirement coverage`: how many required checklist items are fully complete
- `Validation coverage`: what evidence was actually checked
- `Overall completion`: a conservative percentage for the whole task

## Scoring bands

- `95-100%`: All required items appear complete and validation is strong. Do not give `100%` if critical validation was skipped.
- `80-94%`: Most required items are complete. Remaining gaps are minor, localized, or mostly about follow-up polish.
- `60-79%`: Meaningful progress exists, but one or more required items are only partial, unverified, or still missing important acceptance details.
- `30-59%`: Limited delivery. Some groundwork or partial implementation exists, but major required outcomes are missing.
- `1-29%`: Very small progress. Only setup, exploration, or isolated fragments are complete.
- `0%`: No observable work matches the requirement.

## Common deductions

- Subtract for required items that are missing entirely.
- Subtract for work that was implemented but not validated.
- Subtract when output cannot be clearly mapped back to the story, requirement, or task.
- Subtract more heavily when the missing item is critical to the task's main goal.

## Interpretation rules

- Do not round up to hide uncertainty.
- Keep the score below `100%` when verification is incomplete.
- Prefer a lower score with a clear explanation over a high score with weak evidence.
- If the requirement itself is ambiguous, explain the ambiguity separately from the completion score.
