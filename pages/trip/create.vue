<template>
  <div class="create-trip">
    <!-- 顶部导航 -->
    <header class="header">
      <button class="back-btn" @click="goBack">
        <Icon name="carbon:arrow-left" size="20" />
      </button>
      <h1 class="title">新建线路</h1>
      <div class="placeholder"></div>
    </header>

    <!-- 步骤指示器 -->
    <div class="step-indicator">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="[
          'step',
          { active: currentStep === index, completed: currentStep > index },
        ]"
      >
        <div class="step-number">
          <Icon v-if="currentStep > index" name="carbon:checkmark" size="16" />
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span class="step-label">{{ step.label }}</span>
      </div>
    </div>

    <!-- 步骤内容 -->
    <main class="content">
      <Transition name="step" mode="out-in">
        <!-- 步骤1: 标题封面 -->
        <div v-if="currentStep === 0" key="step1" class="step-content">
          <div class="form-group">
            <label class="form-label">线路标题</label>
            <input
              v-model="title"
              type="text"
              placeholder="给你的线路起个名字"
              class="form-input"
              :class="{ error: titleError }"
              @input="clearErrors"
            />
            <div v-if="titleError" class="error-message">
              {{ titleError }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">封面图片</label>
            <div class="cover-upload">
              <FileUpload
                v-model="coverFiles"
                accept="image/*"
                :max-size="1"
                placeholder="选择封面图片"
                hint="支持JPG、PNG格式，最大1MB"
                @upload="handleCoverUpload"
              />
            </div>
          </div>
        </div>

        <!-- 步骤2: 往返日期 -->
        <div v-else-if="currentStep === 1" key="step2" class="step-content">
          <div class="form-group">
            <label class="form-label">出发日期</label>
            <input
              v-model="startAt"
              type="date"
              class="form-input"
              :class="{ error: startAtError }"
              :min="today"
            />
            <div v-if="startAtError" class="error-message">
              {{ startAtError }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">返程日期</label>
            <input
              v-model="endAt"
              type="date"
              class="form-input"
              :class="{ error: endAtError }"
              :min="startAt || today"
            />
            <div v-if="endAtError" class="error-message">
              {{ endAtError }}
            </div>
          </div>

          <div v-if="startAt && endAt" class="date-info">
            <div class="info-item">
              <Icon name="carbon:time" size="16" />
              <span>行程天数: {{ getDayCount() }}天</span>
            </div>
            <div class="info-item">
              <Icon name="carbon:calendar" size="16" />
              <span>{{ formatDateRange() }}</span>
            </div>
          </div>
        </div>

        <!-- 步骤3: 确认创建 -->
        <div v-else-if="currentStep === 2" key="step3" class="step-content">
          <div class="preview-card">
            <div class="preview-cover">
              <img v-if="formData.cover" :src="formData.cover" alt="封面预览" />
              <div v-else class="preview-placeholder">
                <Icon name="carbon:location" size="32" />
              </div>
            </div>
            <div class="preview-content">
              <h3 class="preview-title">{{ title }}</h3>
              <div class="preview-meta">
                <div class="preview-date">
                  <Icon name="carbon:calendar" size="14" />
                  <span>{{ formatDateRange() }}</span>
                </div>
                <div class="preview-days">
                  <Icon name="carbon:time" size="14" />
                  <span>{{ getDayCount() }}天行程</span>
                </div>
              </div>
            </div>
          </div>

          <div class="create-info">
            <Icon name="carbon:information" size="20" />
            <p>创建后将自动生成空白的行程天数，你可以随时编辑添加具体行程。</p>
          </div>
        </div>
      </Transition>
    </main>

    <!-- 底部按钮 -->
    <footer class="footer">
      <button
        v-if="currentStep > 0"
        class="btn btn-secondary"
        @click="prevStep"
      >
        上一步
      </button>
      <button
        class="btn btn-primary"
        :disabled="!canProceed || creating"
        @click="nextStep"
      >
        <Icon
          v-if="creating"
          name="carbon:circle-dash"
          size="16"
          class="animate-spin"
        />
        {{
          currentStep === steps.length - 1
            ? creating
              ? "创建中..."
              : "创建线路"
            : "下一步"
        }}
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useTripStore } from "~/stores/trip";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import dayjs from "dayjs";
import type { Attachment } from "~/types";

// 页面元信息
useHead({
  title: "新建线路",
});

// 状态管理
const tripStore = useTripStore();

// 表单数据
const formData = reactive({
  title: "",
  cover: "",
  startAt: "",
  endAt: "",
});

// 表单字段
const title = ref("");
const startAt = ref("");
const endAt = ref("");

// 文件上传
const coverFiles = ref<Attachment[]>([]);

// 错误信息
const titleError = ref("");
const startAtError = ref("");
const endAtError = ref("");

// 本地状态
const currentStep = ref(0);
const creating = ref(false);

// 步骤配置
const steps = [
  { label: "标题封面" },
  { label: "往返日期" },
  { label: "确认创建" },
];

// 计算属性
const today = computed(() => dayjs().format("YYYY-MM-DD"));

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return title.value.trim().length >= 2;
    case 1:
      return (
        startAt.value &&
        endAt.value &&
        dayjs(endAt.value).isAfter(dayjs(startAt.value))
      );
    case 2:
      return true;
    default:
      return false;
  }
});

