import Vue from 'vue'
import '@babel/polyfill'
import App from 'pages/App.vue'

//import 'bootstrap/dist/css/bootstrap.css'
//import 'bootstrap-vue/dist/bootstrap-vue.css'


//import BootstrapVue from 'bootstrap-vue'
//Vue.use(BootstrapVue)

import { LayoutPlugin, FormCheckboxPlugin, FormPlugin,FormFilePlugin,FormInputPlugin,
    FormGroupPlugin,NavbarPlugin, ButtonPlugin } from 'bootstrap-vue'

Vue.use(LayoutPlugin)
Vue.use(NavbarPlugin)
Vue.use(FormGroupPlugin)
Vue.use(FormInputPlugin)
Vue.use(FormFilePlugin)
Vue.use(FormPlugin)
Vue.use(FormCheckboxPlugin)

Vue.use(ButtonPlugin)

import router from 'router/router.js'
import store from 'store/store.js'



new Vue ({
    el: '#app',
    router,
    store,
    render: a => a(App)
})