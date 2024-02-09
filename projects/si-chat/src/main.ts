import './assets/main.css'

import { createApp } from 'vue'
import { bootstrap } from './setup';
import App from './App.vue'

const app = createApp(App);
bootstrap(app);
app.mount('#app');
