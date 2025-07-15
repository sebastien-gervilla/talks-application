import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    checker({
      typescript: {
        tsconfigPath: './tsconfig.app.json'
      },
    })
  ],
  server: {
    port: 5000
  },
})