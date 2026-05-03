# Cortex

[![Contributing](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-blue.svg)](CODE_OF_CONDUCT.md)

Cortex is a multi-modal desktop application built with Rust and Tauri 2.0.

## Project Structure

This project is organized as a Rust workspace with the following crates:

- **`crates/cortex-core`**: A shared library containing core logic and data structures. It is independent of Tauri and WebView.
- **`crates/cortex-app`**: The main desktop application built with Tauri 2.0. It provides the GUI and desktop-specific features.
- **`crates/cortex-cli`**: A command-line interface for interacting with the Cortex system, depending only on `cortex-core`.

## Getting Started

## Development

This project uses a `Makefile` to simplify common development tasks.

### Basic Commands

- `make help`: Display all available commands.
- `make ci`: Run all CI checks locally (lint, format, type-check, tests).
- `make dev`: Run the Tauri desktop app in development mode.
- `make dev-cli`: Run the CLI in development mode.
- `make build`: Build both the app and CLI for production.
- `make lint`: Run Rust (clippy) and Frontend (eslint) linters.
- `make test`: Run all tests across the workspace.
- `make fmt`: Format all code.

### Prerequisites

- Rust (latest stable)
- `cargo-nextest` (recommended for running tests: `brew install nextest-rs` or `cargo install cargo-nextest`)
- Node.js (for Tauri frontend, if applicable)
- OS-specific Tauri dependencies (see [Tauri documentation](https://tauri.app/v2/guides/getting-started/prerequisites/))

### Building

To build all crates in the workspace:

```bash
cargo build
```

### Running

#### Desktop App
```bash
# Using cargo
cargo run -p cortex-app

# Or using Tauri CLI (recommended for dev)
cargo tauri dev
```

#### CLI
```bash
cargo run -p cortex-cli
```

## Toolchain

- **Rust**: Workspace member crates use a shared version and author configuration.
- **Tauri**: Version 2.0.
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn-ui in `crates/cortex-app/ui`.
- **IPC Contract**: End-to-end type safety between Rust and TypeScript using `tauri-specta`. Bindings are auto-generated via `cargo test -p cortex-app`.

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
- **Standalone CLI**: Platform-specific binaries (`cortex-macos-universal`, `cortex-windows-x86_64.exe`, `cortex-linux-x86_64`).
- **Automated GitHub Releases**: Assets are uploaded to the GitHub Release page with autopopulated release notes from `CHANGELOG.md` and SHA-256 checksums.

## Testing

Cortex follows a strict cross-platform testing strategy. All PRs must pass the test suite on macOS, Windows, and Linux.

### Test Matrix
- **macOS**: Latest stable version.
- **Windows**: Latest stable version.
- **Ubuntu Linux**: Latest LTS version.

### Running Tests
We use `cargo-nextest` for faster, more robust test execution.
```bash
# Run all tests in the workspace
cargo nextest run --workspace

# Run doc tests (not handled by nextest)
cargo test --doc
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
- **CLI**: Download the binary for your platform, rename it to `cortex`, make it executable (`chmod +x cortex`), and move it to your PATH.

## Documentation

For more detailed information, please refer to the following resources:
- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Architecture Overview](internal-docs/ARCHITECTURE.md)
- [Full Documentation Site](https://docs.cortex.app) (Coming soon!)
