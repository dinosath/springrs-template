# springrs-template

This is a [baker](https://github.com/aliev/baker) template for quickly scaffolding a Rust backend powered by [spring-rs](https://spring-rs.github.io/) and an optional frontend.

## What does this template do?

- **Simple project:** If you just want a basic project structure, you can generate a minimal backend (with or without a frontend) using springrs.
- **Full CRUD application:** If you define your entities in the baker prompts, this template will generate a complete CRUD backend with sea-orm models, controllers created by [crudcrate](https://github.com/evanjt/crudcrate), migrations and a matching frontend for managing your data.

## Getting Started

### 1. Install Baker

Follow the [installation instructions for baker](https://github.com/aliev/baker?tab=readme-ov-file#installation).

### 2. Generate a New Project Using This Template

```sh
baker https://github.com/dinosath/springrs-template path-to-dir
```

This will prompt you for configuration options and generate a new project in the specified directory.

## Features
- Rust backend powered by [spring-rs](https://spring-rs.github.io/)
- Optional frontend (React Admin or Solid.js)
- Database support via sea-orm
- Docker and docker-compose support
- Flexible code generation via baker
- Generate either a minimal project or a full CRUD app based on your entity definitions

## License
MIT