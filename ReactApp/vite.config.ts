import { defineConfig } from "vite";
import path from 'path'
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tailwind-config': path.resolve(__dirname, './tailwind.config.js'),
    }
  }
});