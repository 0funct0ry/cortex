import type { Meta, StoryObj } from '@storybook/react'
import MethodBadge from '@/components/ui/MethodBadge'

const THEMES: Array<{ id: string; label: string }> = [
  { id: 'dark', label: 'Dark' },
  { id: 'dark-monochrome', label: 'Dark Monochrome' },
  { id: 'dark-pastel', label: 'Dark Pastel' },
  { id: 'vscode-dark', label: 'VS Code Dark' },
  { id: 'catppuccin-frappe', label: 'Catppuccin Frappé' },
  { id: 'catppuccin-macchiato', label: 'Catppuccin Macchiato' },
  { id: 'catppuccin-mocha', label: 'Catppuccin Mocha' },
  { id: 'nord', label: 'Nord' },
  { id: 'light', label: 'Light' },
  { id: 'light-monochrome', label: 'Light Monochrome' },
  { id: 'light-pastel', label: 'Light Pastel' },
  { id: 'vscode-light', label: 'VS Code Light' },
  { id: 'catppuccin-latte', label: 'Catppuccin Latte' },
]

const COLOR_SWATCHES = [
  '--color-bg-panel',
  '--color-bg-surface',
  '--color-accent',
  '--color-error',
  '--color-success',
  '--color-info',
]

function ThemeTile({ id, label }: { id: string; label: string }) {
  return (
    <div
      data-theme={id}
      style={{
        backgroundColor: 'var(--color-bg-base)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 8,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minWidth: 0,
      }}
    >
      <span
        style={{
          color: 'var(--color-text-primary)',
          fontWeight: 600,
          fontSize: '0.75rem',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {label}
      </span>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {['GET', 'POST', 'DELETE', 'WS'].map((m) => (
          <MethodBadge key={m} method={m} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {COLOR_SWATCHES.map((v) => (
          <div
            key={v}
            title={v}
            style={{
              width: 16,
              height: 16,
              borderRadius: 3,
              backgroundColor: `var(${v})`,
              border: '1px solid var(--color-border-subtle)',
            }}
          />
        ))}
      </div>

      <div
        style={{
          color: 'var(--color-text-secondary)',
          fontSize: '0.7rem',
          fontFamily: 'var(--font-sans)',
        }}
      >
        Secondary text · <span style={{ color: 'var(--color-text-muted)' }}>Muted text</span>
      </div>
    </div>
  )
}

function ThemeGallery() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        padding: 24,
        maxWidth: 900,
      }}
    >
      {THEMES.map((t) => (
        <ThemeTile key={t.id} id={t.id} label={t.label} />
      ))}
    </div>
  )
}

const meta: Meta = {
  title: 'Design System/Theme Gallery',
  component: ThemeGallery,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof ThemeGallery>

/**
 * All 13 Cortex themes rendered simultaneously, each tile scoped by its own
 * `data-theme` attribute. A blank or unstyled tile indicates a missing theme
 * CSS file or incomplete token definition.
 */
export const AllThemes: Story = {}
