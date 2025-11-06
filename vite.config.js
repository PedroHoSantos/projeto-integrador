import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração padrão do Vite para React
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // porta padrão
    open: true, // abre automaticamente o preview
  },
  build: {
    outDir: 'dist', // pasta gerada no build
  },
})
