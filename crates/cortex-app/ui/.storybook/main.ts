import type { StorybookConfig } from '@storybook/react-vite'
import remarkGfm from 'remark-gfm'

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.@(ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        // Storybook stopped enabling GFM in MDX by default (SB 7+). Re-enable it
        // so pipe-tables, strikethrough, and autolinks render in our docs pages.
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: { autodocs: 'tag' },
  async viteFinal(config) {
    const { resolve } = await import('path')
    const { fileURLToPath } = await import('url')
    const __dirname = fileURLToPath(new URL('.', import.meta.url))
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...((config.resolve.alias as Record<string, string>) ?? {}),
      '@': resolve(__dirname, '../src'),
    }
    return config
  },
}

export default config
