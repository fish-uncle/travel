<template>
  <div class="list">
    <div v-for="item in list" class="item">
      <div class="item-name">
        <img :src="avatar" alt="" />
        <span>{{ name }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import avatar from "../../../assets/images/avatar.jpeg";
import { list } from "../../../config/travel";

const name = ref("Fish Uncle");
</script>
<style lang="scss" scoped>
.list {
  background-color: #f5f5f5;
  height: 100px;
}
.item {
  border-radius: 4px;
}
.item-name {
  padding: 12px;
  display: flex;
  align-items: center;
  img {
    width: 20px;
    border-radius: 20px;
    height: 20px;
  }
  span {
    margin-left: 6px;
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
