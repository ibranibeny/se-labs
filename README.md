# SE Labs

A portal of hands-on, self-paced labs for **Azure & cloud solution engineering**,
inspired by the [Microsoft Copilot Agents Labs](https://microsoft.github.io/mcs-labs/)
portal. Built with Jekyll + Minimal Mistakes and published on GitHub Pages.

🔗 **Live site:** https://ibranibeny.github.io/se-labs/

## Architecture

Module-centric: **modules** bundle **labs**.

```
_modules/     # learning paths (e.g., azure-arc)
_labs/        # individual labs, each tagged with `module:`
_layouts/     # module.html, lab.html
```

## Modules

| Module | Levels | Labs |
|--------|--------|------|
| [Azure Arc](_modules/azure-arc.md) | L100–L400 | 4 |
| [Self-Hosted Inference](_modules/self-hosted-inference.md) | L200–L400 | 4 |

### Azure Arc labs

1. L100 — Azure Arc Overview (incl. cost structure)
2. L200 — The Value of Azure Arc
3. L300 — Onboard Windows Server & SQL Server
4. L400 — Simulate a Windows + SQL Server VM into Azure Arc

## Adding a new module

1. Create `_modules/<slug>.md` with front matter (`slug`, `level_range`, `order`, `icon`).
2. Add labs to `_labs/` with `module: <slug>` in their front matter.
3. They appear automatically on the portal home, the Modules page, and the module page.

## Local preview

```bash
gem install bundler jekyll
bundle install
bundle exec jekyll serve
```

## Attribution

Technical content grounded in [Microsoft Learn](https://learn.microsoft.com/azure/azure-arc/).
Diagrams © Microsoft, linked from Microsoft Learn.