// 方法
const goBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  } else {
    navigateTo("/");
  }
};

const nextStep = async () => {
  if (currentStep.value === steps.length - 1) {
    await createTrip();
  } else {
    // 简单验证当前步骤
    if (currentStep.value === 0) {
      // 第一步：检查标题（至少2个字符）
      if (title.value.trim().length >= 2) {
        titleError.value = "";
        currentStep.value++;
      } else {
        titleError.value = "标题至少需要2个字符";
      }
    } else if (currentStep.value === 1) {
      // 第二步：检查日期
      if (startAt.value && endAt.value) {
        if (dayjs(endAt.value).isAfter(dayjs(startAt.value))) {
          startAtError.value = "";
          endAtError.value = "";
          currentStep.value++;
        } else {
          endAtError.value = "返程日期必须晚于出发日期";
        }
      } else {
        if (!startAt.value) startAtError.value = "请选择出发日期";
        if (!endAt.value) endAtError.value = "请选择返程日期";
      }
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    // 清除错误信息
    titleError.value = "";
    startAtError.value = "";
    endAtError.value = "";
  }
};

// 清除错误信息
const clearErrors = () => {
  titleError.value = "";
  startAtError.value = "";
  endAtError.value = "";
};

// 处理封面文件上传
const handleCoverUpload = (files: Attachment[]) => {
  if (files.length > 0) {
    formData.cover = files[0].data;
  } else {
    formData.cover = "";
  }
};

const getDayCount = (): number => {
  if (!startAt.value || !endAt.value) return 0;
  return dayjs(endAt.value).diff(dayjs(startAt.value), "day") + 1;
};

const formatDateRange = (): string => {
  if (!startAt.value || !endAt.value) return "";

  const start = dayjs(startAt.value);
  const end = dayjs(endAt.value);

  if (start.format("YYYY") === end.format("YYYY")) {
    if (start.format("MM") === end.format("MM")) {
      return `${start.format("MM月DD日")} - ${end.format("DD日")}`;
    } else {
      return `${start.format("MM月DD日")} - ${end.format("MM月DD日")}`;
    }
  } else {
    return `${start.format("YYYY年MM月DD日")} - ${end.format(
      "YYYY年MM月DD日"
    )}`;
  }
};

const createTrip = async () => {
  creating.value = true;

  try {
    // 生成空白天数
    const days = [];
    const start = dayjs(startAt.value);
    const end = dayjs(endAt.value);

    for (let d = start; d.isBefore(end) || d.isSame(end); d = d.add(1, "day")) {
      days.push({
        date: d.format("YYYY-MM-DD"),
        items: [],
      });
    }

    // 创建行程
    const tripData = {
      title: title.value,
      ...(formData.cover && { cover: formData.cover }), // 只有有封面时才添加
      startAt: startAt.value,
      endAt: endAt.value,
      days,
    };

    const tripId = await tripStore.createTrip(tripData);

    // 跳转到详情页
    await navigateTo(`/trip/${tripId}`);
  } catch (error) {
    console.error("创建行程失败:", error);
    alert("创建失败，请重试");
  } finally {
    creating.value = false;
  }
};
</script>

<style scoped lang="scss">
.create-trip {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--background, #{$background});
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  background: white;
  box-shadow: $shadow-sm;
  min-height: 56px;
}

.back-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: $text-secondary;
  border-radius: $radius-md;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: $text-primary;
}

