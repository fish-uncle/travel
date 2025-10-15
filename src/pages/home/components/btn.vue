<template>
  <button class="button"><slot /></button>
</template>
<style lang="scss" scoped>
.button {
  background: hsla(0, 0%, 100%, 0.1);
  color: #fff;
  height: 28px;
  margin-left: 15px;
  padding: 6px 33px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  box-shadow: none;
  border: 1px solid #fff;
}
</style>
