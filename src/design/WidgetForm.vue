<template>
  <el-form
    label-suffix=":"
    bg-gray-50 relative flex="~ 1"
    :size="widgetForm.config.size"
    :label-position="widgetForm.config.labelPosition"
    :label-width="`${widgetForm.config.labelWidth}px`"
    :hide-required-asterisk="widgetForm.config.hideRequiredAsterisk"
  >
    <div v-if="!widgetForm.list?.length" text="gray-400 lg" absolute top-50 left="1/2" translate-x="-1/2">
      从左侧拖拽来添加字段
    </div>
    <Draggable
      class="flex-1 m-2 bg-white shadow p-1"
      item-key="key"
      handle="[cursor-move]"
      :animation="200"
      group="form-design"
      :list="widgetForm.list"
      @add="handleMoveAdd"
    >
      <template #item="{ element, index }">
        <div
          v-if="element.type === 'grid'"
          class="widget-view col"
          grid="~ cols-24"
          :class="{ active: widgetFormSelect?.key === element.key }"
          :style="`gap: ${element.options.gutter}px; align-items: ${element.options.align};`"
          @click="handleItemClick(element)"
        >
          <Draggable
            v-for="(col, columnIndex) of element.columns"
            :key="columnIndex"
            class="bg-white min-h-12 border border-dashed border-gray-300"
            :style="`grid-column: span ${col.span}`"
            item-key="key"
            handle="[cursor-move]"
            :animation="200"
            group="form-design"
            :no-transition-on-drag="true"
            :list="col.list"
            @add="handleMoveAdd($event, col.list)"
          >
            <template #item="{ element: colElement, index: colIndex }">
              <WidgetFormItem
                :element="colElement"
                :config="widgetForm.config"
                :select-widget="widgetFormSelect"
                @click.stop="handleItemClick(colElement)"
                @copy="handleCopyClick(colIndex, col.list)"
                @delete="handleDeleteClick(colIndex, col.list)"
              />
            </template>
          </Draggable>

          <template v-if="widgetFormSelect?.key === element.key">
            <div absolute left-0 top="-0.5" bg-yellow-500 p=".5 l-0 t-0" text="white" cursor-move>
              <i class="eva:move-outline" text-lg />
            </div>
            <div absolute right-0 bottom="-0.5" bg-yellow-500 flex gap-1 p="1 r-.5" text-white cursor-pointer>
              <i class="fa6-regular:trash-can" @click.stop="handleDeleteClick(index, widgetForm.list)" />
            </div>
          </template>
        </div>

        <WidgetFormItem
          v-else
          :element="element"
          :config="widgetForm.config"
          :select-widget="widgetFormSelect"
          @click="handleItemClick(element)"
          @copy="handleCopyClick(index, widgetForm.list)"
          @delete="handleDeleteClick(index, widgetForm.list)"
        />
      </template>
    </Draggable>
  </el-form>
</template>

<script lang="ts" setup>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem.vue'
import type { WidgetForm } from '@/config'
import { cloneComponent } from '@/components/ComponentGroup.vue'

const { widgetForm } = defineProps<{ widgetForm: WidgetForm; widgetFormSelect?: any }>()
const emit = defineEmits(['update:widgetForm', 'update:widgetFormSelect'])

const handleCopyClick = (index: number, list: any[]) => {
  list.splice(index + 1, 0, cloneComponent(list[index]))
  emit('update:widgetFormSelect', list[index + 1])
}

const handleDeleteClick = (index: number, list: any[]) => {
  list.splice(index, 1)
  emit('update:widgetFormSelect', list.length - 1 === index
    ? index === 0 ? null : list[index - 1]
    : list[index + 1])
}

const handleItemClick = (row: any) => {
  emit('update:widgetFormSelect', row)
}

const handleMoveAdd = ({ newIndex }: any, list = widgetForm.list) => {
  emit('update:widgetFormSelect', list[newIndex])
}
</script>
<style lang="scss">
.widget-view {
  @apply relative m-0.5 p-1 border border-dashed border-gray-300;

  &.active {
    @apply border-solid border-blue-500 outline outline-2 outline-blue-500;

    &.col {
      @apply border-yellow-500 outline-yellow-500;
    }
  }

  &:hover {
    @apply border-blue-500 bg-blue-50;

    &.col {
      @apply border-yellow-500 bg-yellow-50;
    }
  }
}
</style>
