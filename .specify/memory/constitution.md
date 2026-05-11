<!--
Sync Impact Report
==================
Version change: TEMPLATE (unpopulated placeholders) → 1.0.0
Bump rationale: First concrete ratification. All placeholder tokens replaced with
substantive principles derived from repository reality (monorepo: Go HTTP API,
Rails batch pipeline, Next.js i18n frontend, OpenAPI contract, PostgreSQL).
Versioning starts at 1.0.0 because this constitution introduces non-negotiable
governance where none existed before.

Principles defined (all new):
  - I. OpenAPI Contract Is the Source of Truth (NON-NEGOTIABLE)
  - II. Runtime Boundaries Are Fixed
  - III. Generated Code Is Read-Only
  - IV. Lint, Test, and Build Gates Per Touched Runtime
  - V. External Service Boundaries Are Explicit

Added sections:
  - Technology Stack Constraints
  - Development Workflow
  - Governance

Removed sections: none (prior file contained only template placeholders).

Templates reviewed:
  - ✅ .specify/templates/plan-template.md — "Constitution Check" gate references the
        constitution generically; principles will be evaluated at plan time. No edit needed.
  - ✅ .specify/templates/spec-template.md — no principle-specific references. No edit needed.
  - ✅ .specify/templates/tasks-template.md — no principle-specific references. No edit needed.
  - ✅ .specify/templates/checklist-template.md — no principle-specific references. No edit needed.
  - ✅ .specify/templates/commands/ — directory does not exist; nothing to update.

Runtime guidance reviewed (no edits required):
  - CLAUDE.md, AGENTS.md, GEMINI.md, README.md, CONTRIBUTING.md describe operational
    practice consistent with the principles below.

Follow-up TODOs: none.
-->

# JAPAN Listed Companies Constitution

## Core Principles

### I. OpenAPI Contract Is the Source of Truth (NON-NEGOTIABLE)

`openapi/openapi.yaml` MUST be the single source of truth for every HTTP contract
between the Go API and any client (Next.js frontend, Swagger UI, third-party
consumers). The contract is edited first; server and client code follow.

Rules:

- Any change to a request, response, parameter, status code, or schema MUST be
  expressed by editing `openapi/openapi.yaml` before code changes.
- After editing the schema, BOTH generators MUST be re-run in the same change:
  `make go/generate/server` and `make typescript/generate/client`.
- New endpoints MUST be implemented in the Go server; the OpenAPI document is the
  contract, the Go handler is the implementation.

Rationale: the Go server and the TypeScript client are produced from this single
file. Skipping it causes silent drift between server behavior and client types,
which the type system cannot catch because both sides are generated.

### II. Runtime Boundaries Are Fixed

The three runtimes have non-overlapping responsibilities and MUST stay in their
lanes:

- `go/` — the only HTTP-serving runtime. All public API endpoints live here.
- `ruby/` — batch and data-pipeline only. Rails is present solely to run rake
  tasks under `ruby/lib/tasks/` (scrape JPX, call EDINET, populate PostgreSQL).
  No controllers, no HTTP endpoints, no web-facing Rails code.
- `typescript/` — Next.js App Router frontend, locale-routed at `/[lang]/...`
  for `en` and `ja`. No server-side business logic beyond what App Router
  requires; data comes from the Go API via the generated client.

If a feature seems to require an HTTP endpoint in Rails, the endpoint MUST be
added to the Go server instead. If a feature seems to require batch processing in
Go, it MUST be added as a Rails rake task instead.

Rationale: each runtime has a single deployment surface and a single set of
testing conventions. Mixing concerns expands the surface and undermines the
tooling that depends on these boundaries (e.g., `compose.yaml`'s Rails service
runs a no-op command).

### III. Generated Code Is Read-Only

Files produced by code generators MUST NOT be hand-edited. The current generated
artifacts are:

- `go/server/server.gen.go` (from `openapi/openapi.yaml` via `oapi-codegen`)
- `go/models/*.xo.go` (from the live PostgreSQL schema via `xo`)
- `typescript/client/**` (from `openapi/openapi.yaml` via `openapi-generator-cli`)

Extensions to generated models MUST live in `*_extend.go` companion files
alongside the `*.xo.go` they extend. Wrappers around the generated TypeScript
client MUST live outside `typescript/client/`. Regenerated outputs MUST be
committed in the same change as the input that produced them
(`openapi/openapi.yaml` or a schema migration).

Rationale: hand-edits to generated files are silently overwritten on the next
regeneration, producing bugs that are hard to attribute.

### IV. Lint, Test, and Build Gates Per Touched Runtime

Every change MUST pass the gates of the runtime(s) it touches before merge:

- Changes under `go/` MUST pass `make go/test` and `make go/lint`.
- Changes under `ruby/` MUST pass `make ruby/test` and `make ruby/lint`.
- Changes under `typescript/` MUST pass `make typescript/lint` and
  `npm run build` (or `docker compose run --rm typescript npm run build`). The
  TypeScript codebase has no automated unit tests, so the PR description MUST
  state which page(s) or component(s) were manually verified in a browser.
- Changes to `openapi/openapi.yaml` MUST regenerate both the Go server and the
  TypeScript client, then pass the Go and TypeScript gates above.

