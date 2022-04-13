
<script lang="ts" setup>
const { preview = true, generateJson = true, uploadJson = true, clearable = true } = defineProps<{
  preview?: boolean
  generateJson?: boolean
  uploadJson?: boolean
  clearable?: boolean
}>()
defineEmits(['uploadJson', 'clearable', 'preview', 'generateJson'])
defineOptions({
  name: 'CustomHeader',
})
</script>
<template>
  <header class="flex gap-2 items-center justify-end h-11 py-0 px-2 border-0 border-b border-solid border-gray-200">
    <slot />
    <el-button
      v-if="uploadJson"
      type="text"
      @click="$emit('uploadJson')"
    >
      <template #icon>
        <i class="custom:upload" />
      </template>
      导入JSON
    </el-button>
    <el-button
      v-if="generateJson"
      type="text"
      @click="$emit('generateJson')"
    >
      <template #icon>
        <i class="custom:generate-json" />
      </template>
      生成JSON
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
