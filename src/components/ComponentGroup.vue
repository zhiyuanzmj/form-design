<template>
  <div class="px-3 py-2 text-sm text-gray-700">{{ title }}</div>
  <Draggable
    tag="ul"
    class="m-0 p-3 pt-0 grid grid-cols-2 gap-1"
    item-key="type"
    :group="{ name: 'people', pull: 'clone', put: false }"
    :clone="clone"
    :sort="false"
    :list="list"
  >
    <template #item="{ element }">
      <li
        v-if="fields.includes(element.type)"
        class="bg-gray-100 text-xs text-gray-700 hover:text-blue-400 leading-8 cursor-move -outline-offset-1 hover:outline-dashed outline-1 outline-blue-400 list-none flex items-center"
      >
        <i :class="'custom:'+element.type" class="ml-2 mr-1" />
        <span>{{ element.label }}</span>
      </li>
    </template>
  </Draggable>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash-es'
import Draggable from 'vuedraggable'

defineProps<{ fields: string[]; title: string; list: any[] }>()

function clone(params: any) {
  const key = Math.random().toString(36).substring(2, 9)
  return cloneDeep({
    ...params,
    key,
    model: `${params.type}_${key}`,
    rules: [],
  })
}
</script>
