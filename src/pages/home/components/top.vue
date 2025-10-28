<template>
  <header>
    <div class="avatar-bg"></div>
    <div class="avatar-placeholder"></div>
    <div class="avatar-card">
      <div class="avatar-top">
        <div class="avatar">
          <img :src="avatar" alt="avatar" />
        </div>
        <div class="avatar-right">
          <h1 class="name">{{ nickname }}</h1>
          <div class="avatar-info">
            <ul v-for="row in account">
              <li v-for="(item, index) in row" :key="index">
                <div class="icon" v-html="item.icon" />
                <span>{{ item.label }}</span>
                <a>{{ item.value }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="avatar-center" v-html="introduction"></div>
      <div class="avatar-bottom">
        <div class="avatar-bottom-item">
          <a>{{ FollowingNumber }}</a>
          <span>Following</span>
        </div>
        <div class="avatar-bottom-item">
          <a>{{ FollowersNumber }}</a>
          <span>Followers</span>
        </div>
        <div class="avatar-bottom-item">
          <a>{{ LikesColNumber }}</a>
          <span>Likes & Col</span>
        </div>
        <btn class="btn">Following</btn>
      </div>
    </div>
  </header>
</template>
<script lang="ts" setup>
import btn from "./btn.vue";
import {
  FollowingNumber,
  FollowersNumber,
  LikesColNumber,
  avatar,
  nickname,
  introduction,
  account,
} from "../../../config/travel";
</script>
<style lang="scss" scoped>
header {
  height: 280px;
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
  background-position: center;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}
.avatar-center {
  margin-top: 16px;
  color: #fff;
  font-size: 13px;
}
.avatar-bottom {
  display: flex;
  margin-top: 24px;
  position: relative;
  align-items: center;
  .btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
.avatar-bottom-item {
  display: flex;
  flex-direction: column;
  color: #fff;
  margin-right: 14px;
  a {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
  }
  span {
    color: hsla(0, 0%, 100%, 0.8);
    font-size: 12px;
    margin-top: 2px;
  }
}
.avatar-card {
  position: relative;
  z-index: 3;
}
.avatar-top {
  display: flex;
  h1 {
    color: #fff;
    font-size: 20px;
    font-weight: 600;
  }
}
.avatar-info {
  display: flex;
  ul {
    + ul {
      margin-left: 10px;
    }
  }
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
  span,
  a {
    color: hsla(0, 0%, 100%, 0.6);
    font-size: 10px;
    font-weight: 400;
  }
}
.avatar-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
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
