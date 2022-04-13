<template>
  <el-form v-if="data" :key="data.key" label-position="top">
    <el-form-item v-if="!['grid'].includes(data.type)" label="字段标识">
      <el-input v-model="data.model" />
    </el-form-item>

    <el-form-item v-if="!['grid', 'table'].includes(data.type)" label="标题">
      <el-input v-model="data.label" />
    </el-form-item>

    <el-form-item v-if="hasKey('width')" label="宽度">
      <el-input v-model="data.options.width" />
    </el-form-item>

    <el-form-item v-if="hasKey('placeholder')" label="占位内容">
      <el-input v-model="data.options.placeholder" />
    </el-form-item>

    <el-form-item
      v-if="
        hasKey('defaultValue') &&
          (data.type === 'input' ||
            data.type === 'password' ||
            data.type === 'textarea' ||
            data.type === 'text' ||
            data.type === 'rate' ||
            data.type === 'switch' ||
            data.type === 'slider')
      "
      label="默认内容"
    >
      <el-input
        v-if="
          data.type === 'input' ||
            data.type === 'password' ||
            data.type === 'text'
        "
        v-model="data.options.defaultValue"
      />
      <el-input
        v-if="data.type === 'textarea'"
        v-model="data.options.defaultValue"
        type="textarea"
      />
      <el-rate
        v-if="data.type === 'rate'"
        v-model="data.options.defaultValue"
        :max="data.options.max"
        :allow-half="data.options.allowHalf"
      />
      <el-switch
        v-if="data.type === 'switch'"
        v-model="data.options.defaultValue"
      />
      <template v-if="data.type === 'slider'">
        <el-input-number
          v-if="!data.options.range"
          v-model.number="data.options.defaultValue"
        />
        <template v-if="data.options.range">
          <el-input-number
            v-model.number="data.options.defaultValue[0]"
            :max="data.options.max"
          />
          <el-input-number
            v-model.number="data.options.defaultValue[1]"
            :max="data.options.max"
          />
        </template>
      </template>
    </el-form-item>

    <el-form-item v-if="hasKey('maxlength')" label="最大长度">
      <el-input v-model.number="data.options.maxlength" />
    </el-form-item>

    <el-form-item v-if="hasKey('max')" label="最大值">
      <el-input-number v-model.number="data.options.max" />
    </el-form-item>

    <el-form-item v-if="hasKey('min')" label="最小值">
      <el-input-number v-model.number="data.options.min" />
    </el-form-item>

    <el-form-item v-if="hasKey('step')" label="步长">
      <el-input-number v-model.number="data.options.step" :min="0" />
    </el-form-item>

    <el-form-item v-if="hasKey('prefix')" label="前缀">
      <el-input v-model="data.options.prefix" />
    </el-form-item>

    <el-form-item v-if="hasKey('suffix')" label="后缀">
      <el-input v-model="data.options.suffix" />
    </el-form-item>

    <el-form-item v-if="hasKey('prepend')" label="前置标签">
      <el-input v-model="data.options.prepend" />
    </el-form-item>

    <el-form-item v-if="hasKey('append')" label="后置标签">
      <el-input v-model="data.options.append" />
    </el-form-item>

    <el-form-item v-if="hasKey('activeText')" label="选中时的内容">
      <el-input v-model="data.options.activeText" />
    </el-form-item>

    <el-form-item v-if="hasKey('inactiveText')" label="非选中时的内容">
      <el-input v-model="data.options.inactiveText" />
    </el-form-item>

    <el-form-item v-if="hasKey('editable')" label="文本框可输入">
      <el-switch v-model="data.options.editable" />
    </el-form-item>

    <el-form-item v-if="hasKey('range')" label="范围选择">
      <el-switch
        v-model="data.options.range"
        @change="handleSliderModeChange"
      />
    </el-form-item>

    <el-form-item v-if="hasKey('showPassword')" label="是否显示切换按钮">
      <el-switch v-model="data.options.showPassword" />
    </el-form-item>

    <el-form-item v-if="hasKey('showWordLimit')" label="是否显示字数">
      <el-switch v-model="data.options.showWordLimit" />
    </el-form-item>

    <el-form-item v-if="hasKey('autosize')" label="是否自适应内容高度">
      <el-switch v-model="data.options.autosize" />
    </el-form-item>

    <el-form-item v-if="hasKey('rows') && !data.options.autosize" label="行数">
      <el-input-number v-model="data.options.rows" :min="0" />
    </el-form-item>

    <el-form-item v-if="hasKey('allowHalf')" label="是否允许半选">
      <el-switch v-model="data.options.allowHalf" />
    </el-form-item>

    <el-form-item v-if="hasKey('inline')" label="布局方式">
      <el-radio-group v-model="data.options.inline">
        <el-radio-button :label="true">行内</el-radio-button>
        <el-radio-button :label="false">块级</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item v-if="hasKey('multiple')" label="是否多选">
      <el-switch
        v-model="data.options.multiple"
        @change="handleSelectModeChange"
      />
    </el-form-item>

    <el-form-item v-if="hasKey('filterable')" label="是否可搜索">
      <el-switch v-model="data.options.filterable" />
    </el-form-item>

    <el-form-item v-if="hasKey('showLabel')" label="是否显示标签">
      <el-switch v-model="data.options.showLabel" />
    </el-form-item>

    <el-form-item v-if="hasKey('options')" label="选项">
      <el-radio-group v-model="data.options.remote">
        <el-radio-button :label="false">静态数据</el-radio-button>
        <el-radio-button :label="true">远端数据</el-radio-button>
      </el-radio-group>
      <el-space
        v-if="data.options.remote"
        alignment="start"
        direction="vertical"
        style="margin-top: 10px;"
      >
        <el-input v-model="data.options.remoteFunc">
          <template #prepend> 远端方法 </template>
        </el-input>
        <el-input v-model="data.options.props.label">
          <template #prepend> 标签 </template>
        </el-input>
        <el-input v-model="data.options.props.value">
          <template #prepend> 值 </template>
        </el-input>
      </el-space>
      <template v-else>
        <template
          v-if="
            data.type === 'radio' ||
              (data.type === 'select' && !data.options.multiple)
          "
        >
          <el-radio-group
            v-model="data.options.defaultValue"
            style="margin-top: 8px;"
          >
            <Draggable
              item-key="index"
              ghost-class="ghost"
              handle=".drag-item"
              :group="{ name: 'options' }"
              :list="data.options.options"
            >
              <template #item="{ element, index }">
                <div class="flex items-center">
                  <el-radio
                    :label="element.value"
                    style="margin-right: 0; margin-bottom: 0;"
                  >
                    <el-input
                      v-model="element.value"
                      :style="{
                        width: data.options.showLabel ? '90px' : '180px'
                      }"
                    />
                    <el-input
                      v-if="data.options.showLabel"
                      v-model="element.label"
                      class="ml-1"
                      :style="{
                        width: '90px'
                      }"
                    />
                  </el-radio>
                  <i
                    style="margin: 0 5px; cursor: move;"
                    class="drag-item custom:item"
                  />
                  <el-button
                    type="primary"
                    circle
                    @click="handleOptionsRemove(index)"
                  >
                    <i class="custom:delete" />
                  </el-button>
                </div>
              </template>
            </Draggable>
          </el-radio-group>
        </template>

        <template
          v-if="
            data.type === 'checkbox' ||
              (data.type === 'select' && data.options.multiple)
          "
        >
          <el-checkbox-group
            v-model="data.options.defaultValue"
            style="margin-top: 8px;"
          >
            <Draggable
              item-key="index"
              ghost-class="ghost"
              handle=".cursor-move"
              :group="{ name: 'options' }"
              :list="data.options.options"
            >
              <template #item="{ element, index }">
                <div class="flex items-center justify-center gap-2 mb-2">
                  <el-checkbox :label="element.value">{{ '' }}</el-checkbox>
                  <el-input
                    v-model="element.value"
                    :style="{
                      width: data.options.showLabel ? '90px' : '180px'
                    }"
                  />
                  <el-input
                    v-if="data.options.showLabel"
                    v-model="element.label"
                    :style="{ width: '90px' }"
                  />
                  <i class="cursor-move text-sm custom:item" />
                  <el-button
                    type="primary"
                    circle
                    @click="handleOptionsRemove(index)"
                  >
                    <i class="custom:delete" />
                  </el-button>
                </div>
              </template>
            </Draggable>
          </el-checkbox-group>
        </template>

        <div style="margin-top: 5px;">
          <el-button
            type="text"
            @click="handleInsertOption"
          >
            添加选项
          </el-button>
        </div>
      </template>
    </el-form-item>

    <template v-if="data.type === 'time'">
      <el-form-item label="默认值">
        <el-time-picker
          v-model="data.options.defaultValue"
          style="width: 100%;"
          :format="data.options.format"
          :placeholder="data.options.placeholder"
        />
      </el-form-item>
    </template>

    <template v-if="data.type === 'date'">
      <el-form-item label="默认值">
        <el-date-picker
          v-model="data.options.defaultValue"
          style="width: 100%;"
          :format="data.options.format"
          :placeholder="data.options.placeholder"
        />
      </el-form-item>
    </template>

    <template v-if="data.type === 'time' || data.type === 'date'">
      <el-form-item label="格式">
        <el-input v-model="data.options.format" />
      </el-form-item>
    </template>

    <template v-if="data.type === 'download'">
      <el-form-item label="地址">
        <el-input v-model="data.options.defaultValue" />
      </el-form-item>
    </template>

    <template v-if="data.type === 'img-upload'">
      <el-form-item label="模式">
        <el-radio-group v-model="data.options.listType">
          <el-radio-button label="text">text</el-radio-button>
          <el-radio-button label="picture">picture</el-radio-button>
          <el-radio-button label="picture-card">picture-card</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="文件参数名">
        <el-input v-model="data.options.name" />
      </el-form-item>

      <el-form-item label="上传地址">
        <el-input v-model="data.options.action" />
      </el-form-item>

      <el-form-item label="接受上传的文件类型(多个使用 , 隔开)">
        <el-input v-model="data.options.accept" />
      </el-form-item>

      <el-form-item label="最大上传数量">
        <el-input-number v-model.number="data.options.limit" :min="1" />
      </el-form-item>

      <el-form-item label="上传请求方法">
        <el-radio-group v-model="data.options.method">
          <el-radio-button label="post">POST</el-radio-button>
          <el-radio-button label="put">PUT</el-radio-button>
          <el-radio-button label="get">GET</el-radio-button>
          <el-radio-button label="delete">DELETE</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </template>

    <el-form-item v-if="data.type === 'cascader'" label="远端数据">
      <el-space direction="vertical" alignment="start">
        <el-input v-model="data.options.remoteFunc">
          <template #prepend> 远端方法 </template>
        </el-input>
        <el-input v-model="data.options.props.label">
          <template #prepend> 标签 </template>
        </el-input>
        <el-input v-model="data.options.props.value">
          <template #prepend> 值 </template>
        </el-input>
        <el-input v-model="data.options.props.children">
          <template #prepend> 子选项 </template>
        </el-input>
      </el-space>
    </el-form-item>

    <template v-if="data.type === 'table'">
      <el-form-item label="列配置项">
        <Draggable
          tag="ul"
          item-key="index"
          ghost-class="ghost"
          handle=".drag-item"
          :group="{ name: 'options' }"
          :list="data.columns"
        >
          <template #item="{ element, index }">
            <li style=" display: flex; gap: 5px;margin-bottom: 5px;">
              <i class="drag-item custom:item" />
              <el-input v-model="element.label" placeholder="显示名称" />
              <el-input v-model="element.prop" placeholder="字段字段" />
              <el-button
                type="primary"
                circle
                style="margin-left: 5px;"
                @click="data.columns.splice(index, 1)"
              >
                <i class="custom:delete" />
              </el-button>
            </li>
          </template>
        </Draggable>

        <div>
          <el-button type="text" @click="data.columns.push({})">
            添加列
          </el-button>
        </div>
      </el-form-item>

      <el-form-item label="对齐方式">
        <el-radio-group v-model="data.options.align">
          <el-radio-button label="left">居左对齐</el-radio-button>
          <el-radio-button label="center">居中对齐</el-radio-button>
          <el-radio-button label="right">巨右对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </template>

    <template v-if="data.type === 'grid'">
      <el-form-item label="栅格间隔">
        <el-input-number v-model.number="data.options.gutter" :min="0" />
      </el-form-item>

      <el-form-item label="列配置项">
        <Draggable
          tag="ul"
          item-key="index"
          ghost-class="ghost"
          handle=".drag-item"
          :group="{ name: 'options' }"
          :list="data.columns"
        >
          <template #item="{ element, index }">
            <li style="margin-bottom: 5px;">
              <i class="drag-item custom:item" />
              <el-input-number
                v-model.number="element.span"
                placeholder="栅格值"
                :min="0"
                :max="24"
              />
              <el-button
                type="primary"
                circle
                style="margin-left: 5px;"
                @click="handleOptionsRemove(index)"
              >
                <i class="custom:delete" />
              </el-button>
            </li>
          </template>
        </Draggable>

        <div>
          <el-button type="text" @click="handleInsertColumn">
            添加列
          </el-button>
        </div>
      </el-form-item>

      <el-form-item label="垂直对齐方式">
        <el-radio-group v-model="data.options.align">
          <el-radio-button label="top">顶部对齐</el-radio-button>
          <el-radio-button label="middle">居中对齐</el-radio-button>
          <el-radio-button label="bottom">底部对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="水平排列方式">
        <el-select v-model="data.options.justify">
          <el-option value="start" label="左对齐" />
          <el-option value="end" label="右对齐" />
          <el-option value="center" label="居中" />
          <el-option value="space-around" label="两侧间隔相等" />
          <el-option value="space-between" label="两端对齐" />
        </el-select>
      </el-form-item>
    </template>

    <template v-if="data.type !== 'grid'">
      <el-form-item
        v-if="
          hasKey('rules') ||
            hasKey('readonly') ||
            hasKey('disabled') ||
            hasKey('allowClear')
        "
        label="操作属性"
      >
        <el-checkbox
          v-if="hasKey('rules')"
          v-model="data.options.rules.required"
        >
          必填
        </el-checkbox>
        <el-checkbox
          v-if="hasKey('readonly')"
          v-model="data.options.readonly"
        >
          只读
        </el-checkbox>
        <el-checkbox
          v-if="hasKey('disabled')"
          v-model="data.options.disabled"
        >
          禁用
        </el-checkbox>
        <el-checkbox
          v-if="hasKey('clearable')"
          v-model="data.options.clearable"
        >
          清除
        </el-checkbox>
      </el-form-item>

      <template v-if="hasKey('rules')">
        <h4 class="pb-2 text-gray-700 border-0 border-b-1 border-solid border-gray-200">验证规则</h4>

        <el-form-item label="触发时机">
          <el-radio-group v-model="data.options.rules.trigger">
            <el-radio-button label="blur">Blur</el-radio-button>
            <el-radio-button label="change">Change</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="枚举类型">
          <el-input v-model:value="data.options.rules.enum" />
        </el-form-item>

        <el-form-item label="字段长度">
          <el-input v-model.number="data.options.rules.len" />
        </el-form-item>

        <el-form-item label="最大长度">
          <el-input v-model.number="data.options.rules.max" />
        </el-form-item>

        <el-form-item label="最小长度">
          <el-input v-model.number="data.options.rules.min" />
        </el-form-item>

        <el-form-item label="校验文案">
          <el-input v-model="data.options.rules.message" />
        </el-form-item>

        <el-form-item label="正则表达式">
          <el-input v-model="data.options.rules.pattern" />
        </el-form-item>

        <el-form-item label="校验类型">
          <el-select v-model="data.options.rules.type">
            <el-option value="string">字符串</el-option>
            <el-option value="number">数字</el-option>
            <el-option value="boolean">布尔值</el-option>
            <el-option value="method">方法</el-option>
            <el-option value="regexp">正则表达式</el-option>
            <el-option value="integer">整数</el-option>
            <el-option value="float">浮点数</el-option>
            <el-option value="array">数组</el-option>
            <el-option value="object">对象</el-option>
            <el-option value="enum">枚举</el-option>
            <el-option value="date">日期</el-option>
            <el-option value="url">URL地址</el-option>
            <el-option value="hex">十六进制</el-option>
            <el-option value="email">邮箱地址</el-option>
            <el-option value="any">任意类型</el-option>
          </el-select>
        </el-form-item>
      </template>
    </template>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Draggable from 'vuedraggable'

