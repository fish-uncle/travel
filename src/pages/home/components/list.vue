<template>
  <div class="list">
    <div v-for="item in record" class="item">
      <img :src="item.url" />
      <div class="item-city">{{ item.city }}</div>
      <div class="item-name">
        <img :src="avatar" alt="" />
        <span>{{ nickname }}</span>
        <a>{{ item.time }}</a>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { record, nickname, avatar } from "../../../config/travel";
</script>
<style lang="scss" scoped>
.list {
  background-color: #f5f5f5;
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  height: calc(100vh - 230px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
.item {
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 4px;
  width: calc(50% - 4px);
  img {
    border-radius: 4px 4px 0 0;
    width: 100%;
  }
  &:nth-child(2n) {
    margin-left: 4px;
  }
}
.item-city {
  padding: 12px 12px 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
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
  a {
    font-size: 12px;
    margin-left: auto;
    color: #333;
  }
  span {
    margin-left: 6px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
  }
}
</style>
