<template>
  <div class="widget-view" :class="{ active: selectWidget?.key === element.key }">
    <el-table
      v-if="element.type === 'table'"
      class="w-0 flex-1"
      border
      :data="element.options.defaultValue"
    >
      <el-table-column
        v-for="i in element.columns"
        :key="i.prop"
        :header-align="element.options.align"
        :align="element.options.align"
        v-bind="i"
      />
    </el-table>

    <el-divider v-else-if="element.type === 'divider'" class="pb-0" :data="element.options.defaultValue" content-position="left">
      {{ element.label }}
    </el-divider>

    <el-form-item
      v-else-if="element"
      :key="element.key"
      :label="element.label"
      :label-width="element.labelWidth"
      :rules="element.options.rules"
    >
      <template v-if="element.type === 'input'">
        <el-input
          readonly
          :model-value="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :maxlength="parseInt(element.options.maxlength)"
          :clearable="element.options.clearable"
          :disabled="element.options.disabled"
        >
          <template v-if="element.options.prefix" #prefix>
            {{ element.options.prefix }}
          </template>
          <template v-if="element.options.suffix" #suffix>
            {{ element.options.suffix }}
          </template>
          <template v-if="element.options.prepend" #prepend>
            {{ element.options.prepend }}
          </template>
          <template v-if="element.options.append" #append>
            {{ element.options.append }}
          </template>
        </el-input>
      </template>

      <template v-if="element.type === 'password'">
        <el-input
          readonly
          :model-value="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :maxlength="parseInt(element.options.maxlength)"
          :clearable="element.options.clearable"
          :disabled="element.options.disabled"
          :show-password="element.options.showPassword"
        >
          <template v-if="element.options.prefix" #prefix>
            {{ element.options.prefix }}
          </template>
          <template v-if="element.options.suffix" #suffix>
            {{ element.options.suffix }}
          </template>
          <template v-if="element.options.prepend" #prepend>
            {{ element.options.prepend }}
          </template>
          <template v-if="element.options.append" #append>
            {{ element.options.append }}
          </template>
        </el-input>
      </template>

      <template v-if="element.type === 'textarea'">
        <el-input
          type="textarea"
          resize="none"
          readonly
          :rows="element.options.rows"
          :model-value="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :maxlength="parseInt(element.options.maxlength)"
          :show-word-limit="element.options.showWordLimit"
          :autosize="element.options.autosize"
          :clearable="element.options.clearable"
          :disabled="element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'number'">
        <el-input-number
          :model-value="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :max="element.options.max"
          :min="element.options.min"
          :disabled="element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'radio'">
        <el-radio-group
          :model-value="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :disabled="element.options.disabled"
        >
          <el-radio
            v-for="item of element.options.options"
            :key="item.value"
            :label="item.value"
            :style="{
              display: element.options.inline ? 'inline-block' : 'block'
            }"
          >
            {{ element.options.showLabel ? item.label : item.value }}
          </el-radio>
        </el-radio-group>
      </template>

      <template v-if="element.type === 'checkbox'">
        <el-checkbox-group
          :model-value="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :disabled="element.options.disabled"
        >
          <el-checkbox
            v-for="item of element.options.options"
            :key="item.value"
            :label="item.value"
            :style="{
              display: element.options.inline ? 'inline-block' : 'block'
            }"
          >
            {{ element.options.showLabel ? item.label : item.value }}
          </el-checkbox>
        </el-checkbox-group>
      </template>

      <template v-if="element.type === 'time'">
        <el-time-picker
          :model-value="element.options.defaultValue"
          :placeholder="element.options.placeholder"
          :readonly="element.options.readonly"
          :editable="element.options.editable"
          :clearable="element.options.clearable"
          :format="element.options.format"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>

      <template v-if="element.type === 'date'">
        <el-date-picker
          :model-value="element.options.defaultValue"
          :placeholder="element.options.placeholder"
          :readonly="element.options.readonly"
          :editable="element.options.editable"
          :clearable="element.options.clearable"
          :format="element.options.format"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>

      <template v-if="element.type === 'rate'">
        <el-rate
          :model-value="element.options.defaultValue"
          :max="element.options.max"
          :allow-half="element.options.allowHalf"
          :disabled="element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'select'">
        <el-select
          :model-value="element.options.defaultValue"
          :multiple="element.options.multiple"
          :placeholder="element.options.placeholder"
          :clearable="element.options.clearable"
          :filterable="element.options.filterable"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        >
          <el-option
            v-for="item of element.options.options"
            :key="item.value"
            :value="item.value"
            :label="element.options.showLabel ? item.label : item.value"
          />
        </el-select>
      </template>

      <template v-if="element.type === 'switch'">
        <el-switch
          :model-value="element.options.defaultValue"
          :active-text="element.options.activeText"
          :inactive-text="element.options.inactiveText"
          :disabled="element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'slider'">
        <el-slider
          :model-value="element.options.defaultValue"
          :min="element.options.min"
          :max="element.options.max"
          :step="element.options.step"
          :range="element.options.range"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>

      <template v-if="element.type == 'text'">
        <span>{{ element.options.defaultValue }}</span>
      </template>

      <template v-if="element.type === 'img-upload'">
        <el-upload
          :name="element.options.file"
          :action="element.options.action"
          :accept="element.options.accept"
          :list-type="element.options.listType"
          :multiple="element.options.multiple"
          :limit="element.options.limit"
          :disabled="element.options.disabled"
        >
          <template v-if="element.options.listType === 'picture-card'">
            <el-image
              v-if="element.options.defaultValue?.length"
              style="width: 100%; height: 100%;"
              :preview-src-list="[
                '/api/sys/common/static/' + element.options.defaultValue
              ]"
              :src="'/api/sys/common/static/' + element.options.defaultValue"
            />
            <i v-else class="custom:insert" />
          </template>
          <el-button v-else>
            <i icon-class="custom:img-upload" style="margin-right: 10px;" />
            点击上传
          </el-button>
        </el-upload>
      </template>

      <template v-if="element.type === 'download'">
        <el-button type="text" style="margin-top: -4px;">
          下载
        </el-button>
      </template>

      <template v-if="element.type === 'cascader'">
        <el-cascader
          :model-value="element.options.defaultValue"
          :options="element.options.remoteOptions"
          :placeholder="element.options.placeholder"
          :filterable="element.options.filterable"
          :clearable="element.options.clearable"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>
    </el-form-item>

    <template v-if="selectWidget?.key === element.key">
      <div class="absolute z-10 right-0 -bottom-0.5 bg-blue-400 text-white flex gap-1 p-1 text-sm cursor-pointer">
        <i class="custom:copy" @click.stop="$emit('copy')" />
        <i class="custom:delete" @click.stop="$emit('delete')" />
      </div>
      <div class="absolute z-10 left-0 -top-0.5 bg-blue-400 text-white p-1 cursor-move text-sm">
        <i class="custom:move" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { WidgetForm } from '@/config'

defineProps<{
  config: WidgetForm['config']
  element: any
  selectWidget?: any
}>()
defineEmits(['copy', 'delete'])
</script>
