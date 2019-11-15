<template>
    <b-container>
        <div class="d-flex mx-auto" v-if="!uploadReady">
                <send-form @submited="onDataSubmited" />
        </div>


        <b-row v-else  class="text-center mt-4">
            <b-col  align-v="center" align-h="center">

                <div class="img-container">
                    <router-link v-if="preview" @click.native="testCall" to="/show">
                        <img class="img-g" :src="preview" alt="">

                    <div class="overlay">
                        <span>Watch in <br> 360°</span>
                    </div>
                    </router-link>
                </div>
            </b-col>
        </b-row>

    </b-container>
</template>

<script>
    import SendForm from 'components/sendForm.vue'
    import {mapState, mapActions, mapGetters} from 'vuex'

    export default {
        name: "Home",
        data() {
            return {
                readyToInit: false
            }
        },
        components : {
            SendForm
        },
        computed: {
            ...mapGetters('image', ['uploadReady']),
            ...mapState('image', ['preview'])
        },
        methods: {
            testCall() {
                this.uploadImage()

            },
            onDataSubmited() {
                this.readyToInit = true

                this.resetState()
                this.initializePlayer()

            },
            ...mapActions('player', ['init', 'animate', 'resetState', 'takeScreen']),
            ...mapActions('image', ['uploadImage']),
            ...mapActions('alert', ['addMessage']),
            initializePlayer() {
                console.log('start init')
                this.init({
                    width: 500,
                    height: 500,
                    context: null})
                    .then(() => {
                        //this.animate();
                        this.addMessage({messageText:'Player ready, сlick on preview'})
                        setTimeout(() => {this.takeScreen()}, 600 )

                    })
            }
        }
    }
</script>

<style scoped>
    .img-g {
        border-radius: 50%;
    }
    .img-container{
        position:relative;
        display:inline-block;
        border-radius: 50%;
    }
    .img-container .overlay{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background: rgb(0, 0, 0);
        opacity:0;
        transition:opacity 500ms ease-in-out;
        border-radius: 50%;
    }
    .img-container:hover .overlay{
        opacity:0.7;
    }
    .overlay span{
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        color: #ffffff;
        font-family: 'Raleway',sans-serif;
        font-size: 62px;
        font-weight: 800;
        line-height: 72px;
        margin: 0 0 24px;
        text-align: center;
        text-transform: uppercase;
    }


</style>