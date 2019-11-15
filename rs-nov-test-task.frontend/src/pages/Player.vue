<template>
    <div>
        <div id="filler" v-if="!readyToRender">
            <div class="p-div loading" v-if="loading">
                <p class="t-div">Loading...</p>
            </div>
            <div v-else>
                <p class="t-div">Nothing to show</p>
                <p class="t-div">Redirect in {{redirectCountdown}}</p>
            </div>
        </div>
        <div id="viewport">
            <div id="stereo-toggle" @click="toggleVRmode()">{{vrEnable}}</div>
            <div id="DEBUG" v-if="DEBUG">
                <p v-if="cameraTarget">Camera direction: {{cameraTarget.x.toFixed(3)}} {{cameraTarget.y.toFixed(3)}} {{cameraTarget.z.toFixed(3)}}</p>
                <p v-if="cameraPosition">Camera position: {{cameraPosition.x.toFixed(3)}} {{cameraPosition.y.toFixed(3)}} {{cameraPosition.z.toFixed(3)}}</p>
                <button @click="pause()">Pause</button>
                <button @click="loadNewTexture()">NewTexture</button>
                <p>Paused: {{paused}}</p>
                <p>Ready: {{readyToRender}}</p>
            </div>
        </div>

    </div>
</template>
<script>
    import {mapActions, mapMutations, mapGetters} from 'vuex'
    export default {

        name: 'ThreeTest',
        data() {
            return {
                DEBUG: false,
                paused: false,

                loading: false,
                redirectCountdown : 5
            }
        },
        computed: {
            vrEnable() {
                return this.$store.state.player.VREnable ? "Turn VR Off" : "Turn VR On"
            },
            ...mapGetters('player', ['cameraTarget', 'cameraPosition','readyToRender'])
        },
        watch: {
            readyToRender(newVal) {
                this.startPlayer()

                    console.log('image ready')
            }
        },
        methods: {
            startPlayer() {
                this.loading = false
                const context = document.getElementById('viewport')
                this.SET_NEW_VIEWPORT(context)
                this.SET_CAMERA_POSITION({x:0, y:0, z:2})
                this.resize({
                    width: context.offsetWidth,
                    height: context.offsetHeight
                })
                this.animate();
                window.addEventListener("resize",() => {
                    this.resize({
                        width: context.offsetWidth,
                        height: context.offsetHeight
                    });
                }, true);
            },
            ...mapMutations('player', ['SET_CAMERA_POSITION',
                'SET_NEW_VIEWPORT',
                'TOGGLE_PAUSE']),
            ...mapActions('player', [
                'init',
                'animate',
                'toggleVRmode',
                'reloadMaterial',
                'resize',
                'removeEventListeners',
                'addMouseHandlers',
                'pauseRender',
                'resumeRender',
                'getImageData',
                'resetState']),
            ...mapActions('alert', ['addMessage']),


            pause() {
                if (!this.paused){
                    this.removeEventListeners('click')
                    this.removeEventListeners('mousemove')
                    this.pauseRender()
                    console.log('removed')
                } else {
                    this.addMouseHandlers()
                    this.resumeRender()
                    console.log('added')
                }
                this.paused = !this.paused
            },
            loadNewTexture() {
                this.LOAD_MATERIAL('http://localhost:8080/images/1')
            }
        },
        mounted() {
            console.log('ready', this.$store.state.player.readyToRender)
            if(this.readyToRender) {
                this.startPlayer()
            }
        },
        created() {
            // ничего ещё нет, но хотим смотреть картинку (перешли на /show/id),
            // то инициализируем всё здесь, а запускаем в mounted()
            if(!this.$store.getters['player/readyToRender'] && this.$route.params.id) {
                this.loading = true
                this.getImageData(this.$route.params.id)
                    .then(() => {
                        this.init({
                            width: 500,
                            height: 500,
                            context: null
                        }).then(() => {
                            this.addMessage({messageText: 'Player initialized'})
                        }).catch(error=> {
                            console.log("asd")
                        })
                }).catch(err => {
                    this.$router.replace('/')
                })
            }

        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                console.log('player -- beforeRouteEnter ')
                // ничего ещё нет и не указано id картинки, перенаправляем на главную
                if(!vm.$store.getters['player/readyToRender'] && !to.params.id) {
                    vm.redirectCountdown = 3
                    let interval = setInterval(function() {
                        if (vm.redirectCountdown === 0) {
                            clearInterval(interval)
                        }
                        vm.redirectCountdown--;
                    }, 1000);
                    setTimeout( () => {
                        vm.$router.push({ path: '/'})
                    }, 3000)
                }
                // плеер был проинициализирован ранее и не уничтожен, и поэтому переиспользуем компонет,
                // заменив текстуру
                if(vm.$store.getters['player/readyToRender'] && to.params.id) {
                    console.log('trying to load texture')
                    vm.getImageData(to.params.id).then((data) => {
                        vm.reloadMaterial('')
                        //не забыть включить/выключить управление камерой,
                        // если в пришедших данных указано
                        if(!data.manual_camera_control) {
                            vm.removeEventListeners('click')
                            vm.removeEventListeners('mousemove')
                        } else {
                            vm.addMouseHandlers()
                        }
                    })
                }

            })
        },
        beforeRouteUpdate (to, from, next) {
            if(this.readyToRender) {
                this.getImageData(to.params.id).then(() => {
                    this.reloadMaterial('')
                })

            }
            next()
        },

        beforeRouteLeave (to, from, next) {
            if(this.readyToRender) {
                this.pauseRender()
            }

            next()
        },

        beforeDestroy() {
            // сбросить состояние в хранилище
            this.resetState()
            console.log('player destroyed')
            console.log()
        }
    }
</script>

<style scoped>
    .p-div {
        margin: 100px auto;
        position: relative;
    }
    .loading {
        z-index: 1000;
    }
    .t-div {
        text-align: center;
        position: relative;
        top: 50%;
    }
    #viewport, #filler {
        overflow: hidden;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        position: fixed;
        z-index: 1000;
    }
    #filler{
        background-color: black;
        color: white;
        font-size: 50px;
        z-index: 20;
        position: absolute;
    }
    #stereo-toggle {
        background-color: rgba(0, 0, 0, 0.7);
        border: 1px solid #fff;

        color: #fff;
        cursor: pointer;
        font-size: 20px;
        right: 20px;
        padding: 10px 20px;
        position: fixed;
        bottom: 20px;
        z-index: 10;
    }
    #DEBUG {
        position: fixed;
        color: white;
        background-color: black;
        top: 20px;
        left: 20px;
        z-index: 20;
        padding: 10px 20px;
    }

</style>