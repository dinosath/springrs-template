# springrs-template — Agent Guide

This file is for AI coding agents working on **the template repository itself** (not a generated project).
For agents working on a generated project, see the `agents.md` rendered inside that project.

---

## What this repo is

`springrs-template` is a [baker](https://github.com/aliev/baker) code-generation template that
scaffolds production-ready Rust backend services (using the **summer** / spring-rs framework,
SeaORM, axum, optional gRPC, ActivityPub, GraphQL, Helm, and frontend kits) from a single JSON answers file.

---

## Repository layout

```
springrs-template/
├── baker.yaml                   # Baker configuration: questions, import root, globs
├── Cargo.toml.baker.j2          # Workspace Cargo.toml template
├── Dockerfile.baker.j2          # Multi-stage Docker image template
├── docker-compose.yml.baker.j2  # Docker Compose template
├── mise.toml                    # Task runner for testing the template (see below)
├── mise.toml.baker.j2           # mise.toml template rendered into generated projects
├── deny.toml.baker.j2           # cargo-deny policy template
├── recipe.json.baker.j2         # cargo-chef recipe template
├── rustfmt.toml.baker.j2        # rustfmt config template
├── build.rs.baker.j2            # build.rs template (gRPC only)
│
├── src/                         # Source templates rendered into the generated project
│   ├── main.rs.baker.j2
│   ├── controllers/             # Conditional: only rendered when 'rest' in protocols
│   ├── activitypub/             # Conditional: only rendered when 'activitypub' in protocols
│   ├── graphql/                 # Conditional: only rendered when 'graphql' in protocols
│   ├── models/                  # Conditional: only rendered when database=='postgres'
│   └── services/
│       └── seaorm_migration_plugin.rs.baker.j2
│
├── migration/                   # SeaORM migration crate template (conditional)
├── proto/                       # .proto template (conditional: 'grpc' in protocols)
├── helm/                        # Helm chart template (conditional: 'helm' in features)
├── frontend/                    # Frontend template (conditional: frontend != 'none')
├── e2e/                         # End-to-end test crate template
│
├── templates/                   # Shared Jinja2 macros and sub-templates imported by baker
│   ├── macros.jinja             # Core macros: type mapping, relation helpers, M2M logic
│   ├── types.jinja → rust/types.jinja
│   ├── proto3.jinja             # Proto3 code-generation macros
│   ├── react-admin.jinja        # React Admin frontend macros
│   ├── solidjs-admin.jinja      # SolidJS Admin frontend macros
│   ├── strapi.schema.json       # JSON Schema for validating the `entities` answer
│   ├── entities.schema.json     # Extended entity schema
│   ├── rust/                    # Rust-specific sub-templates (controllers, models, …)
│   ├── docker/                  # Docker sub-templates
│   ├── kubernetes/helm/         # Helm chart sub-templates
│   ├── mise/ci/                 # CI mise task sub-templates
│   ├── ci/github/               # GitHub Actions workflow
│   ├── schema/grpc|openapi/     # gRPC / OpenAPI schema templates
│   ├── sql/                     # SQL macros
│   └── frontend/                # shadcn-admin-kit / solidjs-frontend sub-templates
│
├── samples/                     # Pre-filled answers files used in CI testing
│   ├── answers-rest.json
│   ├── answers-rest-jwt.json
│   ├── answers-rest-shadcn.json
│   ├── answers-grpc.json
│   ├── answers-all-protocols.json
│   └── answers-mixed-protocols.json
│
└── generated/                   # Output directory written by the test tasks (git-ignored)
    ├── rest/
    ├── rest-jwt/
    ├── rest-shadcn/
    ├── grpc/
    ├── all-protocols/
    └── mixed-protocols/
```

---

## How baker works here

Baker reads `baker.yaml` and processes every file in the repo that is not excluded.

### Template files (`.baker.j2`)

Any file whose name ends in `.baker.j2` is treated as a Jinja2 template. Baker strips the
`.baker.j2` suffix from the output filename and renders the file contents with the answers as
context variables.

Example: `Cargo.toml.baker.j2` → `Cargo.toml` in the generated project.

### Conditional paths in filenames and directory names

Baker evaluates Jinja2 expressions inside **path segments** (directory and file names). This is
how entire sub-trees are included or excluded based on answers:

| Path in template repo | Condition | Effect |
|---|---|---|
| `{% if 'grpc' in protocols %}proto{% endif %}/` | protocols contains grpc | `proto/` dir is included |
| `{% if 'helm' in features %}helm{% endif %}/` | features contains helm | `helm/` dir is included |
| `{% if use_seaorm_migrations %}migration{% endif %}/` | use_seaorm_migrations is true | `migration/` dir is included |
| `{% if 'shadcn-admin-kit'==frontend %}frontend{% endif %}/` | frontend is shadcn-admin-kit | `frontend/` dir is included |
| `{%if 'rest' in protocols%}controllers{% endif %}/` | protocols contains rest | `controllers/` dir is included |
| `{%if 'activitypub' in protocols%}activitypub{% endif %}/` | protocols contains activitypub | `activitypub/` dir is included |
| `{%if 'graphql' in protocols%}graphql{% endif %}/` | protocols contains graphql | `graphql/` dir is included |
| `{%if database=='postgres'%}models{% endif %}/` | database is postgres | `models/` dir is included |

If an expression evaluates to an empty string the path segment (and its whole sub-tree) is
omitted from the output.

### Shared macros (`templates/`)

Files under `templates/` are **not** copied to the output; they are imported by other templates
via Jinja2 `{% import %}`. Baker is configured with `import_root: "templates"` and
`template_globs: ["**/*.jinja", "*.jinja"]`.

---

## Testing the template

The root `mise.toml` drives end-to-end generation and build tests for all sample variants.
Use this to verify that template changes produce a project that actually compiles and passes tests.

```bash
# Install baker and other tools declared in mise.toml
mise install

# Run all sample variants (rest, rest-jwt, rest-shadcn, grpc, all-protocols, mixed-protocols)
mise run all

# Or run a single variant
mise run rest
mise run rest-jwt
mise run rest-shadcn
mise run grpc
mise run all-protocols
mise run mixed-protocols
```

Each task does two things:
1. **generate** — runs `baker . ./generated/<variant> --answers-file samples/answers-<variant>.json --force`
2. **e2e** — enters `generated/<variant>/`, runs `mise trust` then `mise run build-and-test`

A variant passes only when the generated project both compiles cleanly and passes its tests.

---

## Adding or changing template features

1. **Edit template files** (`.baker.j2` or `.jinja`) for content changes.
2. **Use conditional path names** (Jinja2 in directory/file names) to add new optional sub-trees.
3. **Update `baker.yaml`** if a new answer variable is needed (add a question entry).
4. **Update `samples/answers-*.json`** files to cover the new variable so CI tests remain valid.
5. **Run `mise run all`** to confirm all variants still generate, compile, and pass tests.

---

## Key conventions

- **Answers as context** — every key in `baker.yaml` questions is available as a Jinja2 variable
  in all `.baker.j2` files and path names.
- **`templates/macros.jinja`** is the central macro library; prefer extending it over duplicating
  logic across templates.
- **`generated/` is ephemeral** — it is regenerated on every test run and should not be edited
  manually or committed.
- **One template per concern** — follow the existing pattern of one `.baker.j2` file per entity
  type / output file type rather than merging unrelated concerns.
- **Per-entity protocol overrides** — entities may include an optional `protocols` array to
  restrict which protocols are generated for that entity. When absent, the global `protocols`
  setting applies. Use `macros.entity_has_protocol(entity, 'rest', protocols)` in templates.

---

## Protocol support

| Protocol | Directory | Dependencies | Description |
|---|---|---|---|
| `rest` | `src/controllers/` | `summer-web` | Axum REST CRUD endpoints |
| `grpc` | `proto/` | `summer-grpc`, `tonic` | gRPC services from proto schema |
| `activitypub` | `src/activitypub/` | `summer-web` | ActivityPub federation endpoints (object, inbox, outbox, collections) |
| `graphql` | `src/graphql/` | `async-graphql`, `async-graphql-axum` | GraphQL queries & mutations with playground |
