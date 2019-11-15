<template>
    <div>
        <b-container>
            <b-navbar toggleable="lg" type="dark" variant="dark">

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav>
                        <b-nav-item to="/">Home</b-nav-item>
                        <b-nav-item to="/upload">Upload</b-nav-item>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </b-container>
        <alerts />
        <router-view></router-view>



    </div>
</template>


<script>
    import Alerts from 'components/alert.vue'
    import {mapActions} from 'vuex'
    export default {
        name: "App",
        components: {Alerts},
        data() {
            return {
            }
        },

        methods: {
            ...mapActions('alert', ['addMessage']),
            addTestNotify() {
                this.addMessage({messageText:'asdasd'})
            }
        }
    }
</script>

<style>

</style>