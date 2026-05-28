export interface MultipartPart {
  headers: Record<string, string>
  body: string
}

/**
 * Extracts the boundary string from the Content-Type header.
 */
export function getBoundary(contentType: string): string | null {
  const parts = contentType.split(';')
  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.toLowerCase().startsWith('boundary=')) {
      let boundary = trimmed.substring('boundary='.length)
      if (boundary.startsWith('"') && boundary.endsWith('"')) {
        boundary = boundary.substring(1, boundary.length - 1)
      }
      return boundary
    }
  }
  return null
}

/**
 * Parses a multipart response body into individual parts.
 * Throws an error if the boundary is missing or malformed.
 */
export function parseMultipart(body: string, contentType: string): MultipartPart[] {
  const boundary = getBoundary(contentType)
  if (!boundary) {
    throw new Error('Missing "boundary" parameter in Content-Type header.')
  }

  const boundaryMarker = `--${boundary}`
  if (!body.includes(boundaryMarker)) {
    throw new Error(`Boundary marker "${boundaryMarker}" not found in response body.`)
  }

  const segments = body.split(boundaryMarker)
  const parts: MultipartPart[] = []

  // The first segment is the preamble, ignore it.
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i]
    const trimmedSegment = segment.trim()

    // If the segment is empty or just "--" (indicating the closing boundary), skip it.
    if (trimmedSegment === '--' || trimmedSegment === '' || trimmedSegment.startsWith('--')) {
      continue
    }

    let headerStr = ''
    let bodyStr: string

    // Headers and body are separated by a double newline (\r\n\r\n or \n\n)
    const separatorIndex = segment.indexOf('\r\n\r\n')
    if (separatorIndex !== -1) {
      headerStr = segment.substring(0, separatorIndex)
      bodyStr = segment.substring(separatorIndex + 4)
    } else {
      const lfIndex = segment.indexOf('\n\n')
      if (lfIndex !== -1) {
        headerStr = segment.substring(0, lfIndex)
        bodyStr = segment.substring(lfIndex + 2)
      } else {
        // No header/body separator found
        bodyStr = segment
      }
    }

    // Clean up leading CRLF/LF from headers
    if (headerStr.startsWith('\r\n')) {
      headerStr = headerStr.substring(2)
    } else if (headerStr.startsWith('\n')) {
      headerStr = headerStr.substring(1)
    }

    // Clean up trailing CRLF/LF from body (as it is followed by --boundary)
    if (bodyStr.endsWith('\r\n')) {
      bodyStr = bodyStr.substring(0, bodyStr.length - 2)
    } else if (bodyStr.endsWith('\n')) {
      bodyStr = bodyStr.substring(0, bodyStr.length - 1)
    }

    // Parse headers into key-value pairs (lowercased keys for consistency)
    const headers: Record<string, string> = {}
    const headerLines = headerStr.split(/\r?\n/)
    for (const line of headerLines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue
      const colonIndex = trimmedLine.indexOf(':')
      if (colonIndex !== -1) {
        const key = trimmedLine.substring(0, colonIndex).trim().toLowerCase()
        const value = trimmedLine.substring(colonIndex + 1).trim()
        headers[key] = value
      }
    }

    parts.push({ headers, body: bodyStr })
  }

  if (parts.length === 0) {
    throw new Error('No parts parsed from multipart response body.')
  }

  return parts
}
