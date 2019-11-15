<template>
    <div class="custom-alerts">
        <transition-group name="slide-fade">
            <div class="alert-msg" @click="REMOVE_MESSAGE(m.id)"
                 :class="msgTypeClass(m)" v-for="m in $store.state.alert.messages" :key="m.id">
                <div class="alert-msg-text">{{ m.messageText }}</div>
            </div>
        </transition-group>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    export default {
        name: "alert",
        computed: {
            ...mapState('alert', ['getAlertMessages'])
        },
        methods: {
            ...mapMutations('alert', ['REMOVE_MESSAGE']),
            msgTypeClass(m) {
                return `alert-t-${m.type}`
            }
        }
    }
</script>

<style scoped>
    .custom-alerts {
        position: fixed;
        width: 320px;
        z-index: 10000;
        bottom: 10px;
        left: 10px;
    }
    .alert-msg {
        margin: 10px;
        position: relative;
        background-color: lightgray;
        opacity: 0.85;
        box-sizing: border-box;
        border-left: 4px solid;
        padding: 15px;
        width: 100%;
        color: #fff;
        transition: 400ms cubic-bezier(0.17, 0.67, 0.17, 0.98);
        transition-property: opacity, transform;
        border-left-color: #333333;
    }
    .alert-msg:hover {
        opacity: 1;
    }

    .slide-fade-enter-active {
        transition: all .5s ease;
    }
    .slide-fade-leave-active {
        transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(-10px);
        opacity: 0;
    }

    .alert-t-info {
        background-color: #43b4ec;
    }
    .alert-t-success {
        background-color: #3add93;
    }
    .alert-t-danger {
        background-color: #f3755e;
    }

</style>