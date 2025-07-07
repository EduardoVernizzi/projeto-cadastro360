import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
   base: '/projeto-cadastro360/',
  plugins: [react()],
  server: {
    open: true,
  }
})
