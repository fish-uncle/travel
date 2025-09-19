<template>
  <div class="test-api">
    <h1>API 测试页面</h1>
    
    <div class="test-section">
      <h2>测试获取所有行程</h2>
      <button @click="testGetAllTrips">获取所有行程</button>
      <div v-if="allTrips.length > 0">
        <h3>行程列表：</h3>
        <ul>
          <li v-for="trip in allTrips" :key="trip.id">
            <a :href="`/trip/${trip.id}`">{{ trip.title }}</a> ({{ trip.startAt }} - {{ trip.endAt }})
          </li>
        </ul>
      </div>
    </div>

    <div class="test-section">
      <h2>测试获取单个行程</h2>
      <input v-model="testTripId" placeholder="输入行程ID" />
      <button @click="testGetTrip">获取行程详情</button>
      <div v-if="testTrip">
        <h3>行程详情：</h3>
        <pre>{{ JSON.stringify(testTrip, null, 2) }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h2>错误信息</h2>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Trip } from '~/types'

const allTrips = ref<Trip[]>([])
const testTrip = ref<Trip | null>(null)
const testTripId = ref('c10260b2-25a8-4d6e-a9aa-10aab94de76')
const error = ref('')

const testGetAllTrips = async () => {
  try {
    error.value = ''
    const response = await fetch('/api/trips')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    allTrips.value = await response.json()
  } catch (err) {
    error.value = `获取所有行程失败: ${err}`
    console.error('Error:', err)
  }
}

const testGetTrip = async () => {
  try {
    error.value = ''
    const response = await fetch(`/api/trips/${testTripId.value}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    testTrip.value = await response.json()
  } catch (err) {
    error.value = `获取行程详情失败: ${err}`
    console.error('Error:', err)
  }
}
</script>

<style scoped lang="scss">
.test-api {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  padding: 8px 16px;
  margin: 8px;
  background: #0ABFC5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input {
  padding: 8px;
  margin: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
}

.error {
  color: red;
  background: #ffe6e6;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
