<template>
  <section h-full bg-white flex>
    <aside pt-2 w-62>
      <ComponentGroup
        title="基础字段"
        :fields="basicFields"
        :list="basicComponents"
      />
      <ComponentGroup
        title="高级字段"
        :fields="advanceFields"
        :list="advanceComponents"
      />
      <ComponentGroup
        title="布局字段"
        :fields="layoutFields"
        :list="layoutComponents"
      />
    </aside>

    <main b="0 x solid gray-200" flex="~ 1 col nowrap">
      <CustomHeader
        :preview="preview"
        :upload-json="uploadJson"
        :generate-json="generateJson"
        :clearable="clearable"
        @preview="() => (previewVisible = true)"
        @generate-json="handleGenerateJson"
        @clearable="handleClearable"
      >
        <slot name="header" />
      </CustomHeader>
      <WidgetFormElement
        ref="widgetFormRef"
        v-model:widgetForm="widgetForm"
        v-model:widgetFormSelect="widgetFormSelect"
      />
    </main>

    <aside relative w-75 flex="~ col">
      <header b="0 b-1 solid gray-200" grid="~ cols-2" min-h-11 px-2>
        <div :class="`${configTab === 'widget'?'active':''} config-tab`" @click="configTab = 'widget'">
          字段属性
        </div>
        <div :class="`${configTab === 'form'?'active':''} config-tab`" @click="configTab = 'form'">
          表单属性
        </div>
      </header>

      <WidgetConfig
        v-show="configTab === 'widget'"
        v-model:select="widgetFormSelect"
      />
      <FormConfig
        v-show="configTab === 'form'"
        v-model:config="widgetForm.config"
      />
    </aside>

    <el-dialog v-model="previewVisible" destroy-on-close title="预览" :z-index="2000" :width="800">
      <GenerateForm
        ref="generateFormRef"
        :request="request"
        :data="widgetForm"
      />

      <template #footer>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleGetData">获取数据</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="generateJsonVisible" :model-append-to-body="false" append-to-body title="修改JSON" :z-index="2000" :width="800">
      <CodeEditor v-model="generateJsonTemplate" max-h-xl />

      <template #footer>
        <el-button @click="handleCopyClick(generateJsonTemplate)">复制</el-button>
        <el-button type="primary" @click="handleUploadJson(generateJsonTemplate)">确认修改</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { defaultsDeep } from 'lodash-es'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import GenerateForm from '../generate/GenerateForm.vue'
import CustomHeader from './CustomHeader.vue'
import WidgetFormElement from './WidgetForm.vue'
import WidgetConfig from './WidgetConfig.vue'
import FormConfig from './FormConfig.vue'
import ComponentGroup from '@/components/ComponentGroup.vue'
import CodeEditor from '@/components/CodeEditor.vue'
import type { WidgetForm } from '@/config'
import { advanceComponents, advanceFields, basicComponents, basicFields, getWidgetForm, layoutComponents, layoutFields } from '@/config'

defineOptions({ name: 'DesignForm' })

defineProps({
  preview: {
    type: Boolean,
    default: true,
  },
  generateJson: {
    type: Boolean,
    default: true,
  },
  uploadJson: {
    type: Boolean,
    default: true,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  basicFields: {
    type: Array as PropType<typeof basicFields>,
    default: () => basicFields,
  },
  advanceFields: {
    type: Array as PropType<typeof advanceFields>,
    default: () => advanceFields,
  },
  layoutFields: {
    type: Array as PropType<typeof layoutFields>,
    default: () => layoutFields,
  },
  request: {
    type: Function,
  },
})

let widgetForm = $ref(getWidgetForm())
let widgetFormSelect = $ref<any>()
let generateFormRef = $ref<InstanceType<typeof GenerateForm>|null>(null)
let configTab = $ref('form')
let previewVisible = $ref(false)
let generateJsonVisible = $ref(false)
let generateJsonTemplate = $ref(JSON.stringify(getWidgetForm(), null, 2))

const handleUploadJson = () => {
  try {
    widgetForm.list = []
    widgetForm = defaultsDeep(
      JSON.parse(generateJsonTemplate),
      widgetForm,
    )

    if (widgetForm.list)
      widgetFormSelect = widgetForm.list[0]

    generateJsonVisible = false
    ElMessage.success('修改成功')
  }
  catch (error) {
    ElMessage.error('修改失败，请检查JSON格式是否正确。')
  }
}

const handleCopyClick = (text: string) => {
  navigator.clipboard.writeText(text)
  ElMessage.success({ message: 'Copy成功', customClass: '!z1-[2005]', duration: 300000 })
}

const handleGetData = () => {
  generateFormRef?.getData().then((res: any) => {
    generateJsonTemplate = JSON.stringify(res, null, 2)
    generateJsonVisible = true
  })
}

const handleGenerateJson = () =>
  (generateJsonTemplate = JSON.stringify(
    widgetForm,
    null,
    2,
  )) && (generateJsonVisible = true)

const handleClearable = () => {
  widgetForm.list = []
  widgetForm = defaultsDeep(getWidgetForm(), widgetForm)
  widgetFormSelect = undefined
}

const handleReset = () => generateFormRef?.reset()

defineExpose({
  getJson: () => $$(widgetForm).value,
  setJson: (json: WidgetForm) => {
    widgetForm.list = []
    widgetForm = defaultsDeep(json, widgetForm)
    if (json.list.length)
      widgetFormSelect = json.list[0]
  },
  clear: () => handleClearable(),
})

</script>
<style lang="scss">
  .config-tab {
    @apply cursor-pointer text-sm text-gray-700
      flex items-center justify-center
      b-0 b-b-2 b-solid b-white;

    &.active {
      @apply b-blue-400;
    }
  }
</style>
