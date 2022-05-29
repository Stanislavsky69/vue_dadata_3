
// @ts-ignore
const path = require('path')
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      // @ts-ignore
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'vue-dadata-3',
      fileName: (format) => `vue-dadata-3.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
