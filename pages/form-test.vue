<template>
  <div class="form-test">
    <h1>表单测试页面</h1>

    <div class="test-form">
      <h2>简单表单测试</h2>
      <div class="form-group">
        <label>标题：</label>
        <input
          v-model="testTitle"
          type="text"
          placeholder="输入标题"
          class="form-input"
        />
        <p v-if="testTitle" class="success">✅ 标题已输入：{{ testTitle }}</p>
      </div>

      <div class="form-group">
        <label>日期：</label>
        <input v-model="testDate" type="date" class="form-input" />
        <p v-if="testDate" class="success">✅ 日期已选择：{{ testDate }}</p>
      </div>

      <button @click="testSubmit" class="btn">测试提交</button>
      <p v-if="submitResult" class="result">{{ submitResult }}</p>
    </div>

    <div class="actions">
      <button @click="goHome" class="btn">返回首页</button>
      <button @click="goCreate" class="btn">新建线路</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const testTitle = ref("");
const testDate = ref("");
const submitResult = ref("");

const testSubmit = () => {
  if (testTitle.value && testDate.value) {
    submitResult.value = `✅ 表单验证通过！标题：${testTitle.value}，日期：${testDate.value}`;
  } else {
    submitResult.value = "❌ 请填写完整信息";
  }
};

const goHome = () => {
  navigateTo("/");
};

const goCreate = () => {
  navigateTo("/trip/create");
};

useHead({
  title: "表单测试页面",
});
</script>

<style scoped lang="scss">
.form-test {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.test-form {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  margin: 20px 0;
}

.form-group {
  margin: 20px 0;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.success {
  color: #28a745;
  margin-top: 5px;
  font-size: 14px;
}

.result {
  margin-top: 20px;
  padding: 10px;
  background: #e9ecef;
  border-radius: 5px;
  font-weight: 500;
}

.btn {
  padding: 10px 20px;
  background: #0abfc5;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px 5px;
}

.btn:hover {
  background: #00838f;
}

.actions {
  text-align: center;
  margin-top: 30px;
}
</style>
