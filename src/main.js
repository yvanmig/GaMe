import { createApp } from 'vue'
import store from './store/store'

//import store from './store/store'
import { createStore } from 'vuex'

import App from './App.vue'
import './index.css'

// createApp(App).use(store).mount('#app')

/*
const app = createApp(App)
app.use(store);
app.mount('#app');*/

const app = createApp(App)
app.use(store)
app.mount('#app')
