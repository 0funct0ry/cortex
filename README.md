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
- **Frontend**: React + TypeScript + Vite + Tailwind CSS in `crates/cortex-app/ui`.
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

### 🖥️ Professional IDE-Style GUI (Work in Progress)
Cortex is undergoing a complete GUI revamp (Epic 03a) to implement a high-performance, IDE-like desktop interface.
- **IDE-Style Layout**: A compact, three-column shell with resizable panes.
- **Workspace Home (Overview & Environments)**: A dedicated home view displayed when no request tabs are open, featuring a workspace-level tab bar with **Overview** and **Environments** tabs, plus a "+" button to open a new request tab. The Overview tab renders a two-panel layout: a left panel showing a live stats row (collection count and environment count) and, when zero collections are registered, a full empty-state screen with an illustration, "No collections yet" message, and the three primary CTAs; a right **Documentation** panel (380 px) that lets developers write and persist free-form workspace notes as Markdown, backed by localStorage and toggling between read and edit modes inline.
- **Workspace Overview & Open Collection**: Collection actions (Create, Open, Import) are surfaced both in the empty-state CTA buttons and via the sidebar. Opening a collection validates the folder contains a `cortex.yaml` manifest, prevents duplicates with sidebar focus and toast warnings, and records the collection in a per-workspace recent list.
- **Inline Collection Creation**: Create collections directly from the sidebar header or empty workspace view with an inline input field. Supports auto-generated default names (`Untitled Collection - N`), live validation of empty or duplicate names with interactive tooltips, physical directory creation, automatically generated `.gitignore`, and workspace registration with portable relative paths.
- **New Request Dialog**: A unified modal for creating requests of any protocol type, triggered from three entry points:
    - **Keyboard shortcut**: `Cmd+B` / `Ctrl+B` from anywhere in the app.
    - **Tab bar `+` button**: Opens the dialog with no pre-selected collection (choose via Options).
    - **Sidebar context menus**: Right-clicking a collection or folder node opens the dialog scoped to that target.
    - **"Add request" link**: The `+ Add request` link at the bottom of each expanded collection.
    The dialog presents five **Type** radio options in a grid — **HTTP**, **gRPC**, **From cURL**, **GraphQL**, **WebSocket** — and adapts its fields accordingly: HTTP and GraphQL show a color-coded method dropdown (defaulting to GET) plus a URL field; gRPC and WebSocket show only a URL field; From cURL replaces both with a multi-line textarea and an HTTP/GraphQL parse-as selector. The **Request Name** field is auto-focused on open, Enter submits when valid, and Escape dismisses without creating anything. An **Options ▸** disclosure toggle reveals a **Save to folder** dropdown listing all sub-folders within the target collection (defaulting to collection root). The **Create** button is disabled until the name field is non-empty; clicking it writes the `.crx` file to disk, refreshes the sidebar tree, and opens the new request in a composer tab. The **From cURL** path additionally parses the pasted command for URL, method, headers (`-H`), body (`-d`), and Basic auth (`-u`), pre-populating the request content automatically.
