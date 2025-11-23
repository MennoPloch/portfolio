import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'matter': ['matter-js'],
          'gsap': ['gsap'],
          'lenis': ['lenis']
        }
      }
    },
    cssCodeSplit: true
  }
})
