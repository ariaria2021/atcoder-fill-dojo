import { defineConfig } from 'vitest/config'

export default defineConfig({
  // GitHub Pages is served below the repository name.
  base: '/atcoder-fill-dojo/',
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
})
