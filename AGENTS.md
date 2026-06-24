# Northwind CS Agent

This project uses the eve framework.

## Eve Framework
Before writing code, read the relevant guide in `node_modules/eve/docs/` and do not limit to key references. Find most relevant docs for writing code accurately. Key references:
- `reference/project-layout.md` — file structure
- `tools/overview.mdx` — defineTool pattern with zod schemas
- `skills.mdx` — SKILL.md convention
- `sandbox.mdx` — network policy and credential brokering
- `connections.mdx` — OpenAPI connections

## Billing API
Base URL: `https://billing-api.northwind.vercel.zone`

OpenAPI spec: `https://billing-api.northwind.vercel.zone/api/openapi.json`

Fetch the spec to understand endpoint paths, parameters, and response schemas before writing tools or API utilities. The spec is the source of truth for the API shape.

## Import Aliases
Use `#lib/*.js` for imports (e.g., `import { apiFetch } from "#lib/api.js"`), not relative paths.
