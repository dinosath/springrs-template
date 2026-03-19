# Unified E2E Tests

This directory contains a single unified test file that tests all entities.

## Structure

- `integration_tests.rs` - Main test file containing:
  - Server and container initialization (runs once)
  - Test modules for each entity
  - Shared test utilities

## Running Tests

```bash
cargo test
```

## Benefits

- Single server startup for all tests
- Shared containers across tests  
- Consistent test setup
- Uses `axum-test` for cleaner test code
