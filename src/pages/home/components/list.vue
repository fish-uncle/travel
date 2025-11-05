<template>
  <div class="list">
    <div v-for="item in record" class="item">
      <div class="img" :style="{ backgroundImage: `url(${item.url})` }" />
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
  flex: 1;
  flex-wrap: wrap;
  padding: 5px 10px 20px 10px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
.item {
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 4px;
  width: calc(50% - 10px);
  img {
    border-radius: 4px 4px 0 0;
    width: 100%;
  }
  .img {
    border-radius: 4px 4px 0 0;
    background-size: cover;
    width: 100%;
    height: 100%;
    background-position: center;
  }
  &:nth-child(2n) {
    margin-left: 20px;
  }
}
.item-city {
  padding: 12px 0 0 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
.item-name {
  padding: 12px 0 12px 0;
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
