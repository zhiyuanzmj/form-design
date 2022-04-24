/// <reference types="vue/macros-global" />
/// <reference types="unplugin-vue-define-options" />
// Mocks all files ending in `.vue` showing them as plain Vue instances
declare interface Window {
  // extend the window
}

import type { AttributifyAttributes } from '@unocss/preset-attributify'

declare module '@vue/runtime-dom' {
  interface HTMLAttributes extends AttributifyAttributes {}
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
