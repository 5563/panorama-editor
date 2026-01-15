<template>
  <div class="photoViewer-wrapper">
    <div class="photoViewer-container">
      <div class="export-json">导出json</div>
      <div ref="viewerRef" class="photoViewer"></div>
    </div>
    <AddEditMarker
      ref="addEditMarkerRef"
      @add-marker="addMarkerToData"
      @update-marker="updateMarkerData"
    />
    <ImageSwiper :options="photoData" v-model="currentIndex" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

import ImageSwiper from "./ImageSwiper.vue";
import type { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { PhotoSphere } from "@/photoSphereClass/index.ts";
import type { PanoramaClickEvent } from "../photoSphereClass";
import AddEditMarker from "./AddEditMarker.vue";
const currentIndex = ref(0);
const isEditMode = ref(true); // 默认开启编辑模式
const addEditMarkerRef = ref();
const photoData = ref<any[]>([]);

watch(
  () => currentIndex.value,
  () => {
    setPhotoData()
  }
);
const setPhotoData = () =>{
  if (photoViewer && photoData.value.length > 0) {
      photoViewer.setPanorama(photoData.value[currentIndex.value]!.imgUrl);
      photoViewer.setMarkers(
        photoData.value[currentIndex.value]!.markerList
      );
    }
}

const getPhotoData = async () => {
  try {
    const response = await fetch("/data.json");
    const data = await response.json();
    photoData.value = data;
  } catch (error) {
    console.error("加载数据失败:", error);
  }
};

const viewerRef = ref<HTMLDivElement | null>(null);
let photoViewer: PhotoSphere | null = null;
const tempMarker = {
  id: "tempMarkerID",
  position: {
    yaw: 0,
    pitch: 0,
  },
  text: '',
  style: 'style2',
};
onMounted(async () => {
  await getPhotoData();

  if (!viewerRef.value || photoData.value.length === 0) return;

  photoViewer = new PhotoSphere(viewerRef.value);
  setPhotoData()
  photoViewer.addClickListener((e: PanoramaClickEvent) => {
    console.log("全景图点击事件:", e);
    if (isEditMode.value) {
      // 打开新增点位弹窗
        const markers = photoViewer?.markersPlugin?.getMarkers() || [];

      const exists = markers.some(m => m.id === tempMarker.id);

      if (exists) {
        photoViewer?.markersPlugin.removeMarker(tempMarker.id);
      }

      tempMarker.position.yaw = e.yaw;
      tempMarker.position.pitch = e.pitch;
      photoViewer?.addMarker(tempMarker);
      addEditMarkerRef.value?.openAddMarker(tempMarker);
    }
  });
  photoViewer.onMarkerClick((marker: any) => {
    console.log("点位被点击:", marker);
    if (isEditMode.value) {
      // 打开编辑点位弹窗
      addEditMarkerRef.value?.openEditMarker(marker);
    }
  });
});
// 新增点位到数据中
function addMarkerToData(markerData: any) {
  console.log("新增点位:", markerData);
  const marker = {
    id: markerData.id,
    position: {
      yaw: markerData.yaw,
      pitch: markerData.pitch,
    },
    html: `<div class="hotspot-with-arrow">
      <div class="hotspot-text">景点名称</div>
      <div class="arrow-down"></div>
    </div>`,
    description: markerData.description,
  };

  // 添加到当前场景的markerList
  photoData.value[currentIndex.value]!.markerList.push(marker);

  // 更新全景图上的标记点
  if (photoViewer) {
    photoViewer.markersPlugin.addMarker(marker);
  }
}

// 更新点位数据
function updateMarkerData(markerData: any) {
  console.log("更新点位:", markerData);
  const markerList = photoData.value[currentIndex.value]!.markerList;
  const index = markerList.findIndex((m: any) => m.id === markerData.id);

  if (index !== -1) {
    const updatedMarker = {
      id: markerData.id,
      position: {
        yaw: markerData.yaw,
        pitch: markerData.pitch,
      },
      html: `<div class="hotspot">${markerData.label || "标记点"}</div>`,
      // size: {
      //   width: markerData.width,
      //   height: markerData.height
      // },
      description: markerData.description,
    };

    // 更新数据
    markerList[index] = updatedMarker;

    // 更新全景图上的标记点
    if (photoViewer) {
      photoViewer.markersPlugin.updateMarker(updatedMarker);
    }
  }
}

onBeforeUnmount(() => {
  photoViewer?.destroy();
});
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
</style>
