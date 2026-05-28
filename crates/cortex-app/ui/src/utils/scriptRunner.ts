import type { ResponsePayload, VisualizationResult } from '../stores/responseStore'

export function runPostResponseScript(
  script: string,
  response: ResponsePayload
): VisualizationResult {
  let capturedHtml: string | null = null

  const cortexApi = {
    visualize: {
      set: (html: string) => {
        capturedHtml = html
      },
    },
    response: {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: response.body,
      json: () => {
        try {
          return JSON.parse(response.body)
        } catch {
          throw new Error('Response body is not valid JSON')
        }
      },
    },
  }

  try {
    const fn = new Function('cortex', script)
    fn(cortexApi)
    return { html: capturedHtml, error: null }
  } catch (err) {
    return { html: null, error: String(err) }
  }
}
