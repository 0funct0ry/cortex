import type { Meta, StoryObj } from '@storybook/react'
import * as Icons from '@/components/ui/Icons'

// ---------------------------------------------------------------------------
// Gallery component
// ---------------------------------------------------------------------------

type IconComponent = React.FC<{ size?: number } & React.SVGProps<SVGSVGElement>>

function IconCatalog() {
  const entries = Object.entries(Icons) as [string, IconComponent][]

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-base)',
        minHeight: '100vh',
        padding: 32,
        fontFamily: 'var(--font-sans)',
      }}
    >
      <h1
        style={{
          color: 'var(--color-text-primary)',
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 8,
          marginTop: 0,
        }}
      >
        Icon Catalog
      </h1>
      <p
        style={{
          color: 'var(--color-text-muted)',
          fontSize: 12,
          marginBottom: 32,
          marginTop: 0,
        }}
      >
        {entries.length} icons · sourced from{' '}
        <code
          style={{
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'var(--color-bg-surface)',
            padding: '1px 4px',
            borderRadius: 3,
          }}
        >
          components/ui/Icons.tsx
        </code>
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: 8,
        }}
      >
        {entries.map(([name, Icon]) => (
          <div
            key={name}
            title={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '16px 8px',
              borderRadius: 6,
              border: '1px solid var(--color-border-subtle)',
              backgroundColor: 'var(--color-bg-panel)',
              cursor: 'default',
            }}
          >
            <Icon size={24} style={{ color: 'var(--color-text-primary)', flexShrink: 0 }} />
            <span
              style={{
                color: 'var(--color-text-muted)',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                textAlign: 'center',
                wordBreak: 'break-all',
                lineHeight: 1.3,
              }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Design System/Icon Catalog',
  component: IconCatalog,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof IconCatalog>

/**
 * Every named icon exported from `components/ui/Icons.tsx`, rendered at size 24
 * with its export name. The count in the subtitle reflects the true export count —
 * if an icon is missing here it is not exported from Icons.tsx.
 */
export const AllIcons: Story = {}
