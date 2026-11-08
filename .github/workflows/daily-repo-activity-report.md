---
emoji: 📊
description: Daily report of recent repository activity with an SDLC summary, delivered as a GitHub issue.
intent: Give maintainers a single daily issue summarizing the last 24 hours of repository activity and the health of each SDLC stage (plan, code, review, build/deploy, release).
on:
  schedule: daily
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
  actions: read
  copilot-requests: write
tools:
  github:
    mode: gh-proxy
    toolsets: [default, actions]
network:
  allowed: []
safe-outputs:
  mentions: false
  allowed-github-references: []
  create-issue:
    title-prefix: "Daily Repo Activity:"
    labels: [report, daily-activity]
    assignees: [ibranibeny]
    close-older-issues: true
    expires: 7
---

# Daily Repository Activity and SDLC Summary

Produce one daily report for `${{ github.repository }}` as a GitHub issue.

## Report Window

Use the last 24 full hours ending at workflow start (UTC). Compute `window_start_utc` and `window_end_utc` first and use them for every query. Date the report title with the calendar date of `window_end_utc`, for example `Daily Repo Activity: 2026-11-08`.

## Gather Data

Use `gh` commands (via the GitHub proxy) scoped to the window:

- **Commits** on the default branch (author, short SHA, message headline).
- **Pull requests** opened, merged, closed without merge, and still open with review activity.
- **Issues** opened, closed, and commented on.
- **Workflow runs** (GitHub Actions) — counts by workflow and conclusion, plus any failures.
- **Deployments** — runs of the `Deploy to GitHub Pages` workflow and their outcomes.
- **Releases and tags** published in the window.

When labels or other metadata are missing, put items in an `Unclassified` bucket instead of guessing.

## Report Structure

Use `###` for sections and `####` for subsections. Never use `#` or `##`. Use GitHub alerts (`> [!NOTE]`, `> [!WARNING]`, `> [!CAUTION]`) instead of emoji status markers.

1. `### Overview` — 1–2 short paragraphs with the main findings and the window.
2. `### Key Metrics` — a small table: commits, PRs opened/merged/closed, issues opened/closed, workflow runs (success/failure), deployments, releases.
3. `### SDLC Summary` — one row per stage with a status (Healthy / Attention / Blocked / Idle) and a one-line rationale:
   - **Plan** — issue intake vs. closure, untriaged issues.
   - **Code** — commit volume, contributors, areas changed (for example `src/content/`, `src/components/`, `scripts/`).
   - **Review** — PRs awaiting review, time to merge for merged PRs, PRs open longer than 7 days.
   - **Build and Test** — CI pass rate and failing workflows.
   - **Deploy** — GitHub Pages deployment outcomes and the latest successful deploy.
   - **Release** — releases or tags published.
   Add a `> [!WARNING]` alert for any stage marked Attention, and `> [!CAUTION]` for Blocked.
4. `### Highlights` — notable merged PRs and closed issues (up to 10).
5. Collapsible `<details><summary>...</summary>` sections with the full lists of commits, PRs, issues, and workflow runs.
6. `### Recommendations` — up to 5 concrete next steps based on the data.
7. `**References:**` — links to up to 3 of the most relevant workflow runs, formatted as `[§<run_id>](https://github.com/${{ github.repository }}/actions/runs/<run_id>)`.

Do not add footer attribution.

## Safe Outputs

- Create the report with `create-issue`. The body must contain the full report, not a placeholder.
- If the window has no commits, PRs, issues, workflow runs, deployments, or releases, call `noop` with the message `No activity in last 24 full hours (<window_start_utc> to <window_end_utc>)` instead of creating an issue.
