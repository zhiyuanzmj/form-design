<template>
  <el-form
    label-suffix=":"
    class="flex flex-1 bg-gray-50 relative"
    :size="widgetForm.config.size"
    :label-position="widgetForm.config.labelPosition"
    :label-width="`${widgetForm.config.labelWidth}px`"
    :hide-required-asterisk="widgetForm.config.hideRequiredAsterisk"
  >
    <div v-if="!widgetForm.list?.length" class="text-gray-400 text-lg  absolute top-50 left-1/2 -translate-x-1/2">
      从左侧拖拽来添加字段
    </div>
    <Draggable
      class="flex-1 m-2 bg-white border border-dashed border-gray-400"
      item-key="key"
      handle=".cursor-move"
      :animation="200"
      group="people"
      :list="widgetForm.list"
      @add="handleMoveAdd"
    >
      <template #item="{ element, index }">
        <div
          v-if="element.type === 'grid'"
          class="widget-col"
          p-1 grid="~ cols-24"
          :class="{ active: widgetFormSelect?.key === element.key }"
          :style="`gap: ${element.options.gutter}px; align-items: ${element.options.align};`"
          @click="handleItemClick(element)"
        >
          <Draggable
            v-for="(col, colIndex) of element.columns"
            :key="colIndex"
            class="w-full bg-white min-h-12 border border-dashed border-gray-300"
            :style="`grid-column: span ${col.span}`"
            item-key="key"
            handle=".cursor-move"
            :animation="200"
            group="people"
            :no-transition-on-drag="true"
            :list="col.list"
            @add="handleColMoveAdd($event, element, colIndex)"
          >
            <template #item="{ element, index }">
              <WidgetFormItem
                :element="element"
                :config="widgetForm.config"
                :select-widget="widgetFormSelect"
                @click.stop="handleItemClick(element)"
                @copy="handleCopyClick(index, col.list)"
                @delete="handleDeleteClick(index, col.list)"
              />
            </template>
          </Draggable>

          <template v-if="widgetFormSelect?.key === element.key">
            <div class="absolute left-0 -top-0.5 bg-yellow-500 text-white p-1 text-sm cursor-move">
              <i class="custom:move" />
            </div>
            <div class="absolute right-0 -bottom-0.5 bg-yellow-500 text-white flex gap-1 p-1 text-sm cursor-pointer">
              <i class="custom:delete" @click.stop="handleDeleteClick(index, widgetForm.list)" />
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
import { cloneDeep } from 'lodash-es'
import WidgetFormItem from './WidgetFormItem.vue'
import type { WidgetForm } from '@/config'

const handleListInsert = (key: string, list: any[], obj: any) => {
  const newList: any[] = []
  list.forEach((item) => {
    if (item.key === key) {
      newList.push(item)
      newList.push(obj)
    }
    else {
      if (item.type === 'grid') {
        item.columns = item.columns.map((col: any) => ({
          ...col,
          list: handleListInsert(key, col.list, obj),
        }))
      }
      newList.push(item)
    }
  })
  return newList
}

const handleListDelete = (key: string, list: any[]) => {
  const newList: any[] = []
  list.forEach((item) => {
    if (item.key !== key) {
      if (item.type === 'grid') {
        item.columns = item.columns.map((col: any) => ({
          ...col,
          list: handleListDelete(key, col.list),
        }))
      }
      newList.push(item)
    }
  })
  return newList
}

const props = defineProps<{ widgetForm: WidgetForm; widgetFormSelect?: any }>()
const emit = defineEmits(['update:widgetForm', 'update:widgetFormSelect'])

const handleItemClick = (row: any) => {
  emit('update:widgetFormSelect', row)
}

const handleCopyClick = (index: number, list: any[]) => {
  const oldList = JSON.parse(JSON.stringify(props.widgetForm.list))

  const copyData = cloneDeep(list[index])

  emit('update:widgetForm', {
    ...props.widgetForm,
    list: handleListInsert(list[index].key, oldList, copyData),
  })

  emit('update:widgetFormSelect', copyData)
}

const handleDeleteClick = (index: number, list: any[]) => {
  const oldList = JSON.parse(JSON.stringify(props.widgetForm.list))

  if (list.length - 1 === index) {
    if (index === 0)
      nextTick(() => emit('update:widgetFormSelect', null))

    else
      emit('update:widgetFormSelect', list[index - 1])
  }
  else {
    emit('update:widgetFormSelect', list[index + 1])
  }

  emit('update:widgetForm', {
    ...props.widgetForm,
    list: handleListDelete(list[index].key, oldList),
  })
}

const handleMoveAdd = (event: any) => {
  const { newIndex } = event

  const list = JSON.parse(JSON.stringify(props.widgetForm.list))
  list[newIndex] = {
    ...list[newIndex],
    rules: [],
  }

  if (
    list[newIndex].type === 'radio'
        || list[newIndex].type === 'checkbox'
        || list[newIndex].type === 'select'
  ) {
    list[newIndex] = {
      ...list[newIndex],
      options: {
        ...list[newIndex].options,
        options: list[newIndex].options.options.map((item: any) => ({
          ...item,
        })),
      },
    }
  }

  if (list[newIndex].type === 'grid') {
    list[newIndex] = {
      ...list[newIndex],
      columns: list[newIndex].columns.map((item: any) => ({ ...item })),
    }
  }
  emit('update:widgetForm', { ...props.widgetForm, list })

  emit('update:widgetFormSelect', list[newIndex])
}

const handleColMoveAdd = (
  event: any,
  row: any,
  index: string | number | symbol,
) => {
  const { newIndex } = event
  emit('update:widgetFormSelect', row.columns[index].list[newIndex])
}
</script>
<style lang="scss">
.widget-view {
  @apply relative m-0.5 p-1 border border-dashed border-gray-300;

  &.active {
    @apply border-solid border-blue-500 outline outline-2 outline-blue-500;
  }

  &:hover {
    @apply border-blue-500 bg-blue-50;
  }
}

.widget-col {
  @apply relative m-0.5 border border-dashed border-gray-300;

  &.active {
    @apply border-solid border-yellow-500 outline outline-2 outline-yellow-500;
  }

  &:hover {
    @apply border-yellow-500 bg-yellow-50;
  }
}
</style>
