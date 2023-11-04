import "/src/assets/main.scss"
import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "/src/App.vue"
import router from "/src/router/index.js"

import HeaderComponent from "/src/components/HeaderComponent.vue"
import AudioPlayerComponent from "/src/components/AudioPlayerComponent.vue"
import NavigationComponent from "/src/components/NavigationComponent.vue"

const app = createApp(App)

app.component('Header', HeaderComponent)
app.component('AudioPlayer', AudioPlayerComponent)
app.component('Navigation', NavigationComponent)

app.use(createPinia())
app.use(router)

app.mount('#app')
