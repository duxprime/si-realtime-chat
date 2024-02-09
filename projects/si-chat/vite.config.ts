import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { vitePluginTypescriptTransform } from 'vite-plugin-typescript-transform';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true
  },
  plugins: [
    vue(),
    vueJsx(),
    vitePluginTypescriptTransform({
      enforce: 'pre',
      filter: {
        files: {
          include: /\.ts$/,
        },
      },
      tsconfig : {
        location: 'tsconfig.node.json'
      }
    })
  ],
  optimizeDeps: {
    esbuildOptions: {
      tsconfigRaw: {
        compilerOptions : {
          experimentalDecorators: true,
          // @ts-ignore
          emitDecoratorMetadata: true, 
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
