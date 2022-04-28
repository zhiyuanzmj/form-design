<template>
  <div class="px-3 py-2 text-sm text-gray-700">
    {{ title }}
  </div>
  <Draggable
    tag="ul"
    class="m-0 p-3 pt-0 grid grid-cols-2 gap-1"
    item-key="type"
    :group="{ name: 'form-design', pull: 'clone', put: false }"
    :clone="cloneWidget"
    :sort="false"
    :list="list"
  >
    <template #item="{ element }">
      <li
        v-if="fields.includes(element.type)"
        class="bg-gray-100 text-xs text-gray-700 hover:text-blue-500 leading-8 cursor-move -outline-offset-1 hover:outline-dashed outline-1 outline-blue-500 list-none flex items-center"
      >
        <i :class="'custom:'+element.type" class="ml-2 mr-1" />
        <span>{{ element.label }}</span>
      </li>
    </template>
  </Draggable>
</template>
<script lang="ts" setup>
import Draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'

defineProps<{ fields: any[]; title: string; list: any[] }>()
</script>

<script lang="ts">
export function cloneWidget(params: any) {
  const key = Math.random().toString(36).substring(2, 9)
  params = cloneDeep({
    ...params,
    key,
    model: `${params.type}_${key}`,
  })
  if (params.type === 'grid') {
    params.columns.forEach((i: any) => {
      i.list = i.list.map(cloneWidget)
    })
  }
  return params
}
</script>
