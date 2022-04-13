/// <reference types="vue/macros-global" />
/// <reference types="unplugin-vue-define-options" />
// Mocks all files ending in `.vue` showing them as plain Vue instances
declare interface Window {
  // extend the window
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare namespace JSX {
  interface IntrinsicAttributes {
    style?: string
    title?: string
    class?: string|object
  }
}
