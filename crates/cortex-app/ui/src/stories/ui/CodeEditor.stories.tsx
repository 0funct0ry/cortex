import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import CodeEditor from '@/components/ui/CodeEditor'

const meta: Meta<typeof CodeEditor> = {
  title: 'ui/CodeEditor',
  component: CodeEditor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A CodeMirror-based code editor with syntax highlighting, linting, and variable auto-complete. Supports JSON, YAML, JavaScript, Markdown, XML, HTML, and plain text.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px', display: 'flex', flexDirection: 'column', padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    value: '',
    onChange: fn(),
    language: 'json',
    readOnly: false,
    autoFocus: false,
    wordWrap: false,
  },
  argTypes: {
    language: {
      control: 'select',
      options: ['json', 'yaml', 'javascript', 'markdown', 'xml', 'html', 'text'],
      description: 'Syntax highlighting language',
    },
    readOnly: {
      control: 'boolean',
      description: 'When true the editor is non-interactive',
    },
    wordWrap: {
      control: 'boolean',
      description: 'Wrap long lines instead of scrolling horizontally',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Focus the editor on mount',
    },
    value: {
      control: 'text',
      description: 'Current editor content',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * JsonEditable — JSON mode with syntax highlighting and real-time linting.
 * Invalid JSON surfaces an inline error gutter marker.
 */
export const JsonEditable: Story = {
  args: {
    language: 'json',
    value: JSON.stringify(
      {
        name: 'Cortex API',
        version: '1.0.0',
        endpoints: [
          { method: 'GET', path: '/users', description: 'List all users' },
          { method: 'POST', path: '/users', description: 'Create a user' },
        ],
      },
      null,
      2
    ),
  },
}

/**
 * YamlEditable — YAML mode suitable for environment files, OpenAPI specs, and .crx collection bundles.
 */
export const YamlEditable: Story = {
  args: {
    language: 'yaml',
    value: `name: my-collection
version: "1"
requests:
  - name: Get Users
    method: GET
    url: "{{base_url}}/users"
    headers:
      Authorization: "Bearer {{token}}"
`,
  },
}

/**
 * JavaScriptEditable — JavaScript mode for pre-request and post-response scripts.
 * Syntax errors are flagged inline.
 */
export const JavaScriptEditable: Story = {
  args: {
    language: 'javascript',
    value: `// Pre-request script
const token = pm.environment.get("token");
if (!token) {
  throw new Error("token variable is not set");
}
pm.request.headers.add({ key: "Authorization", value: \`Bearer \${token}\` });
`,
  },
}

/**
 * MarkdownEditable — Markdown mode for documentation panels and request descriptions.
 */
export const MarkdownEditable: Story = {
  args: {
    language: 'markdown',
    value: `# Users API

Manages user accounts for the application.

## Endpoints

| Method | Path    | Description    |
|--------|---------|----------------|
| GET    | /users  | List all users |
| POST   | /users  | Create a user  |

> **Note:** All endpoints require Bearer authentication.
`,
  },
}

/**
 * XmlEditable — XML mode with parse-error linting. Useful for SOAP body payloads.
 */
export const XmlEditable: Story = {
  args: {
    language: 'xml',
    value: `<?xml version="1.0" encoding="UTF-8"?>
<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
  <Header>
    <Auth>
      <Token>{{token}}</Token>
    </Auth>
  </Header>
  <Body>
    <GetUsers>
      <page>1</page>
      <limit>25</limit>
    </GetUsers>
  </Body>
</Envelope>`,
  },
}

/**
 * HtmlEditable — HTML mode for response-preview body editing.
 */
export const HtmlEditable: Story = {
  args: {
    language: 'html',
    value: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>API Response Preview</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>Response rendered inline.</p>
</body>
</html>`,
  },
}

/**
 * ReadOnly — editor is non-interactive; used in response viewers and history panels.
 * The cursor is hidden and no editing keystrokes are accepted.
 */
export const ReadOnly: Story = {
  args: {
    language: 'json',
    readOnly: true,
    value: JSON.stringify({ status: 200, message: 'OK', data: { id: 42 } }, null, 2),
  },
}

/**
 * WithVariableAutoComplete — typing `{{` triggers an autocomplete dropdown showing
 * all resolved variables from the active environment.
 * Try typing `{{` inside the editor to see completions.
 */
export const WithVariableAutoComplete: Story = {
  args: {
    language: 'json',
    value: '{\n  "url": "{{base_url}}/users",\n  "token": "{{token}}"\n}',
    resolvedVariables: {
      base_url: {
        value: 'https://api.example.com',
        scope: 'environment',
        secret: false,
        description: null,
      },
      token: {
        value: 'eyJhbGciOiJIUzI1NiJ9...',
        scope: 'environment',
        secret: false,
        description: null,
      },
      timestamp: {
        value: '1718000000',
        scope: 'dynamic',
        secret: false,
        description: 'Unix timestamp in seconds',
      },
    },
  },
}

/**
 * WithWordWrap — long lines wrap at the editor boundary instead of adding a horizontal scrollbar.
 * Useful for minified JSON responses.
 */
export const WithWordWrap: Story = {
  args: {
    language: 'json',
    wordWrap: true,
    value:
      '{"very_long_key_one":"very_long_value_one_that_extends_past_the_container_boundary","very_long_key_two":"another_very_long_value_that_also_extends_far_to_the_right_of_the_editor_container"}',
  },
}