export default defineComponent({
  name: 'ElWidgetConfig',
  components: {
    Draggable,
  },
  props: {
    select: {
      type: Object,
    },
  },
  emits: ['update:select'],
  setup(props, context) {
    const data = ref<any>(props.select)

    watch(
      () => props.select,
      val => (data.value = val),
    )

    watch(data, val => context.emit('update:select', val), { deep: true })

    const hasKey = (key: string) =>
      Object.keys(data.value.options).includes(key)

    const handleInsertColumn = () => {
      data.value.columns.push({
        span: 0,
        list: [],
      })
    }

    const handleInsertOption = () => {
      const index = data.value.options.options.length + 1
      data.value.options.options.push({
        label: `Option ${index}`,
        value: `Option ${index}`,
      })
    }

    const handleOptionsRemove = (index: number) => {
      if (data.value.type === 'grid')
        data.value.columns.splice(index, 1)

      else
        data.value.options.options.splice(index, 1)
    }

    const handleSliderModeChange = (checked: boolean) => {
      checked
        ? (data.value.options.defaultValue = [10, 90])
        : (data.value.options.defaultValue = 0)
    }

    const handleSelectModeChange = (val: boolean) => {
      if (data.value.type === 'img-upload')
        return

      if (val) {
        if (data.value.options.defaultValue) {
          if (!(data.value.options.defaultValue instanceof Array))
            data.value.options.defaultValue = [data.value.options.defaultValue]
        }
        else {
          data.value.options.defaultValue = []
        }
      }
      else {
        data.value.options.defaultValue.length
          ? (data.value.options.defaultValue
              = data.value.options.defaultValue[0])
          : (data.value.options.defaultValue = null)
      }
    }

    return {
      data,
      hasKey,
      handleInsertColumn,
      handleInsertOption,
      handleOptionsRemove,
      handleSliderModeChange,
      handleSelectModeChange,
    }
  },
})
</script>
<style>
  .ghost {
    @apply outline outline-dashed outline-blue-400;
  }
</style>
