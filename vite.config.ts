import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), ElementPlus({})],
  resolve : {
    alias : {
      "@" : fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
