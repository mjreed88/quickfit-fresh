import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use relative paths for Cloudflare Pages SPA
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Use esbuild minifier (default, no extra install needed)
    minify: 'esbuild',
    sourcemap: false,
  },
})
