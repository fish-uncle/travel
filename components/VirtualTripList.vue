<template>
  <div class="virtual-trip-list">
    <RecycleScroller
      class="scroller"
      :items="trips"
      :item-size="200"
      key-field="id"
      v-slot="{ item }"
    >
      <TripCard
        :trip="item"
        @click="handleTripClick"
        @edit="handleTripEdit"
        @delete="handleTripDelete"
      />
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'
import type { Trip } from '~/types'

interface Props {
  trips: Trip[]
}

defineProps<Props>()

const emit = defineEmits<{
  tripClick: [trip: Trip]
  tripEdit: [trip: Trip]
  tripDelete: [trip: Trip]
}>()

const handleTripClick = (trip: Trip) => {
  emit('tripClick', trip)
}

const handleTripEdit = (trip: Trip) => {
  emit('tripEdit', trip)
}

const handleTripDelete = (trip: Trip) => {
  emit('tripDelete', trip)
}
</script>

<style scoped lang="scss">
.virtual-trip-list {
  height: 100%;
  width: 100%;
}

.scroller {
  height: 100%;
  width: 100%;
}

// 导入虚拟滚动样式
@import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
</style>
