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
      <CodeEditor v-model:value="jsonEg" language="json" />
      <template #footer>
        <el-button @click="() => (uploadJsonVisible = false)">
          取消
        </el-button>
        <el-button type="primary" @click="handleUploadJson">
          导入
        </el-button>
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
        <el-button
          type="primary"

          @click="handleGetData"
        >
          获取数据
        </el-button>
      </template>

      <el-dialog v-model="dataJsonVisible" title="获取数据" :width="800">
        <CodeEditor :value="dataJsonTemplate" language="json" readonly />

        <template #footer>
          <el-button

            @click="() => (dataJsonVisible = false)"
          >
            取消
          </el-button>
          <el-button
            type="primary"

            @click="handleCopyClick(dataJsonTemplate)"
          >
            Copy
          </el-button>
        </template>
      </el-dialog>
    </el-dialog>

    <el-dialog v-model="generateJsonVisible" title="生成JSON" :width="800">
      <CodeEditor :value="generateJsonTemplate" language="json" readonly />

      <template #footer>
        <el-button
          @click="() => (generateJsonVisible = false)"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleCopyClick(generateJsonTemplate)"
        >
          Copy
        </el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, reactive, toRefs } from 'vue'
// import { ElMessage } from 'element-plus'
import { defaultsDeep } from 'lodash-es'
import GenerateForm from '../generate/GenerateForm.vue'
import CustomHeader from './CustomHeader.vue'
import WidgetFormElement from './WidgetForm.vue'
import WidgetConfig from './WidgetConfig.vue'
import FormConfig from './FormConfig.vue'
import ComponentGroup from '@/components/ComponentGroup.vue'
import CodeEditor from '@/components/CodeEditor.vue'
import { element } from '@/config'
import { copy } from '@/utils'
import type { WidgetForm } from '@/config/element'

export default defineComponent({
  name: 'DesignForm',
  components: {
    CustomHeader,
    ComponentGroup,
    CodeEditor,
    WidgetFormElement,
    GenerateForm,
    WidgetConfig,
    FormConfig,
  },
  props: {
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
  },
  setup() {
    const state = reactive({
      element,
      widgetForm: element.widgetForm(),
      widgetFormSelect: undefined,
      generateFormRef: null as any,
      configTab: 'widget',
      previewVisible: false,
      uploadJsonVisible: false,
      dataJsonVisible: false,
      generateJsonVisible: false,
      generateJsonTemplate: JSON.stringify(element.widgetForm(), null, 2),
      dataJsonTemplate: '',
      jsonEg: JSON.stringify(element.widgetForm(), null, 2),
    })

    const handleUploadJson = () => {
      try {
        state.widgetForm.list = []
        state.widgetForm = defaultsDeep(
          JSON.parse(state.jsonEg),
          state.widgetForm,
        )

        if (state.widgetForm.list)
          state.widgetFormSelect = state.widgetForm.list[0]

        state.uploadJsonVisible = false
        // ElMessage.success('上传成功')
      }
      catch (error) {
        // ElMessage.error('上传失败')
      }
    }

    const handleCopyClick = (text: string) => {
      copy(text)
      // ElMessage.success('Copy成功')
    }

    const handleGetData = () => {
      state.generateFormRef.getData().then((res: any) => {
        state.dataJsonTemplate = JSON.stringify(res, null, 2)
        state.dataJsonVisible = true
      })
    }

    const handleGenerateJson = () =>
      (state.generateJsonTemplate = JSON.stringify(
        state.widgetForm,
        null,
        2,
      )) && (state.generateJsonVisible = true)

    const handleClearable = () => {
      state.widgetForm.list = []
      state.widgetForm = defaultsDeep(element.widgetForm(), state.widgetForm)
      state.widgetFormSelect = undefined
    }

    const handleReset = () => state.generateFormRef.reset()

    const getJson = () => state.widgetForm

    const setJson = (json: WidgetForm) => {
      state.widgetForm.list = []
      state.widgetForm = defaultsDeep(json, state.widgetForm)
      if (json.list.length)
        state.widgetFormSelect = json.list[0]
    }

    const clear = () => handleClearable()

    return {
      ...toRefs(state),
      handleUploadJson,
      handleCopyClick,
      handleGetData,
      handleGenerateJson,
      handleClearable,
      handleReset,
      getJson,
      setJson,
      clear,
    }
  },
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
