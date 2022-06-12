import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint';


export default defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
  },
  plugins: [
    vue(),
    eslintPlugin({
      fix: true,
      cache: false
    }),
    dts()
  ],
  build: {
    minify: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'vue-dadata-3',
      fileName: 'index',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        assetFileNames: 'index.[ext]',
        globals: {
          vue: 'Vue'
        },
      }
    }
  },
})