.placeholder {
  width: 40px;
}

.step-indicator {
  display: flex;
  background: white;
  padding: $spacing-md;
  border-bottom: 1px solid $divider;
}

.step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 12px;
    left: 50%;
    width: 100%;
    height: 2px;
    background: $divider;
    z-index: 1;
  }

  &.completed:not(:last-child)::after {
    background: $primary-color;
  }
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: $divider;
  color: $text-secondary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  position: relative;
  z-index: 2;
  transition: all $transition-normal;

  .step.active & {
    background: $primary-color;
    color: white;
  }

  .step.completed & {
    background: $primary-color;
    color: white;
  }
}

.step-label {
  font-size: 12px;
  color: $text-secondary;
  text-align: center;

  .step.active & {
    color: $primary-color;
    font-weight: 500;
  }

  .step.completed & {
    color: $primary-color;
  }
}

.content {
  flex: 1;
  padding: $spacing-md;
  overflow-y: auto;
}

.step-content {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: $spacing-lg;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 $spacing-md;
  border: 1px solid $divider;
  border-radius: $radius-md;
  font-size: 16px;
  background: white;
  transition: all $transition-fast;

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
  }

  &.error {
    border-color: $error-color;
  }
}

.error-message {
  color: $error-color;
  font-size: 14px;
  margin-top: $spacing-xs;
}

.cover-upload {
  position: relative;
}

.cover-preview {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid $divider;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.remove-cover {
  position: absolute;
  top: $spacing-sm;
  right: $spacing-sm;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
}

.cover-placeholder {
  width: 100%;
  height: 200px;
  border: 2px dashed $divider;
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  color: $text-secondary;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    border-color: $primary-color;
    color: $primary-color;
  }
}

.hidden-input {
  display: none;
}

.date-info {
  background: #f8f9fa;
  padding: $spacing-md;
  border-radius: $radius-md;
  margin-top: $spacing-md;
}

.info-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: $spacing-xs;

  &:last-child {
    margin-bottom: 0;
  }
}

.preview-card {
  background: white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
  margin-bottom: $spacing-lg;
}

.preview-cover {
  height: 120px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, $primary-light, $primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.preview-content {
  padding: $spacing-md;
}

.preview-title {
  font-size: 18px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.preview-meta {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.preview-date,
.preview-days {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: 14px;
  color: $text-secondary;
}

.create-info {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  padding: $spacing-md;
  background: #e3f2fd;
  border-radius: $radius-md;
  color: $primary-color;
  font-size: 14px;
  line-height: 1.5;
}

.debug-info {
  padding: $spacing-md;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  margin: $spacing-md;
  border-radius: $radius-md;
  font-size: 12px;
  color: #666;
}

.debug-info p {
  margin: 4px 0;
}

.footer {
  padding: $spacing-md;
  background: white;
  border-top: 1px solid $divider;
  display: flex;
  gap: $spacing-md;
  justify-content: flex-end;
}

.btn {
  @include button-base;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.btn-primary {
  @include button-primary;
}

.btn-secondary {
  @include button-secondary;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 步骤切换动画
.step-enter-active,
.step-leave-active {
  transition: all $transition-normal;
}

.step-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.step-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

// 暗黑模式
@media (prefers-color-scheme: dark) {
  .header,
  .step-indicator,
  .footer {
    background: $dark-background;
    border-color: $dark-divider;
  }

  .title,
  .form-label,
  .preview-title {
    color: $dark-text-primary;
  }

  .form-input {
    background: $dark-background;
    color: $dark-text-primary;
    border-color: $dark-divider;

    &:focus {
      border-color: $primary-color;
    }
  }

  .preview-card {
    background: $dark-background;
  }

  .date-info {
    background: $dark-divider;
  }

  .info-item,
  .preview-date,
  .preview-days {
    color: $dark-text-secondary;
  }

  .create-info {
    background: rgba($primary-color, 0.1);
  }
}
</style>
