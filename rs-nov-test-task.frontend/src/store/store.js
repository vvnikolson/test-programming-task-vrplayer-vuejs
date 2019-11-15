import Vue from 'vue'
import Vuex from 'vuex'

import AlertModule from 'store/alert.module.js'
import ImageModule from 'store/image.module.js'
import PlayerModule from 'store/player.module.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        alert: AlertModule,
        image: ImageModule,
        player: PlayerModule
    }
})

export default store