- **Collection, Folder & Request Context Menus** *(Story 06.01)*: Right-clicking (or clicking the `⋯` hover button) on any sidebar node opens a type-specific context menu with items grouped by creation, action, and danger zones, separated by visual dividers.

    **Collection node** (14 items + separators):
    1. **New Request** — opens the New Request dialog pre-scoped to the collection.
    2. **New Transient Request** (Cmd+B) — opens the transient/ephemeral request dialog.
    3. **New Quick Request** (Cmd+N) — opens an untitled request tab immediately.
    4. **New Folder** — inserts an inline-editable folder name field as the first child.
    5. **New JS File** — creates a `script.js` file in the collection directory and opens the collection view on the Script tab.
    6. **Run** — greyed out (Collection Runner coming in Story 06.10).
    7. **Clone** — full recursive copy of the collection into the same workspace directory with a `copy` suffix; appears in the sidebar immediately.
    8. **Rename** — inline name editing; confirmed with Enter, cancelled with Escape.
    9. **Share** — placeholder (coming in Story 06.11).
    10. **Generate Docs** — placeholder (coming in Story 06.12).
    11. **Collapse** — collapses the entire collection tree including nested folders; disabled when already collapsed.
    12. **Reveal in Finder / Reveal in Explorer** — opens the OS file manager at the collection directory.
    13. **Settings** — opens the collection view tab.
    14. **Open in Terminal** — opens the OS terminal cd'd to the collection directory.
    15. **Remove** — prompts for confirmation; unlinks the collection from the workspace without deleting files from disk.

    **Folder node** (14 items + separators):
    1–5. Same creation group as collection (New Request, New Transient Request, New Quick Request, New Folder, New JS File).
    6. **Run** — greyed out (coming in Story 06.10).
    7. **Clone** — deep recursive copy of the folder to a sibling with a `copy` suffix.
    8. **Copy** — copies the folder path to the internal clipboard for a subsequent paste operation.
    9. **Rename** — inline name editing.
    10. **Reveal in Finder / Reveal in Explorer** — opens the OS file manager at the folder path.
    11. **Info** — opens a read-only metadata panel showing path, size, created/modified timestamps, and request count.
    12. **Settings** — opens the folder settings panel.
    13. **Open in Terminal** — opens the OS terminal cd'd to the folder directory.
    14. **Delete** (red) — prompts for confirmation showing folder name and contained request count; permanently removes the folder from disk.

    **Request node** (8 items + separator):
    1. **Clone** — duplicates the `.crx` file with a `copy` suffix.
    2. **Copy** — copies the request path to the internal clipboard.
    3. **Rename** — inline name editing.
    4. **Generate Code** — placeholder (coming in Story 06.13).
    5. **Create Example** — placeholder (coming in Story 06.14).
    6. **Reveal in Finder / Reveal in Explorer** — opens the OS file manager at the request file.
    7. **Info** — opens a read-only metadata panel showing path, size, and timestamps.
    8. **Delete** (red) — prompts for confirmation showing request name; permanently removes the file from disk.

    **General behaviour**: The menu closes on Escape or click-outside. Full keyboard navigation (ArrowUp/ArrowDown, Enter, Escape). F2 while a sidebar node has keyboard focus activates inline rename. Disabled items are visually greyed out and skipped during keyboard navigation.
