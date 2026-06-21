import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

// ---------------------------------------------------------------------------
// Token definitions — mirrors src/styles/tokens.css exactly
// ---------------------------------------------------------------------------

type TokenKind = 'color' | 'font-family' | 'font-size' | 'radius'

interface TokenDef {
  name: string
  kind: TokenKind
}

interface TokenCategory {
  label: string
  tokens: TokenDef[]
}

const CATEGORIES: TokenCategory[] = [
  {
    label: 'Background',
    tokens: [
      { name: '--color-bg-base', kind: 'color' },
      { name: '--color-bg-panel', kind: 'color' },
      { name: '--color-bg-surface', kind: 'color' },
      { name: '--color-bg-overlay', kind: 'color' },
      { name: '--color-bg-muted', kind: 'color' },
      { name: '--color-bg-highlight', kind: 'color' },
    ],
  },
  {
    label: 'Text',
    tokens: [
      { name: '--color-text-primary', kind: 'color' },
      { name: '--color-text-secondary', kind: 'color' },
      { name: '--color-text-muted', kind: 'color' },
      { name: '--color-text-inverse', kind: 'color' },
      { name: '--color-text-link', kind: 'color' },
    ],
  },
  {
    label: 'Border',
    tokens: [
      { name: '--color-border-subtle', kind: 'color' },
      { name: '--color-border-default', kind: 'color' },
      { name: '--color-border-strong', kind: 'color' },
    ],
  },
  {
    label: 'Accent',
    tokens: [
      { name: '--color-accent', kind: 'color' },
      { name: '--color-accent-hover', kind: 'color' },
      { name: '--color-accent-foreground', kind: 'color' },
    ],
  },
  {
    label: 'Status',
    tokens: [
      { name: '--color-success', kind: 'color' },
      { name: '--color-success-muted', kind: 'color' },
      { name: '--color-warning', kind: 'color' },
      { name: '--color-warning-muted', kind: 'color' },
      { name: '--color-error', kind: 'color' },
      { name: '--color-error-muted', kind: 'color' },
      { name: '--color-info', kind: 'color' },
      { name: '--color-info-muted', kind: 'color' },
    ],
  },
  {
    label: 'HTTP Methods',
    tokens: [
      { name: '--color-method-get', kind: 'color' },
      { name: '--color-method-post', kind: 'color' },
      { name: '--color-method-put', kind: 'color' },
      { name: '--color-method-patch', kind: 'color' },
      { name: '--color-method-delete', kind: 'color' },
      { name: '--color-method-head', kind: 'color' },
      { name: '--color-method-options', kind: 'color' },
      { name: '--color-method-ws', kind: 'color' },
      { name: '--color-method-sse', kind: 'color' },
      { name: '--color-method-grpc', kind: 'color' },
      { name: '--color-method-graphql', kind: 'color' },
      { name: '--color-method-trace', kind: 'color' },
    ],
  },
  {
    label: 'Syntax',
    tokens: [
      { name: '--color-syntax-keyword', kind: 'color' },
      { name: '--color-syntax-string', kind: 'color' },
      { name: '--color-syntax-number', kind: 'color' },
      { name: '--color-syntax-comment', kind: 'color' },
      { name: '--color-syntax-punctuation', kind: 'color' },
      { name: '--color-syntax-property', kind: 'color' },
      { name: '--color-syntax-variable', kind: 'color' },
      { name: '--color-syntax-type', kind: 'color' },
      { name: '--color-syntax-operator', kind: 'color' },
    ],
  },
  {
    label: 'Typography',
    tokens: [
      { name: '--font-sans', kind: 'font-family' },
      { name: '--font-mono', kind: 'font-family' },
      { name: '--font-size-xs', kind: 'font-size' },
      { name: '--font-size-sm', kind: 'font-size' },
      { name: '--font-size-base', kind: 'font-size' },
      { name: '--font-size-md', kind: 'font-size' },
    ],
  },
  {
    label: 'Shape',
    tokens: [
      { name: '--radius-sm', kind: 'radius' },
      { name: '--radius-md', kind: 'radius' },
      { name: '--radius-lg', kind: 'radius' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Hook — reads all computed token values and refreshes on theme change
// ---------------------------------------------------------------------------

function useTokenValues(tokenNames: string[]): Record<string, string> {
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    function read() {
      const style = getComputedStyle(document.documentElement)
      const next: Record<string, string> = {}
      for (const name of tokenNames) {
        next[name] = style.getPropertyValue(name).trim()
      }
      setValues(next)
    }

    read()

    // Re-read when the data-theme attribute changes (toolbar switch)
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [tokenNames.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  return values
}

// ---------------------------------------------------------------------------
// Swatch row components
// ---------------------------------------------------------------------------

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '4px 0',
      }}
    >
      <div
        title={value}
        style={{
          width: 24,
          height: 24,
          borderRadius: 4,
          backgroundColor: `var(${name})`,
          border: '1px solid var(--color-border-default)',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--color-text-primary)',
          flexGrow: 1,
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--color-text-muted)',
        }}
      >
        {value || '—'}
      </span>
    </div>
  )
}

