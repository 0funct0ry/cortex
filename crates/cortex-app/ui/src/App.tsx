import { useTheme } from './contexts/ThemeContext'
import type { ThemeId } from './contexts/ThemeContext'

function App() {
  const { theme, setTheme } = useTheme()

  const themes: ThemeId[] = [
    'light',
    'light-monochrome',
    'light-pastel',
    'catppuccin-latte',
    'vscode-light',
    'dark',
    'dark-monochrome',
    'dark-pastel',
    'catppuccin-frappe',
    'catppuccin-macchiato',
    'catppuccin-mocha',
    'nord',
    'vscode-dark',
  ]

  return (
    <div className="min-h-screen bg-bg-base text-text-primary p-8 font-sans transition-colors duration-200">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Cortex Design System</h1>
        <p className="text-text-secondary">
          Current theme: <span className="font-mono text-accent">{theme}</span>
        </p>
      </header>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Theme Switcher</h2>
        <div className="flex flex-wrap gap-2">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1.5 rounded-md text-sm border transition-all ${
                theme === t
                  ? 'bg-accent text-accent-fg border-accent'
                  : 'bg-bg-surface text-text-primary border-border-default hover:border-accent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg bg-bg-surface border border-border-subtle shadow-sm">
          <h3 className="text-md font-medium mb-3">Color Tokens</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-accent" />
              <span className="text-sm">Accent</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-success" />
              <span className="text-sm">Success</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-warning" />
              <span className="text-sm">Warning</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-error" />
              <span className="text-sm">Error</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-bg-surface border border-border-subtle shadow-sm">
          <h3 className="text-md font-medium mb-3">Method Badges</h3>
          <div className="flex flex-wrap gap-2">
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
              <span
                key={m}
                className={`px-2 py-0.5 rounded-sm text-[10px] font-bold bg-method-${m.toLowerCase()}/12 text-method-${m.toLowerCase()} border border-method-${m.toLowerCase()}/20`}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-lg bg-bg-surface border border-border-subtle shadow-sm font-mono text-xs">
          <h3 className="text-md font-medium mb-3 font-sans">Syntax Preview</h3>
          <div>
            <span className="text-syntax-keyword">const</span>{' '}
            <span className="text-syntax-variable">message</span> ={' '}
            <span className="text-syntax-string">"Hello World"</span>;
          </div>
          <div>
            <span className="text-syntax-keyword">if</span> (
            <span className="text-syntax-variable">count</span>{' '}
            <span className="text-syntax-operator">&gt;</span>{' '}
            <span className="text-syntax-number">10</span>){' '}
            <span className="text-syntax-punctuation">{'{'}</span>
          </div>
          <div className="pl-4">
            <span className="text-syntax-variable">console</span>.
            <span className="text-syntax-property">log</span>(
            <span className="text-syntax-variable">message</span>);
          </div>
          <span className="text-syntax-punctuation">{'}'}</span>
        </div>
      </section>
    </div>
  )
}

export default App
