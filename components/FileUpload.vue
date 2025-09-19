<template>
  <div class="file-upload">
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple"
      class="hidden-input"
      @change="handleFileSelect"
    />
    
    <div
      class="upload-area"
      :class="{ 
        'is-dragover': isDragOver,
        'is-uploading': isUploading,
        'has-files': files.length > 0
      }"
      @click="triggerFileSelect"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div v-if="isUploading" class="upload-loading">
        <div class="spinner"></div>
        <p>上传中...</p>
      </div>
      
      <div v-else-if="files.length === 0" class="upload-placeholder">
        <Icon name="carbon:cloud-upload" size="32" />
        <p class="upload-text">{{ placeholder }}</p>
        <p class="upload-hint">{{ hint }}</p>
      </div>
      
      <div v-else class="upload-preview">
        <div v-for="(file, index) in files" :key="file.id" class="file-item">
          <div class="file-icon">
            <Icon :name="getFileIcon(file.type)" size="20" />
          </div>
          <div class="file-info">
            <p class="file-name">{{ file.name }}</p>
            <p class="file-size">{{ formatFileSize(file.size) }}</p>
          </div>
          <button
            class="remove-btn"
            @click.stop="removeFile(index)"
          >
            <Icon name="carbon:close" size="16" />
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="error" class="error-message">
      <Icon name="carbon:warning" size="16" />
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Attachment } from '~/types'

interface Props {
  accept?: string
  multiple?: boolean
  maxSize?: number // MB
  placeholder?: string
  hint?: string
  modelValue?: Attachment[]
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*,application/pdf',
  multiple: false,
  maxSize: 5, // 5MB
  placeholder: '点击或拖拽上传文件',
  hint: '支持图片和PDF，最大5MB'
})

const emit = defineEmits<{
  'update:modelValue': [files: Attachment[]]
  'upload': [files: Attachment[]]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const isUploading = ref(false)
const error = ref('')
const files = ref<Attachment[]>(props.modelValue || [])

// 触发文件选择
const triggerFileSelect = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFiles = Array.from(target.files || [])
  await processFiles(selectedFiles)
}

// 处理拖拽悬停
const handleDragOver = (event: DragEvent) => {
  isDragOver.value = true
}

// 处理拖拽离开
const handleDragLeave = (event: DragEvent) => {
  isDragOver.value = false
}

// 处理文件拖拽
const handleDrop = async (event: DragEvent) => {
  isDragOver.value = false
  const droppedFiles = Array.from(event.dataTransfer?.files || [])
  await processFiles(droppedFiles)
}

// 处理文件
const processFiles = async (fileList: File[]) => {
  if (fileList.length === 0) return
  
  error.value = ''
  isUploading.value = true
  
  try {
    const newFiles: Attachment[] = []
    
    for (const file of fileList) {
      // 检查文件大小
      if (file.size > props.maxSize * 1024 * 1024) {
        throw new Error(`文件 ${file.name} 超过 ${props.maxSize}MB 限制`)
      }
      
      // 检查文件类型
      if (!isValidFileType(file.type)) {
        throw new Error(`不支持的文件类型: ${file.type}`)
      }
      
      // 压缩并转换为base64
      const base64 = await convertToBase64(file)
      
      const attachment: Attachment = {
        id: generateId(),
        type: file.type.startsWith('image/') ? 'image' : 'pdf',
        data: base64,
        name: file.name
      }
      
      newFiles.push(attachment)
    }
    
    if (props.multiple) {
      files.value = [...files.value, ...newFiles]
    } else {
      files.value = newFiles
    }
    
    emit('update:modelValue', files.value)
    emit('upload', newFiles)
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : '文件处理失败'
  } finally {
    isUploading.value = false
  }
}

// 检查文件类型
const isValidFileType = (type: string): boolean => {
  const validTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ]
  return validTypes.includes(type)
}

// 转换为base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('image/')) {
      // 图片压缩
      compressImage(file).then(resolve).catch(reject)
    } else {
      // PDF直接转换
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    }
  })
}

// 图片压缩
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      const maxWidth = 1200
      const maxHeight = 1200
      let { width, height } = img
      
      // 计算压缩尺寸
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      // 绘制压缩后的图片
      ctx.drawImage(img, 0, 0, width, height)
      
      // 转换为base64
      const quality = file.size > 1024 * 1024 ? 0.7 : 0.9
      const base64 = canvas.toDataURL('image/jpeg', quality)
      resolve(base64)
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

// 获取文件图标
const getFileIcon = (type: string): string => {
  if (type.startsWith('image/')) {
    return 'carbon:image'
  } else if (type === 'application/pdf') {
    return 'carbon:document-pdf'
  } else {
    return 'carbon:document'
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// 生成ID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// 移除文件
const removeFile = (index: number) => {
  files.value.splice(index, 1)
  emit('update:modelValue', files.value)
}
</script>

<style scoped lang="scss">
.file-upload {
  width: 100%;
}

.hidden-input {
  display: none;
}

.upload-area {
  border: 2px dashed $divider;
  border-radius: $radius-md;
  padding: $spacing-lg;
  text-align: center;
  cursor: pointer;
  transition: all $transition-normal;
  background: white;
  
  &:hover {
    border-color: $primary-color;
    background: rgba($primary-color, 0.02);
  }
  
  &.is-dragover {
    border-color: $primary-color;
    background: rgba($primary-color, 0.05);
  }
  
  &.is-uploading {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  &.has-files {
    padding: $spacing-md;
  }
}

.upload-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  color: $text-secondary;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid $divider;
  border-top: 2px solid $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  color: $text-secondary;
}

.upload-text {
  font-size: 16px;
  font-weight: 500;
  color: $text-primary;
}

.upload-hint {
  font-size: 14px;
  color: $text-secondary;
}

.upload-preview {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.file-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm;
  background: #f8f9fa;
  border-radius: $radius-sm;
}

.file-icon {
  color: $primary-color;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.file-size {
  font-size: 12px;
  color: $text-secondary;
  margin: 0;
}

.remove-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: $text-secondary;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: $error-color;
  }
}

.error-message {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  margin-top: $spacing-sm;
  padding: $spacing-sm;
  background: rgba($error-color, 0.1);
  color: $error-color;
  border-radius: $radius-sm;
  font-size: 14px;
}

// 暗黑模式
@media (prefers-color-scheme: dark) {
  .upload-area {
    background: $dark-background;
    border-color: $dark-divider;
  }
  
  .file-item {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .upload-text {
    color: $dark-text-primary;
  }
  
  .file-name {
    color: $dark-text-primary;
  }
}
</style>