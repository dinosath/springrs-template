# Sample Project Generator

This directory contains configuration files to generate sample projects from the axum-template for testing purposes.

## Overview

Two answer files are provided to test different API protocols:

| File | Protocol | Description |
|------|----------|-------------|
| `answers-rest.yaml` | REST | Generates a REST API with Axum controllers |
| `answers-grpc.yaml` | gRPC | Generates a gRPC service with tonic |

Both configurations include:

- Multiple entities (Profile, Author, Category, Tag, Article, Comment)
- All relation types demonstrated:
  - **oneToOne**: Author ↔ Profile
  - **oneToMany**: Category → Articles
  - **manyToOne**: Article → Category, Article → Author, Comment → Article
  - **manyToMany**: Article ↔ Tag (via junction table)
- PostgreSQL database with SeaORM
- OpenTelemetry integration
- Helm chart for Kubernetes deployment

## Prerequisites

- [Rust](https://rustup.rs/) 1.75+ (2024 edition support)
- [Baker](https://github.com/aliev/baker) - Template generator
- [protoc](https://grpc.io/docs/protoc-installation/) (for gRPC only)

Install baker:

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/aliev/baker/releases/latest/download/baker-installer.sh | sh
```

## Usage

### Generate Sample Projects

Using the helper script:

```bash
chmod +x generate.sh

# Generate both REST and gRPC projects
./generate.sh all

# Generate only REST project
./generate.sh rest

# Generate only gRPC project
./generate.sh grpc

# Specify custom output directory
./generate.sh all /path/to/output
```

Or manually with baker:

```bash
# REST project
baker .. ./generated/rest --answers answers-rest.yaml --non-interactive --skip-confirms all

# gRPC project
baker .. ./generated/grpc --answers answers-grpc.yaml --non-interactive --skip-confirms all
```

### Build and Test

```bash
cd generated/rest  # or generated/grpc
cargo build
cargo test
```

### Run the Application

First, start a PostgreSQL database:

```bash
docker run -d \
  --name sample-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=sample_app \
  -p 5432:5432 \
  postgres:16-alpine
```

Then run the application:

```bash
cd generated/rest
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/sample_app
cargo run
```

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐
│   Profile    │◄─────►│    Author    │
└──────────────┘  1:1  └──────────────┘
                              │
                              │ 1:N
                              ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Category   │──────►│   Article    │◄─────►│     Tag      │
└──────────────┘  1:N  └──────────────┘  M:N  └──────────────┘
                              │
                              │ 1:N
                              ▼
                       ┌──────────────┐
                       │   Comment    │
                       └──────────────┘
```

## Configuration Options

The answer files can be customized to test different template configurations:

| Option | Values | Description |
|--------|--------|-------------|
| `authentication` | `none`, `oidc` | Authentication method |
| `database` | `postgres` | Database type |
| `use_sqlx_migrations` | `true`, `false` | Use sqlx for migrations |
| `id_type` | `integer`, `uuid`, `big_integer` | Primary key type |
| `protocol` | `rest`, `grpc` | API protocol |
| `features` | `open-telemetry`, `helm` | Optional features |
| `crudcrate` | `true`, `false` | Use crudcrate for REST (REST only) |

## CI/CD Integration

This sample is used in the GitHub Actions workflow (`.github/workflows/test.yml`) to:

1. Generate projects from the template (both REST and gRPC via matrix)
2. Verify the generated code compiles
3. Run clippy linting
4. Check code formatting
5. Execute tests
6. Build Helm charts
7. Build Docker images

The workflow runs both protocol variants in parallel using a matrix strategy.

## License

This sample configuration is part of the axum-template project.