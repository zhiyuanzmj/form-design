<template>
  <section class="h-full bg-white flex">
    <aside width="250px" class="pt-2 w-62">
      <ComponentGroup
        title="基础字段"
        :fields="basicFields"
        :list="element.basicComponents"
      />
      <ComponentGroup
        title="高级字段"
        :fields="advanceFields"
        :list="element.advanceComponents"
      />
      <ComponentGroup
        title="布局字段"
        :fields="layoutFields"
        :list="element.layoutComponents"
      />
    </aside>

    <main class="border-0 border-x border-solid border-gray-200 flex flex-col flex-nowrap flex-1">
      <CustomHeader
        :preview="preview"
        :upload-json="uploadJson"
        :generate-json="generateJson"
        :clearable="clearable"
        @preview="() => (previewVisible = true)"
        @upload-json="() => (uploadJsonVisible = true)"
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

    <aside class="relative w-75">
      <header class="h-11 px-2 grid grid-cols-2 border-0 border-b-1 border-solid border-gray-200">
        <div
          class="config-tab"
          :class="{ active: configTab === 'widget' }"
          @click="configTab = 'widget'"
        >
          字段属性
        </div>
        <div
          class="config-tab cursor-pointer"
          :class="{ active: configTab === 'form' }"
          @click="configTab = 'form'"
        >
          表单属性
        </div>
      </header>

      <div class="p-2">
        <WidgetConfig
          v-show="configTab === 'widget'"
          v-model:select="widgetFormSelect"
        />
        <FormConfig
          v-show="configTab === 'form'"
          v-model:config="widgetForm.config"
        />
      </div>
    </aside>

    <el-dialog v-model="uploadJsonVisible" title="导入JSON" :width="800">
      <el-alert
        type="info"
        title="JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可"
        style="margin-bottom: 10px;"
      />
      <CodeEditor v-model="jsonEg" />

      <template #footer>
        <el-button @click="uploadJsonVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUploadJson">导入</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="previewVisible" title="预览" :width="800">
      <GenerateForm
        v-if="previewVisible"
        ref="generateFormRef"
        :request="request"
        :data="widgetForm"
      />

      <template #footer>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleGetData">获取数据</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="generateJsonVisible" append-to-body title="生成JSON" :width="800">
      <CodeEditor v-model="generateJsonTemplate" readonly />

      <template #footer>
        <el-button @click="generateJsonVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCopyClick(generateJsonTemplate)">复制</el-button>
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
import { element } from '@/config'
import type { WidgetForm } from '@/config/element'

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
    type: Array as PropType<Array<string>>,
    default: () => [
      'input',
      'password',
      'textarea',
      'number',
      'radio',
      'checkbox',
      'time',
      'date',
      'rate',
      'select',
      'switch',
      'slider',
      'text',
    ],
  },
  advanceFields: {
    type: Array as PropType<Array<string>>,
    default: () => ['img-upload', 'download', 'cascader'],
  },
  layoutFields: {
    type: Array as PropType<Array<string>>,
    default: () => ['grid', 'table', 'divider'],
  },
  request: {
    type: Function,
  },
})
let widgetForm = $ref(element.widgetForm())
let widgetFormSelect = $ref<any>()
let generateFormRef = $ref<typeof GenerateForm>()
let configTab = $ref('widget')
let previewVisible = $ref(false)
let uploadJsonVisible = $ref(false)
let generateJsonVisible = $ref(false)
let generateJsonTemplate = $ref(JSON.stringify(element.widgetForm(), null, 2))
let jsonEg = $ref(JSON.stringify(element.widgetForm(), null, 2))

const handleUploadJson = () => {
  try {
    widgetForm.list = []
    widgetForm = defaultsDeep(
      JSON.parse(jsonEg),
      widgetForm,
    )

    if (widgetForm.list)
      widgetFormSelect = widgetForm.list[0]

    uploadJsonVisible = false
    ElMessage.success('上传成功')
  }
  catch (error) {
    ElMessage.error('上传失败')
  }
}

const handleCopyClick = (text: string) => {
  navigator.clipboard.writeText(text)
  ElMessage.success({ message: 'Copy成功', customClass: '!z1-[2005]', duration: 300000 })
}

const handleGetData = () => {
  generateFormRef.getData().then((res: any) => {
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
  widgetForm = defaultsDeep(element.widgetForm(), widgetForm)
  widgetFormSelect = undefined
}

const handleReset = () => generateFormRef.reset()

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
    @apply cursor-pointer text-sm text-gray-700 flex items-center justify-center;
    @apply border-0 border-b-2 border-solid border-white;

    &.active {
      @apply border-blue-400;
    }
  }
</style>
