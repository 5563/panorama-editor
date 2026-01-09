<template>
	<div class="scene-selector">
		<transition name="slide-up">
			<div v-show="open" class="thumbs-wrapper" @click.stop>
				<swiper
					class="thumbs-swiper"
					:slides-per-view="'auto'"
					:space-between="8"
					:freeMode="true"
				>
					<swiper-slide
						v-for="(src, idx) in thumbs"
						:key="idx"
						class="thumb-slide"
						@click="select(idx)"
					>
						<div class="thumb-container">
							<img
								:src="encodeURI(src)"
								:alt="`thumb-${idx}`"
								class="thumb"
								:class="{ selected: idx === currentIndex }"
							/>
							<div class="thumb-name">{{ props.options?.[idx]?.imgName }}</div>
						</div>
					</swiper-slide>
				</swiper>
			</div>
		</transition>

		<button class="toggle-btn" @click.stop="toggle" :aria-expanded="open">
			<!-- simple picture icon -->
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
				<rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" />
				<circle cx="8.5" cy="9.5" r="1.2" fill="currentColor" />
				<path d="M21 19l-5-6-4 5-3-4-3 5" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/free-mode'

interface PhotoItem {
	imgUrl: string
	imgName: string
	description?: string
	markerList?: any[]
}

const props = defineProps<{
	options?: PhotoItem[]
}>()

const currentIndex = defineModel<number>({ default: 0 })

const open = ref(false)

const thumbs = computed(() => props.options?.map(item => item.imgUrl) ?? [])

function toggle() {
	open.value = !open.value
}
const emit = defineEmits<{
    (e: 'change', index: number): void
}>()
function select(idx: number) {
	currentIndex.value = idx
    emit('change', currentIndex.value)
}
</script>

<style scoped>
.scene-selector {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 50;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	pointer-events: none;
}

.toggle-btn {
	width: 44px;
	height: 44px;
	border-radius: 8px;
	background: rgba(255,255,255,0.95);
	border: 1px solid rgba(0,0,0,0.08);
	display: inline-flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 6px 18px rgba(0,0,0,0.08);
	cursor: pointer;
	position: fixed;
	left: 16px;
	bottom: 16px;
	pointer-events: auto;
}

.thumbs-wrapper {
	background: transparent;
	border-radius: 10px;
	padding: 16px;
	width: 100%;
	pointer-events: auto;
	display: flex;
	justify-content: center;
	margin-bottom: 60px;
}

.thumbs-swiper {
	width: 100%;
}

.thumb-slide {
	width: 110px; /* slide width auto for slidesPerView='auto' */
	height: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}

.thumb-container {
	position: relative;
	display: inline-block;
}

.thumb {
	width: 100px;
	height: 75px;
	object-fit: cover;
	border-radius: 6px;
	transition: transform .18s ease, box-shadow .18s ease, border .12s ease;
	border: 2px solid transparent;
	box-shadow: 0 2px 6px rgba(0,0,0,0.08);
	cursor: pointer;
	display: block;
    overflow: hidden;
}

.thumb-name {
	position: absolute;
	bottom: 0px;
	left: 0;
	right: 0;
	width: 100%;
	font-size: 12px;
	color: #fff;
	white-space: nowrap;
	transition: color .18s ease;
	background: rgba(0,0,0,0.6);
	padding: 4px 0;
	border-radius: 0 0 4px 4px;
	text-align: center;
}

.thumb.selected {
	/* transform: translateY(-4px) scale(1.02); */
	border-color: #409eff; /* Element Plus primary */
	box-shadow: 0 6px 18px rgba(64,158,255,0.18);
}

.thumb.selected ~ .thumb-name {
	color: #409eff;
	font-weight: 500;
}

/* slide-up transition */
.slide-up-enter-from,
.slide-up-leave-to {
	transform: translateY(12px);
	opacity: 0;
}
.slide-up-enter-active,
.slide-up-leave-active {
	transition: transform 240ms cubic-bezier(.2,.9,.2,1), opacity 200ms ease;
}

/* ensure slides scroll horizontally nicely */
.swiper-wrapper {
	align-items: center;
}

/* small responsive tweak */
@media (max-width: 420px) {
	.thumb-slide { width: 64px }
	.thumb { width: 60px; height: 44px }
}
</style>

