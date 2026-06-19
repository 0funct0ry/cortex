import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-themes', '@chromatic-com/storybook'],
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