- **Collection View**: A dedicated multi-tab view for managing collection-wide defaults, opened as a pinned tab by clicking the gear icon (⚙) next to a collection in the sidebar. Each collection gets its own singleton tab (one per collection path) identified by the gear icon prefix in the tab bar. The view contains eleven tabs:
    - **Overview**: Edit the collection name inline, view the on-disk path, count of linked environments and requests, stub links for Share Collection and Generate Docs, and a Markdown documentation area with a live Preview toggle (rendered via `marked`).
    - **Headers**: A key-value table of default headers applied to all requests in the collection, powered by the same `KeyValueEditor` used in the request composer. Supports add, edit, disable (checkbox per row), delete, and Bulk Edit mode.
    - **Vars**: A table of collection-scoped variables with Name, Value, Secret (toggle), and Enabled (toggle) columns. Secret values are masked. Uses the existing `VariableEditor` component.
    - **Auth**: Selects the default authentication type (None, API Key, Bearer Token, Basic, Digest, OAuth 2.0, AWS SigV4) with the same credential sub-forms used on request Auth tabs. Auth configured here is inherited by all requests unless overridden at the request level.
    - **Script**: Pre-request and Post-response sub-tabs with CodeMirror 6 JavaScript editors. Collection-level scripts run for every request in the collection in addition to request-level scripts. The Run button is stubbed pending collection-level executor support.
    - **Tests**: A CodeMirror 6 test script editor. Tests defined here run after every response from any request in the collection. Includes a placeholder "Last run results" section for future collection-runner integration.
    - **Presets**: Named collections of headers or parameters that developers can define once at the collection level and apply to any request inside the request composer's Headers or Params tabs with automatic merging.
    - **Proxy**: Toggle and configure a collection-wide proxy override with URL, comma-separated bypass matching rules (e.g. `*.local`), and proxy basic authentication credentials.
    - **Client Certificates**: Load and register TLS client certificates (supporting PEM certificate + key files or PKCS#12 DER `.p12`/`.pfx` bundles) matching hostname wildcard patterns (e.g., `*.example.com`).
    - **Secrets**: A read-only audit log view of all variables marked as secrets in either the collection scope or active workspace environment scope, complete with unmasking on reveal request confirmation.
    - **Protobuf**: Add and manage custom `.proto` file paths and import directory paths for collection-level Protocol Buffer and gRPC message resolution.
    - **Auto-save**: Changes are auto-saved 500 ms after the last edit, or immediately on tab switch. A dirty indicator (●) appears on the tab label when there are unsaved changes. A manual Save button is always available.
- **Request Composer**: A central area with a color-coded method selector supporting all standard HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, TRACE) and fully custom verbs (e.g. `PURGE`, `LOCK`), URL input with variable highlighting, and a robust Send button.
- **Query Parameters & Headers Editors**: Dedicated key-value editors (under the "Params" and "Headers" composer tabs) featuring:
    - **Two-Way URL Sync & Encoding**: Real-time bi-directional synchronization between the query parameters table and the URL bar. Supports valueless flag parameters (e.g. `?flag`), explicitly empty parameters (e.g. `?key=`), and duplicate parameter keys (e.g. `?tag=a&tag=b`). Includes strict RFC 3986 percent-encoding while preserving raw `{{placeholder}}` variables in the URL input bar.
    - **Real-Time Resolved URL Preview Bar**: A premium, read-only preview bar displayed directly below the URL input bar at all times. It displays the fully resolved URL with variable interpolation evaluated, followed by strict RFC 3986 percent-encoding of all resolved keys and values, complete with a quick-copy action button.
    - **Real-Time Variable Highlights**: Color-coded borders (green for resolved, orange for unresolved, rose for dynamic) and `position: fixed` tooltips.
    - **Advanced Row Actions**: Drag-and-drop row reordering, multiselect (Shift/Cmd/Ctrl+click) batch deletions, soft duplicate key warnings, and a `Cmd+Z` / `Ctrl+Z` undo stack.
    - **Bulk Edit Mode**: Direct switching to bulk-text mode with raw string merging, `#` line-comment disabling, and detailed line-by-line validation errors.
    - **Header Autocomplete**: Autocomplete dropdown for common and collection-specific custom headers with keyboard arrow navigation.
- **Theme System**: Premium themes (Dark, Light, Catppuccin, etc.) implemented via CSS variables.
- **Core Layout**: Flexible tab management, sidebar tree navigation, and dedicated composer/response areas.
- **Dynamic Tab Bar**: Managed request tabs with horizontal scrolling, dirty state indicators (•), manual reordering, and a comprehensive right-click context menu.
- **Keyboard-First Design**: Native shortcuts for tab switching (Cmd+1-9), closing (Cmd+W), cycling (Cmd+Shift+[ / ]), new transient request dialog (Cmd+B), quick scratch tab (Cmd+N), environments (Cmd+E), sidebar toggle (Cmd+\\\\), and layout toggle (Cmd+Alt+L / Ctrl+Alt+L).
- **Transient Request Mode**: Create ephemeral, one-off requests that never touch disk — ideal for quick API exploration without cluttering saved collections.
    - **Cmd+B** opens a protocol-picker dialog (HTTP, GraphQL, gRPC, WebSocket, SSE) and creates a transient tab pre-configured for the chosen protocol.
    - **Cmd+N** instantly opens a transient HTTP GET tab without any dialog (fast path).
    - Transient tabs are visually distinct from saved tabs — their label is *italicised* and slightly muted.
    - Transient requests support the full feature set: variable interpolation, auth, pre/post scripts, and tests.
    - All transient requests are recorded in session history.
    - Transient tabs are not restored on app restart — they exist only for the current session.
    - A **"Save to Collection"** button (folder icon) appears in the URL bar for transient tabs. Clicking it opens a dialog to choose a name and target collection/folder, then converts the tab into a persisted `.crx` file.
    - Right-clicking a transient tab also exposes **"Save to Collection…"** in the context menu.
    - Collections and folders in the sidebar include a **"New Transient Request"** menu item alongside the existing "New Request" option.
