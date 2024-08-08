import './assets/index.css'
import 'nprogress/nprogress.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'

const i18n = createI18n({})

const app = createApp(App).use(VueQueryPlugin)

app.use(i18n)

app.use(createPinia())
app.use(router)

app.mount('#app')
