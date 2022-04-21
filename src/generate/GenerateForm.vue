<template>
  <el-form
    ref="generateForm"
    label-suffix=":"
    :model="model"
    :rules="rules"
    :size="widgetForm.config.size"
    :label-position="widgetForm.config.labelPosition"
    :label-width="`${widgetForm.config.labelWidth}px`"
    :hide-required-asterisk="widgetForm.config.hideRequiredAsterisk"
  >
    <template v-for="(element, index) of widgetForm.list">
      <template v-if="element.type === 'grid'">
        <el-row
          v-if="element.key"
          :key="element.key"
          type="flex"
          :gutter="element.options.gutter ?? 0"
          :justify="element.options.justify"
          :align="element.options.align"
        >
          <el-col
            v-for="(col, colIndex) of element.columns"
            :key="colIndex"
            :span="col.span ?? 0"
          >
            <GenerateFormItem
              v-for="colItem of col.list"
              :key="colItem.key"
              :request="request"
              :model="model"
              :updated-model="updatedModel"
              :element="colItem"
              :config="data.config"
              :disabled="disabled"
            />
          </el-col>
        </el-row>
      </template>
      <GenerateFormItem
        v-else
        :key="element.key"
        :model="model"
        :updated-model="updatedModel"
        :element="widgetForm.list[index]"
        :config="data.config"
        :disabled="disabled"
        :request="request"
      />
    </template>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { ElMessage } from 'element-plus'
import GenerateFormItem from './GenerateFormItem.vue'
import { element } from '@/config'

export default defineComponent({
  name: 'FormGenerate',
  components: {
    GenerateFormItem,
  },
  props: {
    data: {
      type: Object,
      default: element.widgetForm(),
    },
    value: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    request: {
      type: Function,
    },
  },
  setup(props) {
    const state = reactive({
      generateForm: null as any,
      model: {} as any,
      updatedModel: {} as any,
      rules: {} as any,
      widgetForm:
        (props.data && JSON.parse(JSON.stringify(props.data)))
        ?? element.widgetForm(),
    })

    const generateModel = (list: any[]) => {
      for (let index = 0; index < list.length; index++) {
        const model = list[index].model
        if (!model)
          return

        if (list[index].type === 'grid') {
          list[index].columns.forEach((col: any) => generateModel(col.list))
        }
        else {
          if (props.value && Object.keys(props.value).includes(model))
            state.model[model] = props.value[model]

          else
            state.model[model] = list[index].options.defaultValue

          state.rules[model] = list[index].options.rules
        }
      }
    }

    const generateOptions = (list: any[]) => {
      list.forEach(async(item) => {
        if (item.type === 'grid') {
          item.columns.forEach((col: any) => generateOptions(col.list))
        }
        else {
          if (item.options.remote && item.options.remoteFunc) {
            if (props.request) {
              const { data } = await props.request({
                url: item.options.remoteFunc,
              })
              item.options.remoteOptions = data.map((i: any) => ({
                label: i[item.options.props.label],
                value: i[item.options.props.value],
                children: i[item.options.props.children],
              }))
              return
            }
            fetch(item.options.remoteFunc)
              .then(resp => resp.json())
              .then((json) => {
                if (json instanceof Array) {
                  item.options.remoteOptions = json.map(data => ({
                    label: data[item.options.props.label],
                    value: data[item.options.props.value],
                    children: data[item.options.props.children],
                  }))
                }
              })
          }
        }
      })
    }

    watch(
      () => props.data,
      (val) => {
        state.widgetForm
          = (val && JSON.parse(JSON.stringify(val))) ?? element.widgetForm()
        state.model = {}
        state.rules = {}
        generateModel(state.widgetForm.list)
        generateOptions(state.widgetForm.list)
      },
      { deep: true, immediate: true },
    )

    const getData = () => {
      return new Promise((resolve, reject) => {
        state.generateForm
          .validate()
          .then((validate: boolean) => {
            if (validate)
              resolve(state.updatedModel)

            else
              ElMessage.error('验证失败')
          })
          .catch((error: Error) => {
            reject(error)
          })
      })
    }

    const reset = () => {
      state.generateForm.resetFields()
    }
    return {
      ...toRefs(state),
      getData,
      reset,
    }
  },
})
</script>
