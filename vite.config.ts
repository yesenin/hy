import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/hy/',
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/test/setupTests.ts',
        exclude: [...configDefaults.exclude],
    },
})
