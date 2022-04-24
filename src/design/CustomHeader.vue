
<script lang="ts" setup>
const { preview = true, generateJson = true, clearable = true } = defineProps<{
  preview?: boolean
  generateJson?: boolean
  clearable?: boolean
}>()

defineEmits(['clearable', 'preview', 'generateJson'])

defineOptions({ name: 'CustomHeader' })
</script>
<template>
  <header b="0 b solid gray-200" flex gap-2 items-center justify-end h-11 py-0 px-2>
    <slot />
    <el-button
      v-if="generateJson"
      type="text"
      @click="$emit('generateJson')"
    >
      <template #icon>
        <i class="ep:edit" />
      </template>
      修改
    </el-button>
    <el-button
      v-if="clearable"
      type="text"
      @click="$emit('clearable')"
    >
      <template #icon>
        <i class="custom:clearable" />
      </template>
      清空
    </el-button>
    <el-button
      v-if="preview"
      type="text"
      @click="$emit('preview')"
    >
      <template #icon>
        <i class="custom:preview" />
      </template>
      预览
    </el-button>
  </header>
</template>
