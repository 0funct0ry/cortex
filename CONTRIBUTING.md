# Contributing to Cortex

Thank you for your interest in contributing to Cortex! We welcome contributions from everyone.

This guide will help you get started with your first contribution.

## Prerequisites

To contribute to Cortex, you'll need the following tools installed on your system:

- **Rust**: Latest stable version. Install via [rustup](https://rustup.rs/).
- **Node.js**: Version 18 or later. Install via [nodejs.org](https://nodejs.org/).
- **OS-Specific Dependencies**: Follow the [Tauri 2.0 Prerequisites Guide](https://tauri.app/v2/guides/getting-started/prerequisites/) for your operating system (macOS, Windows, or Linux).

## Local Development Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/0funct0ry/cortex.git
    cd cortex
    ```

2.  **Install dependencies**:
    ```bash
    # Install frontend dependencies
    cd crates/cortex-app/ui
    npm install
    cd ../../../
    ```

3.  **Run the app in development mode**:
    ```bash
    make dev
    ```

## Development Workflow

### Project Structure

Cortex is a Rust workspace with the following crates:
- `crates/cortex-core`: Shared logic and data structures (platform-agnostic).
- `crates/cortex-app`: Tauri desktop application (GUI).
- `crates/cortex-cli`: Command-line interface.

### Common Commands

We use a `Makefile` to simplify common tasks:

- `make help`: List all available commands.
- `make dev`: Run the desktop app in development mode.
- `make dev-cli`: Run the CLI in development mode.
- `make test`: Run all tests in the workspace.
- `make lint`: Run all linters (Clippy for Rust, ESLint for Frontend).
- `make fmt`: Format all code (rustfmt and Prettier).
- `make ci`: Run all checks locally (highly recommended before pushing).

### Code Style

- **Rust**: Enforced via `rustfmt`. Run `make fmt-rust` to format or `make check-fmt-rust` to check.
- **Frontend**: Enforced via **ESLint** and **Prettier**. Run `make fmt-ui` to format or `make check-fmt-ui` to check.

### Branch Naming Convention

- `feature/description` or `feat/description` for new features.
- `fix/description` or `bugfix/description` for bug fixes.
- `docs/description` for documentation changes.
- `chore/description` for maintenance tasks.

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Examples:
- `feat(core): add new search engine support`
- `fix(ui): resolve alignment issue in sidebar`
- `docs: update contributing guide`

### Pull Request Process

1.  Create a new branch for your changes.
2.  Implement your changes and add tests if applicable.
3.  Ensure all checks pass by running `make ci`.
4.  Commit your changes using the conventional commit format.
5.  Push your branch to GitHub and open a Pull Request.
6.  Address any feedback from maintainers.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
