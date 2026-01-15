<template>
  <!-- Drawer -->
  <transition name="drawer">
    <div v-if="isOpen" class="drawer">
        <div class="drawer-header">
          <h3 class="drawer-title">{{ isEditMode ? '编辑点位' : '新增点位' }}</h3>
          <button class="close-btn" @click="closeDrawer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="drawer-content">
          <el-form
            ref="formRef"
            :model="formData"
            label-position="top"
            class="marker-form"
          >
            <el-form-item label="点位ID">
              <el-input
                v-model="formData.id"
                placeholder="请输入点位ID"
                :disabled="isEditMode"
                clearable
              />
            </el-form-item>

            <el-form-item label="Yaw角度">
              <div class="input-with-slider">
                <el-input-number
                  v-model="formData.yaw"
                  :min="0"
                  :max="6.28"
                  :step="0.001"
                  :precision="3"
                  placeholder="0 ~ 2π"
                  controls-position="right"
                  class="slider-input"
                />
                <el-slider
                  v-model="formData.yaw"
                  :min="0"
                  :max="6.28"
                  :step="0.001"
                  :show-tooltip="true"
                  :format-tooltip="formatYawTooltip"
                  class="slider"
                />
                <span class="value">{{ formData.yaw.toFixed(3) }}</span>
              </div>
            </el-form-item>

            <el-form-item label="Pitch角度">
              <div class="input-with-slider">
                <el-input-number
                  v-model="formData.pitch"
                  :min="-1.57"
                  :max="1.57"
                  :step="0.001"
                  :precision="3"
                  placeholder="-π/2 ~ π/2"
                  controls-position="right"
                  class="slider-input"
                />
                <el-slider
                  v-model="formData.pitch"
                  :min="-1.57"
                  :max="1.57"
                  :step="0.001"
                  :show-tooltip="true"
                  :format-tooltip="formatPitchTooltip"
                  class="slider"
                />
                <span class="value">{{ formData.pitch.toFixed(3) }}</span>
              </div>
            </el-form-item>

            <el-form-item label="样式">
              <el-select
                v-model="formData.style"
                placeholder="请选择样式"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in styleEnum()"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="标签内容">
              <el-input
                v-model="formData.label"
                placeholder="请输入标签内容，如：景点1、标记点等"
                clearable
              />
            </el-form-item>

            <el-form-item label="描述信息">
              <el-input
                v-model="formData.description"
                type="textarea"
                placeholder="请输入描述信息"
                :rows="4"
                clearable
              />
            </el-form-item>
          </el-form>
        </div>

        <div class="drawer-footer">
          <el-button class="btn-cancel" @click="closeDrawer">取消</el-button>
          <el-button type="primary" @click="saveMarker">
            {{ isEditMode ? '更新' : '新增' }}
          </el-button>
        </div>
      </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElButton, ElInput, ElInputNumber, ElSlider, ElForm, ElFormItem, ElSelect, ElOption } from 'element-plus'
import { styleEnum } from '@/photoSphereClass/dict'

interface MarkerData {
  id: string
  yaw: number
  pitch: number
  label: string
  description: string
  style: string
}

const formRef = ref<FormInstance>()
const isOpen = ref(true)
const isEditMode = ref(false)
const formData = reactive<MarkerData>({
  id: '',
  yaw: 0,
  pitch: 0,
  label: '',
  description: '',
  style: '',
})

// 格式化 Yaw tooltip
const formatYawTooltip = (value: number) => {
  return value.toFixed(3) + ' rad'
}

// 格式化 Pitch tooltip
const formatPitchTooltip = (value: number) => {
  return value.toFixed(3) + ' rad'
}

// 暴露给父组件的方法
const openAddMarker = (yaw: number, pitch: number) => {
  isEditMode.value = false
  resetForm()
  // 设置点击位置的yaw和pitch
  formData.yaw = yaw
  formData.pitch = pitch
  isOpen.value = true
}

const openEditMarker = (marker: any) => {
  isEditMode.value = true
  formData.id = marker.id
  formData.yaw = marker.position.yaw
  formData.pitch = marker.position.pitch
  formData.label = marker.label || ''
  formData.description = marker.description || ''
  formData.style = marker.style || ''
  isOpen.value = true
}

const closeDrawer = () => {
  isOpen.value = false
}

const resetForm = () => {
  formData.id = `marker_${Date.now()}`
  formData.yaw = 0
  formData.pitch = 0
  formData.label = ''
  formData.description = ''
  formData.style = ''
  formRef.value?.clearValidate()
}

const emit = defineEmits(['addMarker', 'updateMarker'])

const saveMarker = async () => {
  // 验证表单
  if (!formData.id.trim()) {
    ElMessage.warning('请输入点位ID')
    return
  }

  if (isEditMode.value) {
    // 编辑模式,触发更新事件
    emit('updateMarker', { ...formData })
    ElMessage.success('点位更新成功')
  } else {
    // 新增模式,触发新增事件
    emit('addMarker', { ...formData })
    ElMessage.success('点位添加成功')
  }

  closeDrawer()
}

// 暴露方法给父组件
defineExpose({
  openAddMarker,
  openEditMarker,
})
</script>

<style scoped>
/* Drawer */
.drawer {
  width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
}

/* Drawer Header */
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.drawer-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #262626;
}

/* Drawer Content */
.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  flex-grow: 1;
  height: 0;
}

.marker-form {
  width: 100%;
}

/* Element Plus Form Item 样式覆盖 */
.marker-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.marker-form :deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  line-height: 1.5;
  padding-bottom: 8px;
}

/* 带滑块的输入 */
.input-with-slider {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.input-with-slider .slider-input {
  width: 120px;
}

.input-with-slider .slider {
  flex: 1;
}

.input-with-slider .value {
  min-width: 60px;
  text-align: right;
  font-size: 14px;
  color: #8c8c8c;
  font-weight: 500;
}

/* Drawer Footer */
.drawer-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.drawer-footer .el-button {
  flex: 1;
}

/* 动画 */
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  width: 0;
}
</style>
