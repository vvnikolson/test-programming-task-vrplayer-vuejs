<template>


<b-container class="yt">




    </b-container>

</template>

<script>
    export default {
        name: "TestPage",

    }
</script>

<style scoped>

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
        color: #ffffff; font-family: 'Raleway',sans-serif; font-size: 62px; font-weight: 800; line-height: 72px; margin: 0 0 24px; text-align: center; text-transform: uppercase;
    }

</style>