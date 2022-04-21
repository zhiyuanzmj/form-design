<template>
  <PrismEditor v-model="code" class="form-design-editor" :highlight="(code:any)=>{return highlight(code,languages[language])}" :readonly="readonly" line-numbers />
</template>

<script lang="ts" setup>
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-json'
import 'prismjs/themes/prism-tomorrow.css'

const { language = 'json', modelValue = '', readonly = false } = defineProps<{
  modelValue: string
  language?: string
  readonly?: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const code = $computed<string>({
  get() { return modelValue },
  set(val) { emit('update:modelValue', val) },
})
</script>
<style lang="scss">
.form-design-editor {
  box-sizing: border-box;
  padding: 10px;

  /* you must provide font-family font-size line-height. Example: */
  font-family: "Fira code", "Fira Mono", Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #ccc;

  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;

  /* optional class for removing the outline */
  .prism-editor__textarea:focus {
    outline: none;
  }

  .prism-editor__line-numbers {
    user-select: none;
  }
}
</style>
