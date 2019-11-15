import Vue from 'vue'
import VueRouter from 'vue-router'

import PlayerPage from "pages/Player.vue"
import UploadPage from "pages/Upload.vue"
import BrowsePage from "pages/Browse.vue"
import TestPage from "pages/TestPage.vue"

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        component: BrowsePage,
        name: "MainPage"
    },
    {
        path: "/show/:id?",
        name: "PlayerPage",
        component: PlayerPage,
    },
    {
        path: "/upload",
        name: "UploadPage",
        component:UploadPage

    },
    {
        path: "/testPage",
        component: TestPage
    },
    {
        path: "*",
        redirect: "/"
    }
]

const router = new VueRouter({
    mode: "history",
    routes
})

export default router