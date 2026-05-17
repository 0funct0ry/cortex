import React, { useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { xml } from '@codemirror/lang-xml'
import { javascript } from '@codemirror/lang-javascript'
import { EditorView } from '@codemirror/view'
import { tags as t } from '@lezer/highlight'
import { createTheme } from '@uiw/codemirror-themes'
import { linter, lintGutter } from '@codemirror/lint'
import type { Diagnostic } from '@codemirror/lint'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: 'json' | 'xml' | 'javascript' | 'text'
  readOnly?: boolean
  autoFocus?: boolean
  wordWrap?: boolean
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  autoFocus = false,
  wordWrap = false,
}) => {
  const extensions = useMemo(() => {
    const exts = []
    if (wordWrap) {
      exts.push(EditorView.lineWrapping)
    }
    if (language === 'json') {
      exts.push(json())
      exts.push(
        linter((view) => {
          const diagnostics: Diagnostic[] = []
          const doc = view.state.doc.toString()
          if (!doc.trim()) return diagnostics
          try {
            JSON.parse(doc)
          } catch (e) {
            const err = e as Error
            let pos = 0
            const match = err.message.match(/at position (\d+)/)
            if (match) {
              pos = parseInt(match[1], 10)
            }
            diagnostics.push({
              from: Math.max(0, pos - 1),
              to: Math.min(doc.length, pos + 1),
              severity: 'error' as const,
              message: err.message,
            })
          }
          return diagnostics
        })
      )
      exts.push(lintGutter())
    }
    if (language === 'xml') {
      exts.push(xml())
      exts.push(
        linter((view) => {
          const diagnostics: Diagnostic[] = []
          const doc = view.state.doc.toString()
          if (!doc.trim()) return diagnostics
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(doc, 'application/xml')
          const errorNode = xmlDoc.querySelector('parsererror')
          if (errorNode) {
            diagnostics.push({
              from: 0,
              to: doc.length,
              severity: 'error' as const,
              message: errorNode.textContent || 'Invalid XML structure',
            })
          }
          return diagnostics
        })
      )
      exts.push(lintGutter())
    }
    if (language === 'javascript') {
      exts.push(javascript())
      exts.push(
        linter((view) => {
          const diagnostics: Diagnostic[] = []
          const doc = view.state.doc.toString()
          if (!doc.trim()) return diagnostics
          try {
            new Function(doc)
          } catch (e) {
            const err = e as Error
            diagnostics.push({
              from: 0,
              to: doc.length,
              severity: 'error' as const,
              message: err.message,
            })
          }
          return diagnostics
        })
      )
      exts.push(lintGutter())
    }

    // Custom theme logic based on CSS variables
    exts.push(
      EditorView.theme({
        '&': {
          height: '100%',
          backgroundColor: 'transparent !important',
        },
        '.cm-gutters': {
          backgroundColor: 'var(--color-bg-muted) !important',
          color: 'var(--color-text-muted) !important',
          border: 'none',
        },
        '.cm-activeLine': {
          backgroundColor: 'var(--color-bg-highlight) !important',
        },
        '.cm-cursor': {
          borderLeft: '1.5px solid var(--color-accent) !important',
        },
      })
    )

    return exts
  }, [language, wordWrap])

  const theme = useMemo(() => {
    return createTheme({
      theme: 'dark', // Base theme
      settings: {
        background: 'transparent',
        foreground: 'var(--color-text-primary)',
        caret: 'var(--color-accent)',
        selection: 'rgba(var(--color-accent), 0.3)',
        gutterBackground: 'var(--color-bg-muted)',
        gutterForeground: 'var(--color-text-muted)',
        lineHighlight: 'var(--color-bg-highlight)',
      },
      styles: [
        { tag: t.keyword, color: 'var(--color-syntax-keyword)' },
        { tag: t.string, color: 'var(--color-syntax-string)' },
        { tag: t.number, color: 'var(--color-syntax-number)' },
        { tag: t.comment, color: 'var(--color-syntax-comment)' },
        { tag: t.punctuation, color: 'var(--color-syntax-punctuation)' },
        { tag: t.propertyName, color: 'var(--color-syntax-property)' },
        { tag: t.variableName, color: 'var(--color-syntax-variable)' },
        { tag: t.typeName, color: 'var(--color-syntax-type)' },
        { tag: t.operator, color: 'var(--color-syntax-operator)' },
      ],
    })
  }, [])

  return (
    <CodeMirror
      value={value}
      height="100%"
      extensions={extensions}
      onChange={onChange}
      theme={theme}
      editable={!readOnly}
      autoFocus={autoFocus}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        searchKeymap: true,
      }}
    />
  )
}

export default CodeEditor
