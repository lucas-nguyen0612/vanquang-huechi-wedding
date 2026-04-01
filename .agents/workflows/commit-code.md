---
description: Automatically generate a semantic commit message and commit your code
---

1. You **MUST** strictly follow the instructions defined in the `smart-commit` skill located at `.agents/skills/commit-code/SKILL.md`.
2. Retrieve the current branch name and analyze both staged and unstaged file changes.
3. Generate a commit message following the format rules specified in the skill.
4. Present the generated commit message and the list of files to the user for confirmation before executing any `git commit` commands.
5. If the user agrees, proceed to stage files (if not already staged) and commit the code.
6. Check with the user if they also need a PR description generated.