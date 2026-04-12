# stash-templates

Curated prompt templates for [Stash](https://github.com/Rosqueta/stash) — a minimalist macOS prompt manager.

## How to add a template

Each template is a `.md` file inside the `templates/<category>/` folder.

**Format:**

```markdown
---
title: Your prompt title
tags: [tag1, tag2, tag3]
variables: [var1, var2]
---
Your prompt content here.

Use {{var1}} and {{var2}} as variable placeholders.
```

**Categories:** `general`, `writing`, `design`, `development`, `analysis`, `meetings`

### Option A — from the browser

1. Navigate to `templates/<category>/`
2. Click **Add file → Create new file**
3. Name it `your-prompt-name.md`
4. Write the frontmatter and content
5. Click **Commit changes**

The GitHub Action runs automatically and updates `dist/templates.json` in ~20 seconds.

### Option B — from your editor

1. Create a `.md` file in the appropriate `templates/<category>/` folder
2. `git add . && git commit -m "Add: your prompt title" && git push`

The GitHub Action takes care of the rest.

## Rules for template content

- Variables use `{{variable_name}}` syntax — same as in Stash
- Plain text only — no markdown inside the prompt content itself
- Prompts should be complete and ready to use, not drafts
- Maximum 5 tags per template

## Structure

```
stash-templates/
├── templates/
│   ├── general/
│   ├── writing/
│   ├── design/
│   ├── development/
│   ├── analysis/
│   └── meetings/
├── dist/
│   └── templates.json   ← auto-generated, do not edit manually
└── scripts/
    └── build.js         ← script run by the GitHub Action
```
