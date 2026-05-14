# Cortex GUI — Frontend

The frontend for Cortex is built with React 18, Tailwind CSS, and CodeMirror 6. It communicates with the Rust backend via Tauri IPC.

## Design System & Themes

Cortex uses a CSS custom property–based token system for all styling. This allows for deep theme customization and consistent semantic styling.

### Tokens

All semantic tokens are defined in `src/styles/tokens.css` and mapped to Tailwind utilities in `tailwind.config.ts`.

- **Backgrounds**: `bg-bg-base`, `bg-bg-panel`, `bg-bg-surface`, etc.
- **Text**: `text-text-primary`, `text-text-secondary`, `text-text-muted`, etc.
- **Borders**: `border-border-subtle`, `border-border-default`.
- **Accents**: `bg-accent`, `text-accent-fg`.
- **Status**: `text-success`, `bg-error-muted`, etc.

### Built-in Themes

Cortex includes 13 built-in themes:

- **Base**: `dark`, `light`
- **Catppuccin**: `mocha`, `macchiato`, `frappe`, `latte`
- **Other**: `nord`, `vscode-dark`, `vscode-light`
- **Monochrome**: `dark-monochrome`, `light-monochrome`
- **Pastel**: `dark-pastel`, `light-pastel`

### Theme Usage

Themes are applied via the `data-theme` attribute on the `<html>` element. The `ThemeContext` manages theme state and persistence.

```tsx
import { useTheme } from './contexts/ThemeContext'

const { theme, setTheme } = useTheme()
```

## Project Structure

The UI is organized into a modular component structure:

- `src/components/layout/`: Core structural components (TopNav, PanelShell, StatusBar).
- `src/components/ui/`: Reusable primitive components and icons.
- `src/contexts/`: React contexts for global state (Theme, etc.).
- `src/styles/`: Design tokens and theme definitions.

### Root Layout

The application uses a fixed-height grid layout:

- **TopNav (36px)**: Navigation, workspace management, and environment switching.
- **Main Content (flex-grow)**:
  - **Sidebar**: Resizable panel for collections and history.
  - **Content Area**:
    - **RequestTabBar (36px)**: Scoped request tabs.
    - **UrlBar (40px)**: Method selector and URL input.
    - **Editor Panels**: Side-by-side resizable Composer and Response areas.
- **StatusBar (22px)**: App metadata, search shortcut, and theme indicator.

Panel sizes are persisted to `localStorage` under keys `cortex.layout.main` and `cortex.layout.editor`.

## Development

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Setup

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint & Format

```bash
npm run lint
npm run format
```
