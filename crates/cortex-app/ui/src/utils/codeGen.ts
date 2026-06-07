export type CodeLang = 'curl' | 'fetch' | 'python' | 'go' | 'rust'

export interface ResolvedRequest {
  method: string
  url: string
  headers: Record<string, string>
  queryParams: Record<string, string>
  bodyType: 'none' | 'json' | 'form-data' | 'url-encoded' | 'raw' | 'file'
  bodyJson: string
  bodyRaw: string
  bodyRawSubtype: string
  formFields: { key: string; value: string; isFile: boolean; filePath: string }[]
  urlEncodedFields: { key: string; value: string }[]
  bodyFilePath: string | null
}

export function resolveVariables(template: string, vars: Record<string, string>): string {
  return template.replace(
    /\{\{([^}]+)\}\}/g,
    (_, name) => vars[name.trim()] ?? `{{${name.trim()}}}`
  )
}

export function generateCode(lang: CodeLang, req: ResolvedRequest): string {
  switch (lang) {
    case 'curl':
      return generateCurl(req)
    case 'fetch':
      return generateFetch(req)
    case 'python':
      return generatePython(req)
    case 'go':
      return generateGo(req)
    case 'rust':
      return generateRust(req)
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildUrl(url: string, params: Record<string, string>): string {
  const entries = Object.entries(params)
  if (entries.length === 0) return url
  const qs = entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
  return `${url}${url.includes('?') ? '&' : '?'}${qs}`
}

function inferContentType(req: ResolvedRequest): string | null {
  if ('content-type' in req.headers || 'Content-Type' in req.headers) return null
  switch (req.bodyType) {
    case 'json':
      return 'application/json'
    case 'url-encoded':
      return 'application/x-www-form-urlencoded'
    case 'raw': {
      const map: Record<string, string> = {
        html: 'text/html',
        xml: 'application/xml',
        javascript: 'application/javascript',
        text: 'text/plain',
        other: 'text/plain',
      }
      return map[req.bodyRawSubtype] ?? 'text/plain'
    }
    default:
      return null
  }
}

function allHeaders(req: ResolvedRequest): Record<string, string> {
  const ct = inferContentType(req)
  if (ct) return { 'Content-Type': ct, ...req.headers }
  return req.headers
}

// ── cURL ──────────────────────────────────────────────────────────────────────

function generateCurl(req: ResolvedRequest): string {
  const parts: string[] = ['curl']
  const method = req.method.toUpperCase()
  if (method !== 'GET') parts.push(`-X ${method}`)

  const fullUrl = buildUrl(req.url, req.queryParams)
  parts.push(`"${fullUrl}"`)

  const headers = allHeaders(req)
  for (const [k, v] of Object.entries(headers)) {
    parts.push(`-H "${k}: ${v}"`)
  }

  switch (req.bodyType) {
    case 'json':
      parts.push(`--data-raw '${req.bodyJson.replace(/'/g, "'\\''")}'`)
      break
    case 'raw':
      parts.push(`--data-raw '${req.bodyRaw.replace(/'/g, "'\\''")}'`)
      break
    case 'url-encoded':
      for (const f of req.urlEncodedFields) {
        parts.push(`--data-urlencode "${f.key}=${f.value}"`)
      }
      break
    case 'form-data':
      for (const f of req.formFields) {
        if (f.isFile) {
          parts.push(`-F "${f.key}=@${f.filePath}"`)
        } else {
          parts.push(`-F "${f.key}=${f.value}"`)
        }
      }
      break
    case 'file':
      parts.push(`--data-binary "@${req.bodyFilePath ?? 'FILE_PATH'}"`)
      break
  }

  return parts.join(' \\\n  ')
}

// ── JavaScript fetch ──────────────────────────────────────────────────────────

function generateFetch(req: ResolvedRequest): string {
  const method = req.method.toUpperCase()
  const fullUrl = buildUrl(req.url, req.queryParams)
  const headers = allHeaders(req)

  // Wrap in an async IIFE so `await` is valid in all JS environments and
  // passes the CodeEditor's `new Function()` syntax check.
  const body: string[] = []

  // FormData fields come first, before the fetch call
  if (req.bodyType === 'form-data') {
    body.push(`  const formData = new FormData();`)
    for (const f of req.formFields) {
      if (f.isFile) {
        body.push(`  formData.append("${f.key}", file); // replace 'file' with a File/Blob`)
      } else {
        body.push(`  formData.append("${f.key}", "${f.value}");`)
      }
    }
    body.push(``)
  }

  body.push(`  const response = await fetch("${fullUrl}", {`)
  if (method !== 'GET') body.push(`    method: "${method}",`)

  // For form-data, omit Content-Type — the browser sets it with the correct boundary
  const headerEntries = Object.entries(headers).filter(
    ([k]) => req.bodyType !== 'form-data' || k.toLowerCase() !== 'content-type'
  )
  if (headerEntries.length > 0) {
    body.push(`    headers: {`)
    for (const [k, v] of headerEntries) {
      body.push(`      "${k}": "${v}",`)
    }
    body.push(`    },`)
  }

  switch (req.bodyType) {
    case 'json':
      body.push(`    body: JSON.stringify(${req.bodyJson || '{}'}),`)
      break
    case 'raw':
      body.push(`    body: \`${req.bodyRaw}\`,`)
      break
    case 'url-encoded': {
      const pairs = req.urlEncodedFields
        .map((f) => `      ${JSON.stringify(f.key)}: ${JSON.stringify(f.value)},`)
        .join('\n')
      body.push(`    body: new URLSearchParams({`)
      if (pairs) body.push(pairs)
      body.push(`    }),`)
      break
    }
    case 'form-data':
      body.push(`    body: formData,`)
      break
    case 'file':
      body.push(`    // body: fileContent, // read your file and provide its content here`)
      break
  }

  body.push(`  });`)
  body.push(``)
  body.push(`  const data = await response.json();`)
  body.push(`  console.log(data);`)

  return `(async () => {\n${body.join('\n')}\n})();`
}

// ── Python requests ───────────────────────────────────────────────────────────

function generatePython(req: ResolvedRequest): string {
  const method = req.method.toLowerCase()
  const fullUrl = buildUrl(req.url, req.queryParams)
  const headers = allHeaders(req)

  const lines: string[] = ['import requests', '']

  const headerEntries = Object.entries(headers)
  if (headerEntries.length > 0) {
    lines.push(`headers = {`)
    for (const [k, v] of headerEntries) {
      lines.push(`    "${k}": "${v}",`)
    }
    lines.push(`}`)
    lines.push(``)
  }

  const callArgs: string[] = [`"${fullUrl}"`]
  if (headerEntries.length > 0) callArgs.push(`headers=headers`)

  switch (req.bodyType) {
    case 'json':
      lines.push(`payload = ${req.bodyJson || '{}'}`)
      lines.push(``)
      callArgs.push(`json=payload`)
      break
    case 'raw':
      lines.push(`payload = """${req.bodyRaw}"""`)
      lines.push(``)
      callArgs.push(`data=payload`)
      break
    case 'url-encoded': {
      lines.push(`data = {`)
      for (const f of req.urlEncodedFields) {
        lines.push(`    "${f.key}": "${f.value}",`)
      }
      lines.push(`}`)
      lines.push(``)
      callArgs.push(`data=data`)
      break
    }
    case 'form-data': {
      const hasFiles = req.formFields.some((f) => f.isFile)
      if (hasFiles) {
        lines.push(`files = {`)
        for (const f of req.formFields) {
          if (f.isFile) {
            lines.push(`    "${f.key}": open("${f.filePath}", "rb"),`)
          }
        }
        lines.push(`}`)
        const textFields = req.formFields.filter((f) => !f.isFile)
        if (textFields.length > 0) {
          lines.push(`data = {`)
          for (const f of textFields) {
            lines.push(`    "${f.key}": "${f.value}",`)
          }
          lines.push(`}`)
          callArgs.push(`files=files`, `data=data`)
        } else {
          callArgs.push(`files=files`)
        }
      } else {
        lines.push(`data = {`)
        for (const f of req.formFields) {
          lines.push(`    "${f.key}": "${f.value}",`)
        }
        lines.push(`}`)
        callArgs.push(`data=data`)
      }
      lines.push(``)
      break
    }
    case 'file':
      lines.push(`# Open and pass the file content as the request body`)
      lines.push(`with open("FILE_PATH", "rb") as f:`)
      lines.push(`    response = requests.${method}(${callArgs.join(', ')}, data=f)`)
      lines.push(`    print(response.json())`)
      return lines.join('\n')
  }

  lines.push(`response = requests.${method}(${callArgs.join(', ')})`)
  lines.push(`print(response.json())`)

  return lines.join('\n')
}

// ── Go net/http ───────────────────────────────────────────────────────────────

function generateGo(req: ResolvedRequest): string {
  const method = req.method.toUpperCase()
  const fullUrl = buildUrl(req.url, req.queryParams)
  const headers = allHeaders(req)

  // ── multipart/form-data: use mime/multipart ────────────────────────────────
  if (req.bodyType === 'form-data') {
    const hasFiles = req.formFields.some((f) => f.isFile)
    const imports = ['"bytes"', '"fmt"', '"io"', '"mime/multipart"', '"net/http"']
    if (hasFiles) imports.push('"os"')
    imports.sort()

    const lines: string[] = [
      `package main`,
      ``,
      `import (`,
      ...imports.map((i) => `\t${i}`),
      `)`,
      ``,
      `func main() {`,
      `\tvar buf bytes.Buffer`,
      `\tw := multipart.NewWriter(&buf)`,
      ``,
    ]

    let fileIdx = 0
    for (const f of req.formFields) {
      if (f.isFile) {
        const fname = f.filePath.split('/').pop() || f.filePath
        lines.push(`\tfile${fileIdx}, _ := os.Open(${JSON.stringify(f.filePath)})`)
        lines.push(`\tdefer file${fileIdx}.Close()`)
        lines.push(
          `\tfw${fileIdx}, _ := w.CreateFormFile(${JSON.stringify(f.key)}, ${JSON.stringify(fname)})`
        )
        lines.push(`\t_, _ = io.Copy(fw${fileIdx}, file${fileIdx})`)
        fileIdx++
      } else {
        lines.push(`\t_ = w.WriteField(${JSON.stringify(f.key)}, ${JSON.stringify(f.value)})`)
      }
      lines.push(``)
    }

    lines.push(`\tw.Close()`)
    lines.push(``)
    lines.push(
      `\treq, err := http.NewRequest(${JSON.stringify(method)}, ${JSON.stringify(fullUrl)}, &buf)`
    )
    lines.push(`\tif err != nil {`)
    lines.push(`\t\tpanic(err)`)
    lines.push(`\t}`)
    lines.push(`\treq.Header.Set("Content-Type", w.FormDataContentType())`)

    // Add user headers, skipping Content-Type (boundary must come from the writer)
    for (const [k, v] of Object.entries(headers)) {
      if (k.toLowerCase() !== 'content-type') {
        lines.push(`\treq.Header.Add(${JSON.stringify(k)}, ${JSON.stringify(v)})`)
      }
    }

    lines.push(``)
    lines.push(`\tclient := &http.Client{}`)
    lines.push(`\tres, err := client.Do(req)`)
    lines.push(`\tif err != nil {`)
    lines.push(`\t\tpanic(err)`)
    lines.push(`\t}`)
    lines.push(`\tdefer res.Body.Close()`)
    lines.push(``)
    lines.push(`\tbody, _ := io.ReadAll(res.Body)`)
    lines.push(`\tfmt.Println(string(body))`)
    lines.push(`}`)

    return lines.join('\n')
  }

  // ── all other body types ───────────────────────────────────────────────────
  const lines: string[] = [
    `package main`,
    ``,
    `import (`,
    `\t"fmt"`,
    `\t"io"`,
    `\t"net/http"`,
    `\t"strings"`,
    `)`,
    ``,
    `func main() {`,
  ]

  switch (req.bodyType) {
    case 'none':
    case 'file':
      lines.push(`\tbody := strings.NewReader("")`)
      break
    case 'json':
      lines.push(`\tbody := strings.NewReader(\`${req.bodyJson || '{}'}\`)`)
      break
    case 'raw':
      lines.push(`\tbody := strings.NewReader(\`${req.bodyRaw}\`)`)
      break
    case 'url-encoded': {
      const encoded = req.urlEncodedFields
        .map((f) => `${encodeURIComponent(f.key)}=${encodeURIComponent(f.value)}`)
        .join('&')
      lines.push(`\tbody := strings.NewReader("${encoded}")`)
      break
    }
  }

  lines.push(``)
  lines.push(`\treq, err := http.NewRequest("${method}", "${fullUrl}", body)`)
  lines.push(`\tif err != nil {`)
  lines.push(`\t\tpanic(err)`)
  lines.push(`\t}`)

  for (const [k, v] of Object.entries(headers)) {
    lines.push(`\treq.Header.Add("${k}", "${v}")`)
  }

  lines.push(``)
  lines.push(`\tclient := &http.Client{}`)
  lines.push(`\tres, err := client.Do(req)`)
  lines.push(`\tif err != nil {`)
  lines.push(`\t\tpanic(err)`)
  lines.push(`\t}`)
  lines.push(`\tdefer res.Body.Close()`)
  lines.push(``)
  lines.push(`\tb, _ := io.ReadAll(res.Body)`)
  lines.push(`\tfmt.Println(string(b))`)
  lines.push(`}`)

  return lines.join('\n')
}

// ── Rust reqwest ──────────────────────────────────────────────────────────────

function generateRust(req: ResolvedRequest): string {
  const method = req.method.toLowerCase()
  const fullUrl = buildUrl(req.url, req.queryParams)
  const headers = allHeaders(req)

  // ── multipart/form-data: use reqwest::multipart ────────────────────────────
  if (req.bodyType === 'form-data') {
    // Content-Type is set automatically by reqwest when using .multipart()
    const extraHeaders = Object.entries(headers).filter(([k]) => k.toLowerCase() !== 'content-type')

    const lines: string[] = [
      `use reqwest::multipart;`,
      `use reqwest::header::{HeaderMap, HeaderValue};`,
      ``,
      `#[tokio::main]`,
      `async fn main() -> Result<(), Box<dyn std::error::Error>> {`,
      `    let client = reqwest::Client::new();`,
      ``,
    ]

    // Build multipart form: chain .text() fields, then await .file() fields
    const textFields = req.formFields.filter((f) => !f.isFile)
    const fileFields = req.formFields.filter((f) => f.isFile)

    if (textFields.length > 0) {
      const formLines: string[] = [`    let mut form = multipart::Form::new()`]
      for (const f of textFields) {
        formLines.push(`        .text(${JSON.stringify(f.key)}, ${JSON.stringify(f.value)})`)
      }
      formLines[formLines.length - 1] += ';'
      lines.push(...formLines)
    } else {
      lines.push(`    let mut form = multipart::Form::new();`)
    }

    for (const f of fileFields) {
      lines.push(
        `    form = form.file(${JSON.stringify(f.key)}, ${JSON.stringify(f.filePath)}).await?;`
      )
    }
    lines.push(``)

    if (extraHeaders.length > 0) {
      lines.push(`    let mut headers = HeaderMap::new();`)
      for (const [k, v] of extraHeaders) {
        lines.push(
          `    headers.insert(${JSON.stringify(k)}, HeaderValue::from_static(${JSON.stringify(v)}));`
        )
      }
      lines.push(``)
    }

    const builderParts: string[] = [
      `    let response = client.${method}(${JSON.stringify(fullUrl)})`,
    ]
    if (extraHeaders.length > 0) builderParts.push(`        .headers(headers)`)
    builderParts.push(`        .multipart(form)`)
    builderParts.push(`        .send()`)
    builderParts.push(`        .await?;`)
    lines.push(...builderParts)

    lines.push(``)
    lines.push(`    let body = response.text().await?;`)
    lines.push(`    println!("{}", body);`)
    lines.push(``)
    lines.push(`    Ok(())`)
    lines.push(`}`)

    return lines.join('\n')
  }

  // ── all other body types ───────────────────────────────────────────────────
  const lines: string[] = [
    `use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE};`,
    ``,
    `#[tokio::main]`,
    `async fn main() -> Result<(), reqwest::Error> {`,
    `    let client = reqwest::Client::new();`,
    ``,
  ]

  const headerEntries = Object.entries(headers)
  if (headerEntries.length > 0) {
    lines.push(`    let mut headers = HeaderMap::new();`)
    for (const [k, v] of headerEntries) {
      if (k.toLowerCase() === 'content-type') {
        lines.push(`    headers.insert(CONTENT_TYPE, HeaderValue::from_static("${v}"));`)
      } else {
        lines.push(`    headers.insert("${k}", HeaderValue::from_static("${v}"));`)
      }
    }
    lines.push(``)
  }

  const builderParts: string[] = [`    let response = client.${method}("${fullUrl}")`]

  if (headerEntries.length > 0) {
    builderParts.push(`        .headers(headers)`)
  }

  switch (req.bodyType) {
    case 'json':
      builderParts.push(`        .body(r#"${req.bodyJson || '{}'}"#)`)
      break
    case 'raw':
      builderParts.push(`        .body(r#"${req.bodyRaw}"#)`)
      break
    case 'url-encoded': {
      const pairs = req.urlEncodedFields.map((f) => `("${f.key}", "${f.value}")`).join(', ')
      builderParts.push(`        .form(&[${pairs}])`)
      break
    }
    case 'file':
      builderParts.push(`        // TODO: read file and pass as body`)
      break
  }

  builderParts.push(`        .send()`)
  builderParts.push(`        .await?;`)

  lines.push(...builderParts)
  lines.push(``)
  lines.push(`    let body = response.text().await?;`)
  lines.push(`    println!("{}", body);`)
  lines.push(``)
  lines.push(`    Ok(())`)
  lines.push(`}`)

  return lines.join('\n')
}