function FontFamilySwatch({ name, value }: { name: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '4px 0',
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: `var(${name})`,
            fontSize: 14,
            color: 'var(--color-text-primary)',
            fontWeight: 600,
          }}
        >
          Aa
        </span>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--color-text-primary)',
          flexGrow: 1,
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontFamily: `var(${name})`,
          fontSize: 11,
          color: 'var(--color-text-muted)',
          maxWidth: 260,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value || '—'}
      </span>
    </div>
  )
}

function FontSizeSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '4px 0',
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: `var(${name})`,
            color: 'var(--color-text-primary)',
          }}
        >
          Aa
        </span>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--color-text-primary)',
          flexGrow: 1,
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--color-text-muted)',
        }}
      >
        {value || '—'}
      </span>
    </div>
  )
}

function RadiusSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '4px 0',
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: `var(${name})`,
          backgroundColor: 'var(--color-accent)',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--color-text-primary)',
          flexGrow: 1,
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--color-text-muted)',
        }}
      >
        {value || '—'}
      </span>
    </div>
  )
}

function TokenRow({ token, values }: { token: TokenDef; values: Record<string, string> }) {
  const value = values[token.name] ?? ''
  switch (token.kind) {
    case 'color':
      return <ColorSwatch name={token.name} value={value} />
    case 'font-family':
      return <FontFamilySwatch name={token.name} value={value} />
    case 'font-size':
      return <FontSizeSwatch name={token.name} value={value} />
    case 'radius':
      return <RadiusSwatch name={token.name} value={value} />
  }
}

// ---------------------------------------------------------------------------
// Top-level gallery component
// ---------------------------------------------------------------------------

const ALL_TOKEN_NAMES = CATEGORIES.flatMap((c) => c.tokens.map((t) => t.name))

function TokenGallery() {
  const values = useTokenValues(ALL_TOKEN_NAMES)

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
          marginBottom: 32,
          marginTop: 0,
        }}
      >
        Token Gallery
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: 32,
          alignItems: 'start',
        }}
      >
        {CATEGORIES.map((category) => (
          <section key={category.label}>
            <h2
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginTop: 0,
                marginBottom: 8,
                paddingBottom: 6,
                borderBottom: '1px solid var(--color-border-subtle)',
              }}
            >
              {category.label}
            </h2>
            {category.tokens.map((token) => (
              <TokenRow key={token.name} token={token} values={values} />
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Design System/Token Gallery',
  component: TokenGallery,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof TokenGallery>

/**
 * All 39 CSS design tokens rendered as named swatches, grouped by category.
 * Token values are read from the live document styles and update automatically
 * when the theme toolbar is switched.
 */
export const AllTokens: Story = {}
