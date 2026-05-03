# Cortex

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
- `make dev`: Run the Tauri desktop app in development mode.
- `make dev-cli`: Run the CLI in development mode.
- `make build`: Build both the app and CLI for production.
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
