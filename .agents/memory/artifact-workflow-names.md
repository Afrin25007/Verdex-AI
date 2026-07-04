---
name: Workflow names for artifacts
description: How to find the exact workflow name to pass to restart_workflow for a given artifact
---

`restart_workflow` requires the exact workflow name as registered in the workflow runner — this is not the same as the artifact title, slug, or service name from `artifact.toml`.

**Why:** Guessing common candidates (artifact title like "Verdex AI", service name like "web", or the `[[services]] name` field like "API Server") repeatedly fails with `RUN_COMMAND_NOT_FOUND` because the actual registered name follows the pattern `artifacts/<slug>: <service-name>` (e.g. `artifacts/verdex-ai: web`, `artifacts/api-server: API Server`).

**How to apply:** Call `refresh_all_logs` first — the `<workflows>` block lists each workflow's exact `name:` field. Use that literal string with `restart_workflow`/`fetch` rather than guessing from `artifact.toml` fields.
