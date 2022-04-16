import path from 'path'
import { readdirSync } from 'fs'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import DefineOptions from 'unplugin-vue-define-options/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import libCss from 'vite-plugin-libcss'
import { presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'
import Component from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
const resolve = p => path.resolve(__dirname, p)

export default defineConfig({
  resolve: {
    alias: {
      '@/': `${resolve('src')}/`,
    },
  },
  plugins: [
    Vue({
      reactivityTransform: true,
    }),
    DefineOptions(),
    VueJsx(),
    libCss(),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
      ],
      dts: resolve('src/auto-imports.d.ts'),
    }),
    Component({
      resolvers: [
        ElementPlusResolver(),
      ],
      dts: resolve('src/components.d.ts'),
    }),
    Unocss({
      mode: 'dist-chunk',
      theme: {
        colors: {
          blue: { 400: '#409EFF' },
        },
      },
      transformers: [
        transformerDirectives(),
      ],
      safelist: [...readdirSync(path.resolve(__dirname, 'src/assets/icons')).map(i => `custom:${i.split('.')[0]}`)],
      presets: [
        presetUno(),
        presetIcons({
          prefix: '',
          extraProperties: {
            'display': 'inline-block',
            'vertical-align': 'middle',
            'font-size': '14px',
          },
          scale: 1.2,
          collections: {
            custom: FileSystemIconLoader(
              path.resolve(__dirname, 'src/assets/icons'),
              (svg) => {
                svg = svg.replace(/^<\?xml.*?<svg/, '<svg')
                if (svg.includes('fill="#')) return svg
                return svg.replace(/^<svg /, '<svg fill="currentColor" ')
              },
            ),
          },
        }),
        presetAttributify(),
      ],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: format => `index.${format}.js`,
    },
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      external: [
        'vue',
        'element-plus',
        'vuedraggable',
      ],
      output: {
        globals: {
          'vue': 'Vue',
          'element-plus': 'ElementPlus',
          'vuedraggable': 'vuedraggable',
        },
      },
    },
  },
})
