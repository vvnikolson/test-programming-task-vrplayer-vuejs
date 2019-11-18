<template>


    <b-container>
        <div class="search-group">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">Filter by</span>
            </div>
            <input type="text" class="form-control" placeholder="Image name" v-model="search">
            <b-form-checkbox class="mb-2 pt-2 ml-2 mr-sm-2 mb-sm-0" v-model="sort_manualCameraControl">Manual camera control</b-form-checkbox>
        </div>
        </div>
        <div  v-if="!loaded"  role="status" class="d-flex " >
            <div class="mx-auto mt-4">
            <div class="spinner-border">
                <span class="sr-only">Loading...</span>
            </div>
            </div>
        </div>
        <div v-else>
        <div class="table" v-if="items">
            <div class="row">
                <div class="col-12">
                    <table class="table table-image">
                        <thead>
                        <tr>
                            <th scope="col">Preview</th>
                            <th class="w-25" scope="col">Name</th>
                            <th scope="col">Loaded</th>
                            <th scope="col">Manual camera control</th>
                            <th scope="col" v-if="!sort_manualCameraControl">Camera Rotation Speed</th>

                        </tr>
                        </thead>
                        <tbody>
                        <tr class="my-auto" v-for="item in filterImagesByName" :key="item.id">
                            <td class="w-25 ">

                                <div class="wrapper">

                                    <img :src="item.preview" class="img-fluid pv-img" alt="Sheep">
                                    <router-link :to="`/show/${item.id}`">

                                    <div class="centeredOverlay">
                                        <span >Watch</span>
                                    </div></router-link>
                                </div>
                            </td>
                            <th scope="row" class="w-25">{{item.name}}</th>
                            <td>{{item.creation_time}}</td>
                            <td>{{item.manual_camera_control? "YES" : "NO" }}</td>
                            <td v-if="!sort_manualCameraControl">{{item.manual_camera_control? "" : item.rotation_speed}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <b-col class="align-center" v-else>
            <b-row class="text"><b-col>Nothing here yet</b-col></b-row>
            <b-row class="text2"><b-col><router-link class="ref" to="/upload">Upload 360 image</router-link></b-col></b-row>
        </b-col>
        </div>

    </b-container>
</template>

<script>
    import ImageService from 'service/imageService.js'
    export default {
        data() {
            return {
                sort_manualCameraControl: false,
                items: null,
                search: '',
                loaded: false
            }
        },
        computed: {
            filterImagesByName() {
                if(this.items) {
                    return this.items.filter((item) => {
                        console.log(item)
                        return (item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
                            && item.manual_camera_control === this.sort_manualCameraControl
                    })
                }
                return []
            }
        },
        mounted() {
            ImageService.getAllImagesData()
                .then(resp => {
                    this.items = resp
                    this.loaded = true
            })
        }
    }
</script>

<style scoped>
    .text {
        color: #2d2d2d;
        font-family: 'Raleway',sans-serif;
        font-size: 46px; font-weight: 800;
        line-height: 72px;
        margin: 0 0 24px;
        text-align: center;
        text-transform: uppercase;
    }

    .text2 {
        color: #2d2d2d;
        font-family: 'Raleway', sans-serif;
        font-size: 36px;
        font-weight: 800;
        line-height: 72px;
        margin: 0 0 24px;
        text-align: center;
    }
    .ref{
        text-transform: uppercase;
        text-decoration: none;
    }

    .pv-img {
        border-radius: 50%;

    }
    .centeredOverlay {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.71);
        /*dim the background*/
        top:0;
        left:0;
        opacity: 0;
        width:100%;
        height:100%;
        color:black;
        text-align: center;
        border-radius: 50%;
        transition: all 200ms cubic-bezier(0.420, 0.000, 0.580, 1.000)
    }
    .centeredOverlay:hover {
        opacity: 0.7;

    }
    .wrapper {
        position: relative;

    }

    .centeredOverlay span {
        position: absolute;
        top:50%;
        left:50%;
        -webkit-transform:translate(-50%, -50%);
        transform:translate(-50%, -50%);
        color: white;
    }


    .search-group {
        margin-top: 10px;
    }
</style>