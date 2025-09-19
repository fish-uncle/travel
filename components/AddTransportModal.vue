<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>添加交通</h3>
        <button class="close-btn" @click="closeModal">
          <Icon name="carbon:close" size="20" />
        </button>
      </div>
      
      <div class="modal-body">
        <div class="transport-type-selector">
          <button
            v-for="type in transportTypes"
            :key="type.value"
            class="type-btn"
            :class="{ active: selectedType === type.value }"
            @click="selectedType = type.value"
          >
            <Icon :name="type.icon" size="20" />
            <span>{{ type.label }}</span>
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="transport-form">
          <!-- 航班表单 -->
          <div v-if="selectedType === 'flight'" class="form-section">
            <div class="form-row">
              <div class="form-group">
                <label>航班号</label>
                <input v-model="formData.flightNo" type="text" placeholder="如：CA1234" />
              </div>
              <div class="form-group">
                <label>时间</label>
                <input v-model="formData.time" type="time" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>出发地</label>
                <input v-model="formData.from" type="text" placeholder="如：北京" />
              </div>
              <div class="form-group">
                <label>目的地</label>
                <input v-model="formData.to" type="text" placeholder="如：上海" />
              </div>
            </div>
            <div class="form-group">
              <label>机场/航站楼</label>
              <input v-model="formData.address" type="text" placeholder="如：首都机场T3" />
            </div>
          </div>
          
          <!-- 火车表单 -->
          <div v-else-if="selectedType === 'train'" class="form-section">
            <div class="form-row">
              <div class="form-group">
                <label>车次</label>
                <input v-model="formData.trainNo" type="text" placeholder="如：G1234" />
              </div>
              <div class="form-group">
                <label>时间</label>
                <input v-model="formData.time" type="time" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>出发地</label>
                <input v-model="formData.from" type="text" placeholder="如：北京南站" />
              </div>
              <div class="form-group">
                <label>目的地</label>
                <input v-model="formData.to" type="text" placeholder="如：上海虹桥" />
              </div>
            </div>
            <div class="form-group">
              <label>座位信息</label>
              <input v-model="formData.address" type="text" placeholder="如：二等座 8车12A" />
            </div>
          </div>
          
          <!-- 巴士表单 -->
          <div v-else-if="selectedType === 'bus'" class="form-section">
            <div class="form-row">
              <div class="form-group">
                <label>班次</label>
                <input v-model="formData.busNo" type="text" placeholder="如：B001" />
              </div>
              <div class="form-group">
                <label>时间</label>
                <input v-model="formData.time" type="time" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>出发地</label>
                <input v-model="formData.from" type="text" placeholder="如：北京站" />
              </div>
              <div class="form-group">
                <label>目的地</label>
                <input v-model="formData.to" type="text" placeholder="如：天津站" />
              </div>
            </div>
            <div class="form-group">
              <label>上车地点</label>
              <input v-model="formData.address" type="text" placeholder="如：北京站广场" />
            </div>
          </div>
          
          <!-- 其他交通表单 -->
          <div v-else class="form-section">
            <div class="form-row">
              <div class="form-group">
                <label>交通方式</label>
                <input v-model="formData.transportName" type="text" placeholder="如：出租车、地铁等" />
              </div>
              <div class="form-group">
                <label>时间</label>
                <input v-model="formData.time" type="time" />
              </div>
            </div>
            <div class="form-group">
              <label>详细信息</label>
              <input v-model="formData.address" type="text" placeholder="如：从酒店到机场" />
            </div>
          </div>
          
          <!-- 位置信息 -->
          <div class="form-group">
            <label>坐标信息（可选）</label>
            <div class="coordinates-section">
              <div class="coordinate-group">
                <label class="coordinate-label">出发地坐标</label>
                <div class="location-inputs">
                  <input v-model.number="formData.fromLat" type="number" step="0.000001" placeholder="纬度" />
                  <input v-model.number="formData.fromLng" type="number" step="0.000001" placeholder="经度" />
                  <button type="button" class="location-btn" @click="getFromLocation">
                    <Icon name="carbon:location" size="16" />
                  </button>
                </div>
              </div>
              <div class="coordinate-group">
                <label class="coordinate-label">到达地坐标</label>
                <div class="location-inputs">
                  <input v-model.number="formData.toLat" type="number" step="0.000001" placeholder="纬度" />
                  <input v-model.number="formData.toLng" type="number" step="0.000001" placeholder="经度" />
                  <button type="button" class="location-btn" @click="getToLocation">
                    <Icon name="carbon:location" size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 备注 -->
          <div class="form-group">
            <label>备注</label>
            <textarea v-model="formData.note" placeholder="添加备注信息..."></textarea>
          </div>
        </form>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">
          取消
        </button>
        <button type="submit" class="btn btn-primary" @click="handleSubmit" :disabled="!canSubmit">
          添加
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Item, ItemType } from '~/types'

interface Props {
  show: boolean
  dayDate: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  add: [item: Item]
}>()

// 交通类型选项
const transportTypes = [
  { value: 'flight', label: '航班', icon: 'carbon:airplane' },
  { value: 'train', label: '火车', icon: 'carbon:train' },
  { value: 'bus', label: '巴士', icon: 'carbon:bus' },
  { value: 'other', label: '其他', icon: 'carbon:car' }
]

// 选中的交通类型
const selectedType = ref<ItemType>('flight')

// 表单数据
const formData = ref({
  flightNo: '',
  trainNo: '',
  busNo: '',
  transportName: '',
  time: '',
  from: '',
  to: '',
  address: '',
  fromLat: null as number | null,
  fromLng: null as number | null,
  toLat: null as number | null,
  toLng: null as number | null,
  note: ''
})

