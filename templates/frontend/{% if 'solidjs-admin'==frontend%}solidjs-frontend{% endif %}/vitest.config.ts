import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'
import path from 'path'

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
