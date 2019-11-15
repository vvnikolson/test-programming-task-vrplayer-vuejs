import Vue from 'vue'
import '@babel/polyfill'
import App from 'pages/App.vue'

import BootstrapVue from 'bootstrap-vue'

import router from 'router/router.js'
import store from 'store/store.js'

Vue.use(BootstrapVue)

new Vue ({
    el: '#app',
    router,
    store,
    render: a => a(App)
})