// 是否可以提交
const canSubmit = computed(() => {
  if (selectedType.value === 'flight') {
    return formData.value.flightNo && formData.value.time && formData.value.from && formData.value.to
  } else if (selectedType.value === 'train') {
    return formData.value.trainNo && formData.value.time && formData.value.from && formData.value.to
  } else if (selectedType.value === 'bus') {
    return formData.value.busNo && formData.value.time && formData.value.from && formData.value.to
  } else {
    return formData.value.transportName && formData.value.time
  }
})

// 监听交通类型变化，重置表单
watch(selectedType, () => {
  resetForm()
})

// 重置表单
const resetForm = () => {
  formData.value = {
    flightNo: '',
    trainNo: '',
    busNo: '',
    transportName: '',
    time: '',
    from: '',
    to: '',
    address: '',
    fromLat: null,
    fromLng: null,
    toLat: null,
    toLng: null,
    note: ''
  }
}

// 获取出发地位置
const getFromLocation = () => {
  if (!navigator.geolocation) {
    alert('您的浏览器不支持地理定位')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      formData.value.fromLat = position.coords.latitude
      formData.value.fromLng = position.coords.longitude
    },
    (error) => {
      console.error('获取位置失败:', error)
      alert('获取位置失败，请手动输入坐标')
    }
  )
}

// 获取到达地位置
const getToLocation = () => {
  if (!navigator.geolocation) {
    alert('您的浏览器不支持地理定位')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      formData.value.toLat = position.coords.latitude
      formData.value.toLng = position.coords.longitude
    },
    (error) => {
      console.error('获取位置失败:', error)
      alert('获取位置失败，请手动输入坐标')
    }
  )
}

// 提交表单
const handleSubmit = () => {
  if (!canSubmit.value) return
  
  const item: Item = {
    id: crypto.randomUUID(),
    type: selectedType.value,
    time: formData.value.time,
    note: formData.value.note ? {
      text: formData.value.note,
      attachments: []
    } : undefined
  }
  
  // 根据交通类型设置特定字段
  if (selectedType.value === 'flight') {
    item.flightNo = formData.value.flightNo
    item.from = formData.value.from
    item.to = formData.value.to
    item.address = formData.value.address
  } else if (selectedType.value === 'train') {
    item.trainNo = formData.value.trainNo
    item.from = formData.value.from
    item.to = formData.value.to
    item.address = formData.value.address
  } else if (selectedType.value === 'bus') {
    item.from = formData.value.from
    item.to = formData.value.to
    item.address = formData.value.address
  } else {
    item.address = formData.value.address
  }
  
  // 设置坐标信息
  if (formData.value.fromLat && formData.value.fromLng) {
    item.coordinates = {
      from: {
        lat: formData.value.fromLat,
        lng: formData.value.fromLng
      }
    }
  }
  
  if (formData.value.toLat && formData.value.toLng) {
    if (!item.coordinates) {
      item.coordinates = {}
    }
    item.coordinates.to = {
      lat: formData.value.toLat,
      lng: formData.value.toLng
    }
  }
  
  emit('add', item)
  closeModal()
}

// 关闭模态框
const closeModal = () => {
  resetForm()
  emit('close')
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-md;
}

.modal-content {
  background: white;
  border-radius: $radius-lg;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  border-bottom: 1px solid $divider;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
  }
}

.close-btn {
  @include button-circle;
  width: 32px;
  height: 32px;
  background: transparent;
  color: $text-secondary;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-lg;
}

.transport-type-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;
}

.type-btn {
  @include button-base;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-md;
  background: #f8f9fa;
  color: $text-secondary;
  border: 2px solid transparent;
  
  &.active {
    background: rgba($primary-color, 0.1);
    color: $primary-color;
    border-color: $primary-color;
  }
  
  &:hover:not(.active) {
    background: #e9ecef;
  }
}

.transport-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  
  label {
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
  }
  
  input, textarea {
    padding: $spacing-sm;
    border: 1px solid $divider;
    border-radius: $radius-sm;
    font-size: 14px;
    transition: border-color $transition-fast;
    
    &:focus {
      outline: none;
      border-color: $primary-color;
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 80px;
  }
}

.coordinates-section {
  .coordinate-group {
    margin-bottom: 12px;
    
    .coordinate-label {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
      color: $text-secondary;
      font-weight: 500;
    }
  }
}

.location-inputs {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
  
  input {
    flex: 1;
  }
}

.location-btn {
  @include button-secondary;
  padding: $spacing-sm $spacing-md;
  font-size: 12px;
  white-space: nowrap;
}

.modal-footer {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg;
  border-top: 1px solid $divider;
  justify-content: flex-end;
}

.btn {
  @include button-base;
  padding: $spacing-sm $spacing-lg;
}

.btn-primary {
  @include button-primary;
}

.btn-secondary {
  @include button-secondary;
}

// 暗黑模式
@media (prefers-color-scheme: dark) {
  .modal-content {
    background: $dark-background;
  }
  
  .modal-header {
    border-color: $dark-divider;
    
    h3 {
      color: $dark-text-primary;
    }
  }
  
  .type-btn {
    background: rgba(255, 255, 255, 0.05);
    color: $dark-text-secondary;
    
    &.active {
      background: rgba($primary-color, 0.2);
      color: $primary-color;
    }
    
    &:hover:not(.active) {
      background: rgba(255, 255, 255, 0.1);
    }
  }
  
  .form-group {
    label {
      color: $dark-text-primary;
    }
    
    input, textarea {
      background: rgba(255, 255, 255, 0.05);
      border-color: $dark-divider;
      color: $dark-text-primary;
      
      &:focus {
        border-color: $primary-color;
      }
    }
  }
  
  .modal-footer {
    border-color: $dark-divider;
  }
}
</style>
