# Cortex

[![Contributing](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-blue.svg)](CODE_OF_CONDUCT.md)

Cortex is a multi-modal desktop application built with Rust and Tauri 2.0.

## Project Structure

This project is organized as a Rust workspace with the following crates:

- **`crates/cortex-core`**: A shared library containing core logic and data structures. It is independent of Tauri and WebView.
- **`crates/cortex-app`**: The main application. It functions as a single unified binary that launches the GUI by default and switches to CLI mode when subcommands are provided.

## Getting Started

## Development

This project uses a `Makefile` to simplify common development tasks.

### Basic Commands

- `make help`: Display all available commands.
- `make ci`: Run all CI checks locally (lint, format, type-check, tests).
- `make dev`: Run the Tauri desktop app in development mode.
- `make dev-cli`: Run the app in CLI mode for development.
- `make build`: Build the unified application for production.
- `make lint`: Run Rust (clippy) and Frontend (eslint) linters.
- `make test`: Run all tests across the workspace.
- `make fmt`: Format all code.

### Prerequisites

- Rust (latest stable)
- Node.js (for Tauri frontend, if applicable)
- OS-specific Tauri dependencies (see [Tauri documentation](https://tauri.app/v2/guides/getting-started/prerequisites/))

### Building

To build all crates in the workspace:

```bash
cargo build
```

### Running

#### Desktop App (GUI)
```bash
# Using cargo
cargo run -p cortex

# Or using Tauri CLI (recommended for dev)
cargo tauri dev
```

#### CLI Mode
```bash
# Display help
cargo run -p cortex -- --help

# Run a subcommand
cargo run -p cortex -- run --request "Hello world"
```

## Toolchain

- **Rust**: Workspace member crates use a shared version and author configuration.
- **Tauri**: Version 2.0.
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn-ui in `crates/cortex-app/ui`.
- **IPC Contract**: End-to-end type safety between Rust and TypeScript using `tauri-specta`. Bindings are auto-generated via `cargo test -p cortex`.

## Continuous Integration & Deployment

The project uses GitHub Actions for automated CI/CD:

### CI Pipeline (`ci.yml`)
Runs on every push and pull request to `main`:
- **Lint & Type-check**: Rust (`fmt`, `clippy`) and Frontend (`eslint`, `tsc`).
- **Test & Build**: Rust unit tests and Tauri build validation across macOS, Windows, and Linux.

### Release Pipeline (`release.yml`)
Triggered automatically when a new version tag (e.g., `v0.1.0`) is pushed:
- **Signed Installers**:
    - **macOS**: Signed and notarized `.dmg` (universal binary).
    - **Windows**: Signed `.msi` installer.
    - **Linux**: `.deb`, `.rpm`, and `.AppImage` packages.
- **Unified Binary**: A single `cortex` binary for each platform that supports both GUI and CLI modes.
- **Automated GitHub Releases**: Installers and standalone binaries are uploaded to the GitHub Release page with autopopulated release notes from `CHANGELOG.md` and SHA-256 checksums.

## Testing

Cortex follows a strict cross-platform testing strategy. All PRs must pass the test suite on macOS, Windows, and Linux.

### Test Matrix
- **macOS**: Latest stable version.
- **Windows**: Latest stable version.
- **Ubuntu Linux**: Latest LTS version.

### Running Tests
To run all tests in the workspace:
```bash
cargo test --workspace
```

### Flaky Test Policy
Reliable CI is critical. Intermittently failing (flaky) tests must be addressed immediately:
1. **Identify**: If a test fails intermittently, it is considered flaky.
2. **Track**: Open a GitHub Issue with the label `flaky-test` and include the error logs.
3. **Isolate**: Mark the test with `#[ignore]` and add a comment linking to the GitHub Issue.
   ```rust
   #[test]
   #[ignore = "Flaky: https://github.com/0funct0ry/cortex/issues/XYZ"]
   fn my_flaky_test() { ... }
   ```
4. **Fix**: Flaky tests must be resolved or permanently removed within **one release cycle**.

## Releases

Download the latest version of Cortex and the CLI from the [GitHub Releases](https://github.com/0funct0ry/cortex/releases) page.

### Installation

- **macOS**: Download the `.dmg` file, open it, and drag Cortex to your Applications folder.
- **Windows**: Download the `.msi` file and run the installer.
- **Linux**: Choose your preferred format (`.deb`, `.rpm`, or `.AppImage`).
- **CLI**: The unified `cortex` binary can be found in the installation directory or downloaded separately. Add it to your PATH

## File Formats

### 📁 Core File Formats
- **Collection Manifest (`cortex.yaml`)**: Root configuration for a collection.
- **Request Files (`.crx`)**: Standalone YAML files for individual API requests.
- **Environments (`environments/*.yaml`)**: Environment-specific variables with support for encrypted secrets.

### 🔐 Secret Management
Cortex supports transparent encryption for sensitive variables (like API keys) to allow safe version control.
- Mark a variable as `secret: true` in an environment file.
- Cortex encrypts the value using **AES-GCM-256** before saving to disk.
- Encrypted values are stored as `ENC(v1:...)` blobs.
- Requires a master key (provided via `CORTEX_MASTER_KEY` environment variable) for decryption.

### Request File (`.crx`)
Cortex stores individual API requests as human-readable YAML files with a `.crx` extension. This allows requests to be easily shared, version-controlled, and edited with any text editor.

Example `.crx` file:

```yaml
version: "1"
name: "Get User Profile"
method: GET
url: "https://api.example.com/v1/profile"
headers:
  Accept: "application/json"
  Authorization: "Bearer {{token}}"
params:
  include: "details"
auth:
  type: bearer
  token: "{{token}}"
scripts:
  pre: |
    console.log("Setting up request...");
  post: |
    console.log("Processing response...");
tests: |
  test("status is 200", () => {
    expect(res.status).toBe(200);
  });
tags:
  - "user"
  - "api"
settings:
  timeout: 5000
```

### Collection Manifest (`cortex.yaml`)

Every Cortex collection directory contains a `cortex.yaml` file at its root. This manifest defines the collection's name, description, and shared configurations like default headers, authentication, and variables.

Example `cortex.yaml` file:

```yaml
version: "1"
name: "E-commerce API"
description: "Requests for the e-commerce platform"
headers:
  Content-Type: "application/json"
  X-Client-ID: "cortex-app"
auth:
  type: bearer
  token: "{{global_token}}"
variables:
  base_url: "https://api.example.com"
  version: "v1"
```

## Documentation

For more detailed information, please refer to the following resources:
- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Architecture Overview](internal-docs/ARCHITECTURE.md)
- [Full Documentation Site](https://docs.cortex.app) (Coming soon!)
