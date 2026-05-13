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

### Serialization Reliability
To ensure data integrity, Cortex includes a robust round-trip serialization test suite. Every core data structure (Requests, Collections, Environments, and Workspaces) is continuously tested to ensure it can be serialized to YAML and deserialized back without any data loss or corruption. These tests cover:
- **Unicode Support**: Ensures 🚀 and other non-ASCII characters are preserved.
- **Edge Cases**: Validates long strings, special characters in headers, and complex script content.
- **Secret Round-trips**: Verifies that encrypted variables are correctly handled through the serialization lifecycle.

## Releases

Download the latest version of Cortex and the CLI from the [GitHub Releases](https://github.com/0funct0ry/cortex/releases) page.

### Installation

- **macOS**: Download the `.dmg` file, open it, and drag Cortex to your Applications folder.
- **Windows**: Download the `.msi` file and run the installer.
- **Linux**: Choose your preferred format (`.deb`, `.rpm`, or `.AppImage`).
- **CLI**: The unified `cortex` binary can be found in the installation directory or downloaded separately. Add it to your PATH

## User Interface

### 🖥️ Professional UI Shell
Cortex features a high-performance, IDE-like desktop interface designed for speed and clarity.
- **Three-Region Layout**: A persistent top navigation bar, a collapsible left sidebar for collection exploration, and a central tabbed main area for request composition.
- **Tab Management**: Support for multiple open requests, with color-coded HTTP method badges (GET, POST, etc.) and scratch tabs for quick experimentation.
- **Fluid Interactions**: Smooth sidebar transitions with keyboard shortcut support (`⌘B` or `Ctrl+B`), glassmorphism effects, and micro-animations for a premium developer experience.

## File Formats

### 📁 Core File Formats
- **Workspace Manifest (`cortex-workspace.yaml`)**: Groups multiple collections into a single organizational unit. Includes UI support for creating, switching, and persisting workspaces.
- **Collection Manifest (`cortex.yaml`)**: Root configuration for a collection.
- **Request Files (`.crx`)**: Standalone YAML files for individual API requests.
- **Environments (`environments/*.yaml`)**: Environment-specific variables with support for encrypted secrets.

- Mark a variable as `secret: true` in any scope (Global, Collection, or Environment).
- Cortex encrypts the value using **AES-GCM-256** before saving to disk.
- Encrypted values are stored as `ENC(v1:...)` blobs.
- Values are automatically decrypted in memory for execution and when explicitly revealed in the UI.

### 📂 Collection Filesystem Layer
Cortex uses a direct filesystem-to-UI mapping for collections.
- **Immediate Save**: Changes in the app are written to disk immediately.
- **Tree Structure**: Folders and `.crx` files are mapped directly from the filesystem.
- **External Changes**: Cortex watches the filesystem for external changes and prompts for reload.
- **Trash Integration**: Deleting a request moves the file to the OS Trash.
- **Validation**: Invalid YAML or schema violations are flagged in the UI with detailed error messages.
- **Auto-generated `.gitignore`**: When a new collection or workspace is created, Cortex automatically initializes a `.gitignore` file with sensible defaults (like ignoring `.env` and `.cortex-ai.yaml`) to prevent accidental commits of local secrets and configuration.
- **Variable Precedence**: Variables from different scopes resolve in a predictable order: **Runtime → Environment → Collection → Global (Workspace)**. Highest precedence always wins; no merging occurs.

### 🧩 Variable & Template Engine
Cortex includes a powerful variable resolution pipeline and template engine.
- **Interpolation**: Use `{{variable_name}}` in request fields like URL, headers, and body.
- **Precedence Model**:
    1. **Session (Ephemeral / Runtime)**: In-memory variables that live only for the current app session — never written to disk (highest).
    2. **Environment**: Variables defined in the active environment file.
    3. **Collection**: Shared variables defined in the collection's `cortex.yaml`.
    4. **Global**: Workspace-wide variables defined in `cortex-workspace.yaml` (lowest).
- **Unified Management**: A dedicated "Variables" panel accessible from the sidebar and environment switcher provides a central place to manage variables at all scopes, including the **Session** tab (⚡ amber accent).
- **Secret Masking**: Support for marking any variable as a secret. Secret values are masked in the UI with `********` across the editor, request previews, and reports. Masked values can be toggled for visibility in the Variable Management panel. All secrets are stored with **AES-GCM-256** encryption at rest.
- **Enabled Toggles**: Easily enable or disable variables without deleting them to test different scenarios.
- **Prompt Variables**: Mark a collection or environment variable as a `prompt` type to ask the user for a value right before each collection run. The entered value is used for that run only and is never written to disk. An optional description/hint can be provided to guide the user.
- **Interactive Preview**: Hover over any variable chip in the request composer's resolved-preview row to see its resolved value and the source scope it came from.
- **Visual Warnings**: Unresolved variables are highlighted with amber chips and a wavy red underline in the composer preview row. Resolved variables appear as green chips.
- **Filter Syntax**: Use `{{variableName | default: 'fallback'}}` to substitute a fallback value when the variable is undefined. An empty-string variable is still considered defined and the fallback is not applied.
- **Nested Resolution**: Variable values can themselves contain `{{placeholders}}` which are resolved recursively up to **5 levels deep**.
- **Circular Reference Detection**: If a variable chain forms a cycle, Cortex emits a clear error (`<<circular: name>>`) and stops recursing rather than looping infinitely.
- **Syntax Error Reporting**: Malformed placeholders (e.g., unclosed `{{`) are flagged inline in the composer preview row with a red badge and a descriptive error message beneath the field.

#### ⚡ Session (Ephemeral) Variables
Session variables are held exclusively in memory and are **never written to disk**. They are cleared automatically when the app is closed or restarted, making them ideal for short-lived tokens, one-off overrides, or any sensitive value you do not want persisted.

| Property | Behaviour |
|---|---|
| **Scope** | Runtime — highest precedence, overrides all other scopes |
| **Persistence** | None — cleared on app exit |
| **Encryption** | Not applicable (never stored) |
| **Secrets** | Supported — masked with `********` in all previews |
| **UI accent** | Amber / ⚡ Zap icon in the Variables panel |

**Creating session variables via the UI**

1. Open the **Variables** panel (sidebar → globe icon, or the environment pill in the toolbar).
2. Select the **Session** tab (⚡ amber).
3. Add rows, set names, values, and optionally toggle **Secret**.
4. Click **Apply to Session** — variables are stored in the backend process immediately.

**Script API**

Pre- and post-request scripts can read and write session variables through the Tauri IPC layer:

```typescript
// Upsert a single session variable (e.g. from a post-response script)
await commands.setEphemeralVariable("access_token", responseBody.token, /* secret */ true);

// Remove a session variable by name
await commands.removeEphemeralVariable("access_token");

// Replace the entire session variable set atomically
await commands.setEphemeralVariables([
  { name: "access_token", value: "…", secret: true, enabled: true },
]);

// Read all current session variables
const vars = await commands.getEphemeralVariables();
```

Session variables set by scripts are immediately visible to all subsequent requests and to `preview_template` / `get_resolved_variables` without any page reload.

#### 🎯 Prompt Variables

Prompt variables allow collection authors to define variables that ask the user for a value at the start of each collection run, without requiring edits to environment files beforehand.

| Property | Behaviour |
|---|---|
| **Scope** | Collection or Environment (defined in manifest) |
| **Resolved scope** | Runtime — injected into the Session scope before the run |
| **Persistence** | None — values are never saved to disk |
| **Default value** | The `value` field pre-fills the input in the dialog |
| **Description** | Optional hint shown beneath the input in the dialog |
| **UI accent** | Indigo / Terminal icon in the Variables panel |

**Defining a prompt variable in the Variables panel**

1. Open the **Variables** panel and switch to the **Collection** or **Environment** tab.
2. Add a variable (or select an existing one).
3. Click the **Terminal** (Prompt) toggle in the **Prompt** column. The row gains an indigo left stripe.
4. Optionally fill in a hint in the **Description** field that appears below the name.
5. Set a `value` to pre-fill the dialog with a default (the user can override it).
6. Click **Save Changes**.

**Defining a prompt variable in YAML**

```yaml
# Inside cortex.yaml (collection) or an environment file
variables:
  - name: DEPLOY_ENV
    value: staging          # pre-filled default shown in the dialog
    prompt: true
    description: "Which environment should this deployment target?"
    enabled: true
  - name: API_VERSION
    value: ""               # no default — user must enter a value
    prompt: true
    description: "e.g. v2 or v3"
    enabled: true
```

**Running a collection with prompt variables**

1. Hover over the collection name in the sidebar.
2. Click the **Play** icon (indigo on hover) — the pre-run Prompt Variables dialog appears.
3. Review each variable name and hint, then enter the desired values.
4. Click **Start Run** (or press Enter). Values are injected into the Session scope and the run proceeds.
5. If any required field (no default) is left blank, the dialog highlights it with an error and blocks the run.
6. Press **Escape** to cancel without starting the run.

**CLI usage — non-interactive mode**

In CLI mode, supply prompt variable values via the repeatable `--env-var` flag:

```bash
cortex run --request my-request \
  --env-var DEPLOY_ENV=production \
  --env-var API_VERSION=v3
```

- Values are accepted in `KEY=VALUE` form; the first `=` is the delimiter, so values may contain `=`.
- If a prompt variable has no default and is not supplied via `--env-var`, the CLI exits with a descriptive error listing the missing variables.

#### 🎲 Dynamic Variables

Cortex provides a set of built-in dynamic variables out of the box that generate fresh values each time a request is sent. This enables injecting unique identifiers, timestamps, and random values into requests without writing external setup scripts.

| Dynamic Variable | Output Description | Example Value |
|---|---|---|
| `{{$randomInt}}` | A random integer between 0 and 1000 | `427` |
| `{{$timestamp}}` | The current Unix timestamp in seconds | `1778648123` |
| `{{$isoTimestamp}}` | The current date and time in ISO 8601 format | `2026-05-13T03:55:00Z` |
| `{{$randomNanoId}}` | A unique, URL-safe short alphanumeric identifier | `V1StGXR8_Z5jdHi6B-myT` |

**Precedence & Characteristics**
- **Highest Precedence**: Intercepted at the start of resolution. If a custom variable shares the same name as a built-in dynamic variable, the dynamic engine takes precedence to guarantee deterministic scriptless output.
- **Per-Execution Freshness**: Generated on-the-fly during request segment rendering. Each segment rendering call yields a newly computed random sequence or time reading.
- **Request Execution Logging**: Evaluated runtime values are faithfully captured and logged in persistent request history logs (`history.json`), accessible via the composer's **Request Execution History** panel.
- **Discovery**: Automatically available in the composer's variable autocomplete picker dropdown, complete with a premium rose highlight token (`dynamic` scope).

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

### Workspace Manifest (`cortex-workspace.yaml`)

A workspace allows you to group multiple collections, potentially from different repositories or directories, into a single project view.
- **Group Collections**: Organize related collections together.
- **Persistence**: Workspace state and paths are persisted across sessions.
- **Local Isolation**: Workspace manifests are typically local-only artifacts and are ignored by Git via the auto-generated `.gitignore`.

Example `cortex-workspace.yaml` file:

```yaml
version: "1"
name: "My Project Workspace"
collections:
  - ./local-collection
  - ../another-repo/some-collection
  - /absolute/path/to/a/collection
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
