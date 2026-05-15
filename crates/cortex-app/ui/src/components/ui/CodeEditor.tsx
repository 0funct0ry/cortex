import React, { useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { xml } from '@codemirror/lang-xml'
import { javascript } from '@codemirror/lang-javascript'
import { EditorView } from '@codemirror/view'
import { tags as t } from '@lezer/highlight'
import { createTheme } from '@uiw/codemirror-themes'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: 'json' | 'xml' | 'javascript' | 'text'
  readOnly?: boolean
  autoFocus?: boolean
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  autoFocus = false,
}) => {
  const extensions = useMemo(() => {
    const exts = []
    if (language === 'json') exts.push(json())
    if (language === 'xml') exts.push(xml())
    if (language === 'javascript') exts.push(javascript())

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
  }, [language])

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
