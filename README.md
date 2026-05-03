# Cortex

Cortex is a multi-modal desktop application built with Rust and Tauri 2.0.

## Project Structure

This project is organized as a Rust workspace with the following crates:

- **`crates/cortex-core`**: A shared library containing core logic and data structures. It is independent of Tauri and WebView.
- **`crates/cortex-app`**: The main desktop application built with Tauri 2.0. It provides the GUI and desktop-specific features.
- **`crates/cortex-cli`**: A command-line interface for interacting with the Cortex system, depending only on `cortex-core`.

## Getting Started

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
- **Frontend**: Minimal static HTML/CSS in `crates/cortex-app/ui`.
