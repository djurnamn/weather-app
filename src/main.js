import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'the-new-css-reset/css/reset.css'

createApp(App)
    .use(router)
    .use(createPinia())
    .mount('#app')
