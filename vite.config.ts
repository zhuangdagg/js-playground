import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import replace from '@rollup/plugin-replace'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ 
      rollupTypes: false,
      tsconfigPath: './tsconfig.app.json' 
    })
  ],
  base: './',
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: {
        'playground': './src/index.ts'
      },
      formats: ['es'],
      fileName: () => '[name].js'
    },
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js'
      },
      external: ['vue']
    }
  },
  worker: {
    format: 'es',
    plugins: () => [
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('production')
        }
      })
    ]
  }
})
