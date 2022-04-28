<template>
  <el-form
    label-suffix=":"
    bg-gray-50 relative flex="~ 1"
    v-bind="config"
  >
    <div v-if="!list?.length" text="gray-400 lg" absolute top-50 left="1/2" translate-x="-1/2">
      从左侧拖拽来添加字段
    </div>

    <Draggable
      class="flex-1 m-2 bg-white shadow p-1"
      item-key="key"
      handle="[cursor-move]"
      :animation="200"
      group="form-design"
      :list="list"
      @add="selectWidget=list[$event.newIndex]"
    >
      <template #item="{ element, index }">
        <WidgetFormItem
          v-model:selectWidget="selectWidget"
          :element="element"
          :index="index"
          :list="list"
        />
      </template>
    </Draggable>
  </el-form>
</template>

<script lang="ts" setup>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem.vue'
import type { WidgetForm } from '@/config'

const props = defineProps<{ list: any; config: WidgetForm['config']; selectWidget: any }>()
defineEmits(['update:selectWidget'])
const selectWidget = useVModel(props, 'selectWidget')
</script>

<style lang="scss">
.widget-view {
  @apply relative m-0.5 p-1 border border-dashed border-gray-300;

  &.col {
    @apply grid grid-cols-24;
  }

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