- **Theme Picker**: Quick-access popover in the status bar for switching between 13 premium themes with instant live preview on hover.
- **Response Pane**: Professional panel for inspecting API responses, supporting side-by-side (horizontal) and stacked (vertical) layouts.
    - **Vertical/Horizontal Layout**: Toggle between a side-by-side split and stacked top-to-bottom layout dynamically using the layout button in the main application toolbar (next to the environment selector) or via the keyboard shortcut `Cmd+Alt+L` / `Ctrl+Alt+L`. The chosen layout is persisted across app restarts.
    - **Meta Bar**: Real-time display of status codes (color-coded), response time, and body size.
    - **Multi-View Tabs**: Switch between **Pretty** (syntax-highlighted, foldable), **Raw** (plain text), **Preview** (sandboxed HTML/SVG rendering), **Headers** (sorted, searchable), and **Visualize** (custom HTML/JS visualization) views. The **Visualize** tab appears only when the request has a post-response script defined.
    - **Pretty Mode Formatting**: Automatically indents and syntax-highlights JSON, HTML, and XML responses. Content-type is detected from the `Content-Type` header first; if absent or generic, the body is inspected. The detected format is shown as a badge in the toolbar. A dropdown lets you manually override the detected format at any time. Raw mode always shows the exact unmodified bytes.
    - **Preview Mode**: Renders `text/html` responses in a fully sandboxed iframe (`sandbox=""` — scripts, same-origin access, forms, and popups are all blocked). Renders `image/svg+xml` responses as an inline graphic via a blob-URL `<img>` element (SVG scripts cannot execute in this context). SVG is also detected from the response body when the `Content-Type` header is absent. For non-previewable types (JSON, plain text, binary, etc.) the pane shows the exact content-type received and directs the user to Pretty or Raw.
    - **Binary Response Handling**: Responses with binary or non-displayable content (images, PDFs, audio, etc.) show an info panel with the content type, body size, and a **Save to file** button that opens a native OS save dialog.
    - **Multipart Response Handling**: Responses with `multipart/mixed` or `multipart/form-data` Content-Type are automatically parsed into individual expandable sections. Each part has its own header and body display, utilizing the same auto-detection, tabbed viewing (Pretty/Raw/Preview/Headers), formatting, and downloading capabilities as standard responses. An indicator shows the total number of parts in the metadata bar. Malformed multipart boundaries fall back gracefully to the raw body display with a descriptive warning banner.
    - **Visualize Mode**: Renders a custom HTML/JavaScript page produced by a post-response script. The script calls `cortex.visualize.set(html)` to push an HTML string into the tab; on the next request send the tab re-renders from scratch. The visualization runs in a sandboxed iframe (`sandbox="allow-scripts"`) — JavaScript executes (enabling libraries like Chart.js, D3, or plain SVG charts) but the iframe has no access to the parent Tauri window, its storage, or its credentials. If the script throws, the Visualize tab shows the error message while all other tabs remain unaffected. When no `cortex.visualize.set()` call has been made yet, the tab displays a placeholder with a ready-to-copy code example.
    - **Intelligent Handling**: Automatic language detection, display limits for large payloads (> 5MB), and automatic tab switching to **Headers** for HEAD requests.
    - **Persistent State**: Per-request response tracking with quick actions for copying and saving. The selected response view tab (Pretty / Raw / Preview / Headers) is persisted per request in `localStorage` and restored when the app restarts.

## File Formats

