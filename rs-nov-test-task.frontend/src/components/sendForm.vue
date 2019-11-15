<template>
    <b-container>
        <b-row align-h="center" class="mt-5">
            <b-col cols="8">
                <b-form @submit.prevent="onSubmit()">
                    <b-form-input
                            id="input-image-name"
                            type="text"
                            v-model="imageForm.name"
                            :state="validName"
                            placeholder="Enter image name" />
                    <div class="invalid-feedback d-block" v-if="!validName">Name may be 3-60 characters size and should contain only letters and numbers</div>

                    <b-form-group class="camera-block px-2">

                        <b-form-checkbox class="rotation-checkbox" sm-6
                                         id="enable-manual-rotation-checkbox"
                                         name="enable-manual-rotation-checkbox" v-model="imageForm.enableManualRotation" value="true" unchecked-value="false">Camera rotation control</b-form-checkbox>

                            <b-form-group  v-if="!enableManualRotation">
                                <div class="divider"></div>
                                <b-col sm="6">
                                    Camera rotation speed: {{ imageForm.rotationSpeed }}
                                </b-col>
                                <b-col>
                                    <b-form-input class="py-0 custom-range"
                                                  id="input-rotation-speed"
                                                  v-model="imageForm.rotationSpeed"
                                                  type="range"
                                                  min="1"
                                                  max="10"/>
                                </b-col>
                            </b-form-group>

                    </b-form-group>
                    <b-form-group
                            id="file-load-group"
                    >
                        <b-form-file class="upload-field"
                                v-model="imageForm.imgFile"
                                :state="validFile"
                                placeholder="Choose a file or drag&drop here..."
                                drop-placeholder="Drop file here..." accept="image/jpeg, image/png"/>
                        <div class="invalid-feedback d-block" v-if="!validFile">Please select PNG or JPEG image</div>
                    </b-form-group>
                    <div class="button-container">
                        <b-button id="s-button" type="submit" variant="primary" :disabled="!isDisabled">Upload</b-button>
                    </div>
                </b-form>
            </b-col>
        </b-row>
    </b-container>




</template>

<script>
    import {mapActions, mapMutations, mapState} from 'vuex'

    export default {
        name: "sendForm",
        data() {
            return {
                imageForm: {
                    name: "",
                    enableManualRotation: true,
                    rotationSpeed: 5,
                    imgFile: null
                },
                testimage: null,
                submited: false,
            }
        },
        computed: {
            enableManualRotation() { return this.imageForm.enableManualRotation = (this.imageForm.enableManualRotation == 'true') },
            ...mapState('image', ['preview']),
            validName() {
                const nameRegExp = /^[a-zA-Z0-9 ]{3,60}$/
                return nameRegExp.test(this.imageForm.name)
            },
            validFile() {
                const validTypes = ['image/png', 'image/jpeg']
                return this.imageForm.imgFile ? validTypes.includes(this.imageForm.imgFile.type) : false
            },
            isDisabled() {
                return this.validName && this.validFile
            }
        },
        methods: {
            ...mapActions('alert', ['addMessage']),
            ...mapMutations('image', ['SET_IMAGE_PARAMS']),
            onSubmit(evt) {
                let reader = new FileReader();

                reader.onload = ((file) => { return (e) => {

                    this.SET_IMAGE_PARAMS({name: this.imageForm.name,
                        enableManualRotation:this.imageForm.enableManualRotation,
                        rotationSpeed:this.imageForm.rotationSpeed,
                        imgFile: e.target.result,
                        inputFile: this.imageForm.imgFile
                    })
                    this.addMessage({messageText:'Image successfully loaded',type: 'success'})
                    this.$emit('submited', true)
                };
                })(this.imageForm.imgFile)

                reader.readAsDataURL(this.imageForm.imgFile)

                //
                //this.submited = true
                //
                //ImageService.uploadImage(this.imageForm, this.preview)
                console.log('end')
            },
        }
    }
</script>

<style scoped>
    .upload-field{
        white-space: nowrap;
        width: 100%;                   /* IE6 needs any width */
        overflow: hidden;              /* "overflow" value must be different from  visible"*/
        -o-text-overflow: ellipsis;    /* Opera < 11*/
        text-overflow:    ellipsis;
    }


    .divider{
        border-bottom: 2px solid;
        width: 95%;
        margin-top: 7px;
        opacity: 0.8;
        margin-bottom: 5px;
        margin-left: 2.5%;
        border-bottom-color: lightgray;
    }

    .camera-block {
        border-radius: 3px;
        border: 1px solid #28A745;
        padding: 20px;
    }

    .button-container {
        text-align: center;

    }
    .custom-range {
        width: 100%;
        height: calc(1rem + .4rem);
        padding: 0;
        background-color: transparent;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none
    }

    .custom-range:focus {
        outline: 0;
        box-shadow: 0 0 0 1px #fff,0 0 0 .2rem rgba(0,123,255,.25)
    }

    .custom-range::-moz-focus-outer {
        border: 0
    }

    .custom-range::-webkit-slider-thumb {
        width: 1rem;
        height: 1rem;
        margin-top: -.25rem;
        background-color: #007bff;
        border: 0;
        border-radius: 1rem;
        transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        -webkit-appearance: none;
        appearance: none
    }

    .custom-range::-webkit-slider-thumb:active {
        background-color: #b3d7ff
    }

    .custom-range::-webkit-slider-runnable-track {
        width: 100%;
        height: .5rem;
        color: transparent;
        cursor: pointer;
        background-color: #dee2e6;
        border-color: transparent;
        border-radius: 1rem
    }

    .custom-range::-moz-range-thumb {
        width: 1rem;
        height: 1rem;
        background-color: #007bff;
        border: 0;
        border-radius: 1rem;
        transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        -moz-appearance: none;
        appearance: none
    }

    .custom-range::-moz-range-thumb:active {
        background-color: #b3d7ff
    }

    .custom-range::-moz-range-track {
        width: 100%;
        height: .5rem;
        color: transparent;
        cursor: pointer;
        background-color: #dee2e6;
        border-color: transparent;
        border-radius: 1rem
    }

    .custom-range::-ms-thumb {
        width: 1rem;
        height: 1rem;
        margin-top: 0;
        margin-right: .2rem;
        margin-left: .2rem;
        background-color: #007bff;
        border: 0;
        border-radius: 1rem;
        transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        appearance: none
    }

    .custom-range::-ms-thumb:active {
        background-color: #b3d7ff
    }

    .custom-range::-ms-track {
        width: 100%;
        height: .5rem;
        color: transparent;
        cursor: pointer;
        background-color: transparent;
        border-color: transparent;
        border-width: .5rem
    }

    .custom-range::-ms-fill-lower {
        background-color: #dee2e6;
        border-radius: 1rem
    }

    .custom-range::-ms-fill-upper {
        margin-right: 15px;
        background-color: #dee2e6;
        border-radius: 1rem
    }

    .camera-block {
        margin-top: 1rem;
        margin-bottom: 1rem;
        padding: 2px;
    }
    #s-button {
        min-width: 180px;
    }


</style>