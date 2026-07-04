---
name: Deterministic AI without LLM API
description: How to build convincing "AI" product features when no LLM/Gemini API key is available (free tier, integration declined, etc.)
---

When an LLM integration (e.g. Gemini via Replit AI Integrations) is unavailable — account upgrade required and user declines, or no API key permitted — build "AI" features as genuine rule-based/deterministic compute engines instead of faking it or blocking on the missing key.

**Why:** Users on the free tier often can't or won't add paid LLM integrations, but still want an "AI-powered" product (e.g. a hackathon submission). Silently faking results or nagging for an API key both erode trust; real deterministic computation is honest, testable, and often good enough for domain-specific tools (diagnosis, scoring, matching, recommendation).

**How to apply:**
- Model the domain with real reference data (e.g. agronomy thresholds, classification tables, eligibility rules) in plain TypeScript modules under `src/lib/`.
- Use weighted scoring, symptom/keyword matching, and threshold classification instead of prompting a model.
- Don't claim "Gemini-powered" or similar in UI copy if no LLM is actually wired up — describe the feature honestly (e.g. "AI Knowledge Assistant" backed by curated data) and reserve any Gemini/Vertex AI mention for an explicit "architecture vision" section if relevant (e.g. hackathon pitch context).
- Do not retry a failed AI-integration setup call repeatedly or ask for an API key in chat once the user has declined — pivot fully to deterministic logic.
