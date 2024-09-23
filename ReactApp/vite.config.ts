import { defineConfig, UserConfig as ViteUserConfig } from "vite";
import type { UserConfig as VitestUserConfig } from 'vitest/config';
import { resolve } from 'node:path'
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig((): VitestUserConfig & ViteUserConfig => ({
  plugins: [react(), tsconfigPaths()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
      { find: '@tailwind-config', replacement: resolve(__dirname, './tailwind.config.js') },
      { find: '@models', replacement: resolve(__dirname, './src/models') },
      { find: '@shared', replacement: resolve(__dirname, './src/apps/shared') },
      { find: '@api', replacement: resolve(__dirname, './src/api') },
      { find: '@libs', replacement: resolve(__dirname, './src/libs') },
      { find: '@apps', replacement: resolve(__dirname, './src/apps') },
    ]   
  },
  test: {
    globals: true,
    environment: 'jsdom',
  }
}))