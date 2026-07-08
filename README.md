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

| Module | Levels | Labs | Source |
|--------|--------|------|--------|
| [Azure Arc](_modules/azure-arc.md) | L100–L400 | 4 | [site](https://ibranibeny.github.io/azure-arc-workshop/) · [repo](https://github.com/ibranibeny/azure-arc-workshop) |
| [SGLang Endpoint on Azure H100](_modules/sglang-endpoint.md) | L200–L300 | 3 | [site](https://ibranibeny.github.io/sglang-azure-workshop/) · [repo](https://github.com/ibranibeny/sglang-azure-workshop) |
| [Foundry: Bring Your Own Model](_modules/self-hosted-inference.md) | L200–L400 | 2 | [site](https://ibranibeny.github.io/sglang-azure-workshop/) · [repo](https://github.com/ibranibeny/sglang-azure-workshop) |
| [Azure Resiliency & DR](_modules/azure-resiliency.md) | L200–L400 | 4 | [site](https://ibranibeny.github.io/azure-resiliency-workshop/) · [repo](https://github.com/ibranibeny/azure-resiliency-workshop) |
| [Observability with App Insights](_modules/app-insights.md) | L100–L400 | 4 | [site](https://ibranibeny.github.io/ApplicationInsights-AzureDemo/) · [repo](https://github.com/ibranibeny/ApplicationInsights-AzureDemo) |
| [Network Security (Defense-in-Depth)](_modules/network-security.md) | L100–L400 | 4 | [site](https://ibranibeny.github.io/network-security-workshop/) · [repo](https://github.com/ibranibeny/network-security-workshop) |
| [Spec-Driven Development (Spec Kit)](_modules/spec-kit.md) | L100–L300 | 3 | [site](https://ibranibeny.github.io/Overview-Github-Spec-kit/) · [repo](https://github.com/ibranibeny/Overview-Github-Spec-kit) |

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