Skipping a gate because "the change looks safe" is not permitted. If a gate is
broken upstream, fix the gate first; do not merge around it.

Rationale: this polyglot repo has no shared CI that catches everything in one
shot. The Make targets are the only consistent quality signal across the three
runtimes.

### V. External Service Boundaries Are Explicit

The currently integrated third-party services are: EDINET (`書類一覧API`,
`書類取得API`), JPX (scraped HTML), Slack (webhook), GCP (Cloud Build + Terraform),
and Supabase. Any work that would integrate a NEW third-party service (paid or
free) MUST be flagged in the spec and confirmed with a maintainer before code is
written; this is an "External Service Review" gate.

Additional rules for external calls:

- Secrets MUST come from `.env` and MUST be declared (with no value) in
  `.env_sample`. Credentials, API keys, and webhook URLs MUST NOT be committed
  or hardcoded.
- Batch tasks that hit external APIs (rake tasks in `ruby/lib/tasks/`) MUST be
  idempotent — re-running a task with the same inputs MUST NOT corrupt state.
- Endpoint URLs that point to a third-party MUST be configurable via environment
  rather than baked into source.

Rationale: third-party integrations carry compliance, cost, rate-limit, and
reliability tail risks that the codebase alone cannot reason about. Human review
is the gate.

## Technology Stack Constraints

The stack is fixed; substitutions require an amendment to this constitution.

- **Go**: standard library `http.ServeMux` routed by `oapi-codegen` output;
  models generated by `xo`; entrypoint at `go/cmd/server`. Pinned via `go.mod`.
- **Ruby / Rails**: used exclusively as a batch runner via rake tasks. The
  default container command in `compose.yaml` is intentionally a no-op.
- **TypeScript / Next.js 15 (App Router)**: locale-routed at `app/[lang]/...`
  for `en` and `ja`. API client is generated; do not import the underlying
  `openapi-generator-cli` types from outside `typescript/client/`.
- **Database**: PostgreSQL. Schema is owned by Rails migrations under `ruby/`.
  Go reads via the generated `xo` models; it does not run migrations.
- **Local dev**: `docker compose` orchestrates `go`, `ruby`, `typescript`, and
  `postgres`. The top-level `Makefile` wraps tooling in
  `docker compose run --rm <service>` — prefer Make targets over host
  invocations so tool versions stay consistent with CI.
- **Ports / env**: `API_HOST_PORT`, `FRONT_HOST_PORT`, `POSTGRES_PORT`,
  `DATABASE_URL`, `NEXT_PUBLIC_API_URL`, `EDINET_API_KEY`, `SLACK_WEBHOOK_URL`
  are loaded from `.env` (see `.env_sample`). Swagger UI is fixed at `:8000`.

## Development Workflow

- **Branching**: feature branches MUST follow the `###-feature-name` convention
  used by speckit (e.g., `042-add-industry-filter`). `main` is the protected
  base for PRs.
- **Schema-change checklist** (the canonical 3-step task): (1) edit
  `openapi/openapi.yaml`; (2) run `make go/generate/server` and
  `make typescript/generate/client`; (3) update Go handlers in
  `go/server/server.go` and any frontend callers, then re-run the relevant
  linters. PRs that change `openapi/openapi.yaml` without (2) and (3) MUST be
  blocked.
- **PR description requirements**: state which runtime(s) the change touches and
  which gates were run (Principle IV). For TypeScript changes, list the manually
  verified pages.
- **Code review**: every PR MUST verify compliance with the five principles or
  document a justified deviation under "Complexity Tracking" in the plan
  (mirroring `plan-template.md`).
- **Communication policy**: AI-assisted work in this repo converses in
  Japanese; commit messages, PR titles, and PR bodies are written in English
  (as captured in `CLAUDE.md`). This rule lives in operational docs but is
  acknowledged here so amendments stay aligned.

## Governance

- **Authority**: this constitution supersedes ad-hoc conventions. When operational
  docs (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `README.md`, `CONTRIBUTING.md`)
  conflict with the constitution, the constitution wins and the docs MUST be
  updated to match.
- **Amendments**: changes to this file MUST (a) update the version per the
  policy below, (b) update `Last Amended`, (c) prepend a Sync Impact Report
  HTML comment summarizing the change, and (d) propagate consequences to the
  templates under `.specify/templates/` and any runtime guidance that references
  the changed principle.
- **Versioning policy** (semantic):
  - **MAJOR**: removal or backward-incompatible redefinition of a principle or
    governance rule.
  - **MINOR**: addition of a new principle or section, or material expansion of
    an existing one.
  - **PATCH**: clarifications, wording fixes, or non-semantic refinements.
- **Compliance review**: each PR review MUST confirm the change does not violate
  any principle. Deviations require an explicit justification in the PR
  description and, if recurring, an amendment to this file.
- **Runtime guidance pointers**: day-to-day operational details (commands, env
  vars, troubleshooting) live in `CLAUDE.md` and `README.md`; this constitution
  captures only the non-negotiable invariants.

**Version**: 1.0.0 | **Ratified**: 2026-05-11 | **Last Amended**: 2026-05-11
