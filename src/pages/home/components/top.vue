<template>
  <header>
    <div class="avatar-bg"></div>
    <div class="avatar-placeholder"></div>
    <div class="avatar-card">
      <div class="avatar">
        <img :src="avatar" alt="avatar" />
      </div>
      <div class="avatar-info">
        <h1 class="name">{{ name }}</h1>
        <ul>
          <li v-for="(item, index) in list" :key="index">
            <div class="icon" v-html="item.icon" />
            <span>{{ item.label }}</span>
            <a>{{ item.value }}</a>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import avatar from "../../../assets/images/avatar.jpeg";
import tiktok from "../../../assets/svg/tiktok.svg?raw";
import bilibili from "../../../assets/svg/bilibili.svg?raw";
import wechat from "../../../assets/svg/wechat.svg?raw";
import xiaohongshu from "../../../assets/svg/xiaohongshu.svg?raw";

const name = ref("Fish Uncle");
const list = ref([
  { icon: xiaohongshu, label: "小红书号：", value: "fish_uncle" },
  { icon: wechat, label: "视频号：", value: "Fish.Uncle" },
  { icon: tiktok, label: "抖音号：", value: "fish.uncle" },
  { icon: bilibili, label: "哔哩哔哩号：", value: "Fish__Uncle" },
]);
</script>
<style lang="scss" scoped>
header {
  height: 200px;
  position: relative;
  padding: 16px;
}
.avatar-placeholder {
  background-color: rgba(0, 0, 0, 0.55);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;
}
.avatar-bg {
  background-image: url("../../../assets/images/avatar-bg.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}
.avatar-card {
  position: relative;
  z-index: 3;
  display: flex;
  li {
    display: flex;
    align-items: center;
  }
  .icon {
    width: 12px;
    color: #fff;
    margin-right: 4px;
    fill: currentColor;
  }
  h1 {
    color: #fff;
    font-size: 20px;
    font-weight: 600;
  }
  span,
  a {
    color: hsla(0, 0%, 100%, 0.6);
    font-size: 10px;
    font-weight: 400;
  }
}
.avatar-info {
  display: flex;
  flex-direction: column;
}
.avatar {
  width: 80px;
  height: 80px;
  margin-right: 16px;
  border: 1px solid hsla(0, 0%, 100%, 0.6);
  border-radius: 100%;
  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}
</style>
