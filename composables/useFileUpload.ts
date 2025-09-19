import { ref, readonly } from 'vue'

export interface UploadOptions {
  maxSize?: number // 最大文件大小（字节）
  allowedTypes?: string[] // 允许的文件类型
  quality?: number // 图片压缩质量 (0-1)
  maxWidth?: number // 最大宽度
  maxHeight?: number // 最大高度
}

export interface UploadResult {
  data: string // base64 数据
  name: string // 文件名
  size: number // 文件大小
  type: string // 文件类型
}

export const useFileUpload = () => {
  const isUploading = ref(false)
  const uploadProgress = ref(0)

  // 压缩图片
  const compressImage = (
    file: File, 
    options: UploadOptions = {}
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const {
        quality = 0.8,
        maxWidth = 1920,
        maxHeight = 1080
      } = options

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()

      img.onload = () => {
        try {
          let { width, height } = img

          // 计算压缩后的尺寸
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

          // 转换为 base64
          const base64 = canvas.toDataURL('image/jpeg', quality)
          resolve(base64)
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error('图片加载失败'))
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // 压缩 PDF
  const compressPDF = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = () => {
        try {
          const base64 = reader.result as string
          resolve(base64)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => {
        reject(new Error('PDF 读取失败'))
      }

      reader.readAsDataURL(file)
    })
  }

  // 验证文件
  const validateFile = (file: File, options: UploadOptions = {}): string | null => {
    const {
      maxSize = 5 * 1024 * 1024, // 默认 5MB
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    } = options

    // 检查文件大小
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / 1024 / 1024)
      return `文件大小不能超过 ${maxSizeMB}MB`
    }

    // 检查文件类型
    if (!allowedTypes.includes(file.type)) {
      return `不支持的文件类型: ${file.type}`
    }

    return null
  }

  // 上传文件
  const uploadFile = async (
    file: File, 
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    isUploading.value = true
    uploadProgress.value = 0

    try {
      // 验证文件
      const validationError = validateFile(file, options)
      if (validationError) {
        throw new Error(validationError)
      }

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        uploadProgress.value = Math.min(uploadProgress.value + 10, 90)
      }, 100)

      let data: string

      // 根据文件类型处理
      if (file.type.startsWith('image/')) {
        data = await compressImage(file, options)
      } else if (file.type === 'application/pdf') {
        data = await compressPDF(file)
      } else {
        // 其他文件类型直接转换为 base64
        data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(new Error('文件读取失败'))
          reader.readAsDataURL(file)
        })
      }

      clearInterval(progressInterval)
      uploadProgress.value = 100

      const result: UploadResult = {
        data,
        name: file.name,
        size: file.size,
        type: file.type
      }

      return result
    } catch (error) {
      throw error
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }

  // 批量上传文件
  const uploadFiles = async (
    files: FileList | File[], 
    options: UploadOptions = {}
  ): Promise<UploadResult[]> => {
    const fileArray = Array.from(files)
    const results: UploadResult[] = []

    for (let i = 0; i < fileArray.length; i++) {
      try {
        const result = await uploadFile(fileArray[i], options)
        results.push(result)
        
        // 更新进度
        uploadProgress.value = Math.round(((i + 1) / fileArray.length) * 100)
      } catch (error) {
        console.error(`文件 ${fileArray[i].name} 上传失败:`, error)
        // 可以选择继续上传其他文件或停止
      }
    }

    return results
  }

  // 从 URL 下载并上传文件
  const uploadFromUrl = async (
    url: string, 
    filename: string, 
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    isUploading.value = true
    uploadProgress.value = 0

    try {
      // 下载文件
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('文件下载失败')
      }

      const blob = await response.blob()
      const file = new File([blob], filename, { type: blob.type })

      // 上传文件
      const result = await uploadFile(file, options)
      return result
    } catch (error) {
      throw error
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }

  // 获取文件信息
  const getFileInfo = (file: File) => {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      sizeFormatted: formatFileSize(file.size)
    }
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 检查是否为图片文件
  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/')
  }

  // 检查是否为 PDF 文件
  const isPDFFile = (file: File): boolean => {
    return file.type === 'application/pdf'
  }

  // 生成文件预览 URL
  const createPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file)
  }

  // 清理预览 URL
  const revokePreviewUrl = (url: string): void => {
    URL.revokeObjectURL(url)
  }

  return {
    isUploading: readonly(isUploading),
    uploadProgress: readonly(uploadProgress),
    uploadFile,
    uploadFiles,
    uploadFromUrl,
    compressImage,
    compressPDF,
    validateFile,
    getFileInfo,
    formatFileSize,
    isImageFile,
    isPDFFile,
    createPreviewUrl,
    revokePreviewUrl
  }
}
