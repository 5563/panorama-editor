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
          <div class="form-group">
            <label>点位ID</label>
            <input v-model="formData.id" type="text" placeholder="请输入点位ID" :disabled="isEditMode" />
          </div>

          <div class="form-group">
            <label>Yaw角度</label>
            <div class="input-with-slider">
              <input v-model.number="formData.yaw" type="number" placeholder="0 ~ 2π" />
              <input v-model.number="formData.yaw" type="range" min="0" max="6.28" step="0.01" />
              <span class="value">{{ formData.yaw.toFixed(2) }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>Pitch角度</label>
            <div class="input-with-slider">
              <input v-model.number="formData.pitch" type="number" placeholder="-π/2 ~ π/2" />
              <input v-model.number="formData.pitch" type="range" min="-1.57" max="1.57" step="0.01" />
              <span class="value">{{ formData.pitch.toFixed(2) }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>标签内容</label>
            <input v-model="formData.label" type="text" placeholder="请输入标签内容，如：景点1、标记点等" />
          </div>

          <div class="form-group">
            <label>宽度 (px)</label>
            <input v-model.number="formData.width" type="number" placeholder="32" />
          </div>

          <div class="form-group">
            <label>高度 (px)</label>
            <input v-model.number="formData.height" type="number" placeholder="32" />
          </div>

          <div class="form-group">
            <label>描述信息</label>
            <textarea v-model="formData.description" placeholder="请输入描述信息"></textarea>
          </div>
        </div>

        <div class="drawer-footer">
          <button class="btn btn-cancel" @click="closeDrawer">取消</button>
          <button class="btn btn-primary" @click="saveMarker">{{ isEditMode ? '更新' : '新增' }}</button>
        </div>
      </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface MarkerData {
  id: string
  yaw: number
  pitch: number
  label: string
  width: number
  height: number
  description: string
}

const isOpen = ref(false)
const isEditMode = ref(false)
const formData = reactive<MarkerData>({
  id: '',
  yaw: 0,
  pitch: 0,
  label: '',
  width: 32,
  height: 32,
  description: '',
})

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
  formData.width = marker.size?.width || 32
  formData.height = marker.size?.height || 32
  formData.description = marker.description || ''
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
  formData.width = 32
  formData.height = 32
  formData.description = ''
}

const emit = defineEmits(['addMarker', 'updateMarker'])

const saveMarker = () => {
  // 验证表单
  if (!formData.id.trim()) {
    alert('请输入点位ID')
    return
  }
  
  if (isEditMode.value) {
    // 编辑模式,触发更新事件
    emit('updateMarker', { ...formData })
  } else {
    // 新增模式,触发新增事件
    emit('addMarker', { ...formData })
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

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 8px;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-group input[type="text"]:focus,
.form-group input[type="number"]:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.form-group input[type="text"]:disabled {
  background-color: #f5f5f5;
  color: #8c8c8c;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

/* 带滑块的输入 */
.input-with-slider {
  display: flex;
  gap: 12px;
  align-items: center;
}

.input-with-slider input[type="number"] {
  width: 80px;
}

.input-with-slider input[type="range"] {
  flex: 1;
  cursor: pointer;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: #f0f0f0;
  border-radius: 2px;
  outline: none;
}

.input-with-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  transition: all 0.2s ease;
}

.input-with-slider input[type="range"]::-webkit-slider-thumb:hover {
  background: #764ba2;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.input-with-slider input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.input-with-slider input[type="range"]::-moz-range-thumb:hover {
  background: #764ba2;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.input-with-slider .value {
  min-width: 50px;
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

.btn {
  flex: 1;
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #262626;
}

.btn-cancel:hover {
  background-color: #e6e6e6;
}

.btn-cancel:active {
  background-color: #d9d9d9;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

/* 动画 */
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  /* transform: translateX(100%); */
  width: 0;
}
</style>
