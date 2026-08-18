# Northwind CS Agent

This project uses the eve framework. Before writing code, read the relevant guide from the installed eve package docs at `node_modules/eve/docs/`.

## Billing API

Base URL: `https://billing-api.northwind.vercel.zone`

OpenAPI spec: `https://billing-api.northwind.vercel.zone/api/openapi.json`

Fetch the spec to understand endpoint paths, parameters, and response schemas before writing tools or API utilities. The spec is the source of truth for the API shape.

## Import Aliases

Use `#lib/*.js` for imports (e.g., `import { apiFetch } from "#lib/api.js"`), not relative paths.
