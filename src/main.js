import './assets/scss/all.scss';
import 'sweetalert2/src/sweetalert2.scss';
import * as bootstrap from 'bootstrap';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import axios from 'axios';
import VueAxios from 'vue-axios';

import { Field, Form, ErrorMessage } from 'vee-validate';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueAxios, axios);
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);

app.config.globalProperties.$bs = bootstrap;

app.mount('#app');
