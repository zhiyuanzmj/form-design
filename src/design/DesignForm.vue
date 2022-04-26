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
      <header b="0 b solid gray-200" flex gap-2 items-center justify-end h-11 py-0 px-2>
        <slot />
        <el-button v-if="generateJson" type="text" @click="handleGenerateJson">
          <template #icon>
            <i class="ep:edit" />
          </template>修改
        </el-button>
        <el-button v-if="clearable" type="text" @click="handleClearable">
          <template #icon>
            <i class="custom:clearable" />
          </template>清空
        </el-button>
        <el-button v-if="preview" type="text" @click="previewVisible = true">
          <template #icon>
            <i class="custom:preview" />
          </template>预览
        </el-button>
      </header>

      <WidgetFormElement
        ref="widgetFormRef"
        v-model:widgetForm="widgetForm"
        v-model:widgetFormSelect="widgetFormSelect"
      />
    </main>

    <aside relative w-75 flex="~ col">
      <header b="0 b-1 solid gray-200" grid="~ cols-2" min-h-11 px-2>
        <div :class="`${!tab?'active':''} config-tab`" @click="tab = 0">
          字段属性
        </div>
        <div :class="`${tab?'active':''} config-tab`" @click="tab = 1">
          表单属性
        </div>
      </header>

      <WidgetConfig
        v-show="!tab"
        v-model:select="widgetFormSelect"
      />
      <FormConfig
        v-show="tab"
        v-model:config="widgetForm.config"
      />
    </aside>

    <el-dialog v-model="previewVisible" destroy-on-close title="预览" :z-index="2000" :width="800" @close="dataVisible=false">
      <CodeEditor v-show="dataVisible" v-model="generateJsonTemplate" />
      <GenerateForm
        v-show="!dataVisible"
        ref="generateFormRef"
        :request="request"
        :data="widgetForm"
      />

      <template #footer>
        <el-button @click="dataVisible?handleCopyClick(generateJsonTemplate):handleReset()">
          {{ dataVisible?'复制':'重置' }}
        </el-button>
        <el-button type="primary" @click="handleGetData">
          {{ dataVisible?'返回预览':'获取数据' }}
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="generateJsonVisible" :model-append-to-body="false" append-to-body title="修改JSON" :z-index="2000" :width="800">
      <CodeEditor v-model="generateJsonTemplate" />

      <template #footer>
        <el-button @click="handleCopyClick(generateJsonTemplate)">
          复制
        </el-button>
        <el-button type="primary" @click="handleUploadJson(generateJsonTemplate)">
          确认修改
        </el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import GenerateForm from '../generate/GenerateForm.vue'
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

let tab = $ref(0)
let widgetFormSelect = $ref<any>()
watch(() => widgetFormSelect, (val) => {
  tab = val ? 0 : 1
})

let widgetForm = $ref(getWidgetForm())
let generateJsonVisible = $ref(false)
let generateJsonTemplate = $ref(JSON.stringify(getWidgetForm(), null, 2))
const handleUploadJson = () => {
  try {
    widgetForm = JSON.parse(generateJsonTemplate)
    widgetFormSelect = widgetForm.list?.[0]
    generateJsonVisible = false
    ElMessage.success('修改成功')
  }
  catch (error) {
    ElMessage.error('修改失败，请检查JSON格式是否正确。')
  }
}

const handleGenerateJson = () =>
  (generateJsonTemplate = JSON.stringify(widgetForm, null, 2))
  && (generateJsonVisible = true)

const handleClearable = () => {
  widgetForm = getWidgetForm()
  widgetFormSelect = undefined
}

let dataVisible = $ref(false)
const generateFormRef = $ref<InstanceType<typeof GenerateForm>|null>(null)
const handleGetData = async() => {
  dataVisible = !dataVisible
  if (!dataVisible) return
  const res = await generateFormRef?.getData()
  generateJsonTemplate = JSON.stringify(res, null, 2)
}
const handleReset = () => generateFormRef?.reset()

const handleCopyClick = (text: string) => {
  navigator.clipboard.writeText(text)
  ElMessage.success({ message: 'Copy成功' })
}

const previewVisible = $ref(false)

defineExpose({
  getJson: () => $$(widgetForm).value,
  setJson: (json: WidgetForm) => {
    widgetForm = json
    widgetFormSelect = json.list?.[0]
  },
  clear: handleClearable,
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