### 📁 Core File Formats
- **Workspace Manifest (`cortex-workspace.yaml`)**: Groups multiple collections into a single organizational unit. Includes UI support for creating, switching, and persisting workspaces, with an IDE-style workspace picker that tracks recently opened projects.
- **Collection Manifest (`cortex.yaml`)**: Root configuration for a collection. Supports `name`, `description`, `auth`, `headers`, `variables`, `scripts` (pre/post-request), and `tests` fields.
- **Request Files (`.crx`)**: Standalone YAML files for individual API requests.
- **Folder Manifest (`folder.yaml`)**: Optional folder-level override file supporting shared parameters (e.g. inherited headers) across child items.
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
- **Header Key Interpolation**: Variable placeholders are completely evaluated inside HTTP header keys (supporting exact precedence matching and full uppercase names like `{{AUTH_HEADER}}`). Headers whose final resolved keys evaluate to empty strings are automatically stripped from outgoing requests, displaying distinct warnings in the live preview panel and run logs.
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
| `{{$uuid}}` | A random version 4 UUID | `123e4567-e89b-12d3-a456-426614174000` |
| `{{$randomFirstName}}` | A random, realistic first name | `Alexander` |
| `{{$randomLastName}}` | A random, realistic last name | `Montgomery` |
| `{{$randomEmail}}` | A random, realistic email address | `alexander.montgomery@example.com` |
| `{{$randomPhoneNumber}}` | A random phone number | `+1-555-0192` |
| `{{$randomUrl}}` | A random, plausible URL | `https://api.example.com/v1/users` |
| `{{$randomIPv4}}` | A random IPv4 address | `192.168.1.42` |
| `{{$randomBoolean}}` | A random boolean value (`true` or `false`) | `true` |
| `{{$randomLoremWord}}` | A random placeholder lorem ipsum word | `consectetur` |
| `{{$randomLoremSentence}}` | A random placeholder lorem ipsum sentence | `Lorem ipsum dolor sit amet.` |

**Precedence & Characteristics**
- **Case-Insensitive Matching**: All built-in dynamic variable keys are matched regardless of casing (e.g. `{{$UUID}}` and `{{$uuid}}` both resolve perfectly), ensuring maximum ergonomics.
- **Highest Precedence**: Intercepted at the start of resolution. If a custom variable shares the same name as a built-in dynamic variable, the dynamic engine takes precedence to guarantee deterministic scriptless output.
- **Per-Execution Freshness**: Generated on-the-fly during request segment rendering. Each segment rendering call yields a newly computed random sequence or time reading.
- **Request Execution Logging**: Evaluated runtime values are faithfully captured and logged in persistent request history logs (`history.json`), accessible via the composer's **Request Execution History** panel.
- **Discovery**: Automatically available in the composer's variable autocomplete picker dropdown, complete with a premium rose highlight token (`dynamic` scope).

#### 📦 Structured Variables (Arrays & Objects)

Cortex natively supports structured JSON arrays and objects as variable values, completely eliminating the need to manually serialise and parse complex payloads across multiple requests.

**Core Capabilities & Rules**
- **Native JSON Interpolation**: When interpolated into a JSON body field (e.g., `{"data": {{userPayload}}}`), an array or object variable is automatically serialised inline as valid unquoted JSON.
- **Stringified Interpolation**: When interpolated inside plain text, query parameters, headers, or inside double/single quotes (e.g., `{"data": "{{userPayload}}"}`), Cortex serialises the object or array as an escaped JSON string automatically.
- **Recursive Secret Masking**: If an object or array variable contains sensitive keys or references secret variables internally, Cortex recursively traverses the structure to mask those keys with `********` during UI previews and logging, while preserving full unmasked data in network transmissions.
- **JSON Input Mode**: In the **Variables** panel, click the **Code** icon toggle next to any variable to switch from standard string input to a full multi-line JSON editor. Cortex performs real-time syntax validation, providing inline error indicators to prevent saving invalid JSON structures.

**Example YAML Configuration**

