<template>
  <div class="photoViewer-wrapper">
    <div class="photoViewer-container">
      <div class="export-json">导出json</div>
      <div ref="viewerRef" class="photoViewer"></div>
    </div>
    <AddEditMarker ref="addEditMarkerRef" />
    <ImageSwiper :options="photoData" v-model="currentIndex"  />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

import ImageSwiper from './ImageSwiper.vue';
import type { MarkersPlugin } from '@photo-sphere-photoViewer/markers-plugin';
import { PhotoSphere } from '@/photoSphereClass/index.ts';
import type { PanoramaClickEvent } from '../photoSphereClass';
import { photoData } from '@/mock/photoData.ts';
import AddEditMarker from './AddEditMarker.vue';
const currentIndex = ref(0)
const isEditMode = ref(false) // 现在先默认开启
const addEditMarkerRef = ref()
watch(() => currentIndex.value, (newIndex) => {
  if (photoViewer) {
    photoViewer.setPanorama(photoData[newIndex].imgUrl)
    photoViewer.markersPlugin.setMarkers(photoData[newIndex].markerList)
  }
})

const viewerRef = ref<HTMLDivElement | null>(null)
let photoViewer: typeof PhotoSphere | null = null
let markersPlugin: MarkersPlugin | null = null
onMounted(() => {
  if (!viewerRef.value) return

  photoViewer = new PhotoSphere(viewerRef.value)
  photoViewer.setPanorama(photoData[currentIndex.value].imgUrl)
  photoViewer.markersPlugin.setMarkers(photoData[currentIndex.value].markerList)
  photoViewer.addClickListener((e: PanoramaClickEvent) => {
    console.log(e);
    if (isEditMode.value) {
      addHotspot(e.yaw, e.pitch)
    }
  })
  photoViewer.onMarkerClick((marker) =>{
    console.log('marker clicked:', marker);
  })
})
function setPhoteView() {
  
}
function addHotspot(yaw: number, pitch: number) {
  if (!photoViewer) return

  photoViewer.markersPlugin?.addMarker({
    id: `point_${Date.now()}`,
    position: { yaw, pitch },
  //  image: '/dog.png',
  html: '<div class="hotspot">12</div>',
                    size: { width: 32, height: 32 },
  })
}

onBeforeUnmount(() => {
  photoViewer?.destroy()
})
</script>

<style lang="scss" scoped>
.photoViewer-wrapper {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
}
.photoViewer-container {
  position: relative;
  width: 0;
  flex-grow: 1;
  height: 100%;
  .photoViewer {
    width: 100%;
    height: 100%;
  }
}

.export-json {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}
.export-json:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}
.export-json:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
}
.add-marker-btn {
  position: absolute;
  top: 20px;
  right: 180px;
  z-index: 100;
  padding: 10px 20px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.add-marker-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}
.add-marker-btn:active {
  transform: translateY(0);
}
.hotspot {
  width: 12px;
  height: 12px;
  background: red;
  border-radius: 50%;
}

</style>