```yaml
variables:
  # Structured Object Variable
  - name: defaultUser
    value:
      id: "usr_123"
      roles: ["admin", "editor"]
      preferences:
        theme: "dark"
    enabled: true

  # Structured Array Variable
  - name: targetIds
    value: [101, 102, 103, 104]
    enabled: true
```

#### 🌐 GraphQL Introspection Special Context Pipeline

Cortex implements a robust and consistent special operations pipeline dedicated to background tasks like GraphQL schema introspection. This ensures specialized workflows utilize a unified variable environment without side-effect risks.

**Key Architecture Rules**
- **Deduplicated Combined Sets**: Uses the exact same precedence hierarchy as standard requests (**Runtime → Environment → Collection → Global**) to construct a single resolved variable set.
- **Pre-execution Prerequisite Safety**: Evaluates all embedded placeholders in custom introspection endpoints and header lists prior to transmission. If any variable is missing or unresolvable in the active environment, Cortex automatically aborts network dispatch and displays an explicit, highly visible error alert identifying exactly what variables must be provided.
- **Strict Isolation**: Special operation pipelines execute in sandbox memory boundaries, ensuring evaluation state never writes back to persistent or session storage (`EphemeralStore`), protecting subsequent regular requests from unexpected variable leaks.
- **History Audit Trails**: Successful introspection operations commit their resolved URL, evaluated headers, HTTP response status, and runtime captured variables into the standard **Request Execution History** stream.
- **Trigger Consistency**: Delivers identical deterministic evaluation outcomes regardless of whether the schema retrieval is launched manually or automatically debounced upon editor modifications.

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

### Workspace-level Environment Management

Cortex includes a dedicated **Environments** screen accessible from the workspace tab bar, allowing you to manage all environment configurations in one place.

**Accessing the Environments screen:**
1. Open a workspace and click the **Environments** tab in the top tab bar (always visible alongside **Overview**).
2. The screen displays a two-column layout: a left sidebar listing all environments and a right panel for editing variables.

**Key features:**

| Feature | Description |
|---|---|
| **Create / Delete** | Click `+` to name a new environment; click the Trash icon in the editor to delete (with confirmation). |
| **Inline rename** | Click the ✏ pencil icon next to the environment name in the editor header; press Enter to confirm or Escape to cancel. The YAML file is renamed atomically on disk. |
| **Variable editor** | Name/Value/Secret columns. Tab from the last value field to append a new row. |
| **Secret masking** | Check the **Secret** checkbox to encrypt a variable at rest. The value is displayed as `••••••••`; click the 👁 eye button for temporary in-session reveal without changing the secret flag. |
| **Save / Reset** | **Save** persists changes to `environments/<name>.yaml` immediately. **Reset** reverts unsaved changes. A dot (●) in the sidebar and a highlight on the Save button indicate unsaved edits. |
| **Active environment** | Hover a row and click the ✓ to activate it for request execution. The active selection is persisted per workspace and restored on next launch. |
| **Global environment** | A fixed **Global** entry at the top of the sidebar holds app-level variables available in every workspace (stored in `~/Library/Application Support/cortex/global-environment.yaml`). |
| **Import / Export** | Use the ↓/↑ icons in the sidebar header to import an environment from a YAML file or export the selected environment to disk. |
| **.env file support** | The `.ENV FILES` section at the bottom of the sidebar lets you attach `.env` files. Their variables appear as **read-only** rows in the editor and are available for `{{variable}}` interpolation. A ⚠ badge appears if any key conflicts with the currently selected environment. |
| **Search** | The search box in the sidebar filters environments by name in real time. |

**Persistence details:**
- Each environment is stored as `<workspace-dir>/environments/<name>.yaml`.
- Secret values are AES-256 encrypted before being written to disk (prefix: `enc:AES256:`).
- `.env` file references are stored in the `env_files` field of `cortex-workspace.yaml`.
- The active environment is persisted per-workspace in browser localStorage and restored automatically on next launch.

Example `cortex-workspace.yaml` with environment file references:

```yaml
version: "1"
name: "My Project Workspace"
collections:
  - ./local-collection
env_files:
  - /home/user/projects/.env.local
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
