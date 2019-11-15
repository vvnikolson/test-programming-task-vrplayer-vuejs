//import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from "three"
import {OrbitControls} from 'utils/OrbitControls.js'
import {StereoEffect} from "three/examples/jsm/effects/StereoEffect.js"
import {addListener, removeAllListeners} from 'utils/EventHandlersHelper.js'

import ImageService from 'service/imageService.js'


const getDefaultState = () => {
    return {
        // viewport params
        height: 500,
        width: 500,
        // webgl params
        scene: null,
        renderer: null,
        camera: null,
        material: null,
        imageSphere: null,
        controls: null,
        sEffect: null, // stereo renderer
        // controls
        clicked: false,
        VREnable: false,
        pause: false
    }
}

const state = getDefaultState()
const getters = {
    readyToRender: state => {
        return !(!state.scene &&
            !state.renderer &&
            !state.camera &&
            !state.material &&
            !state.imageSphere &&
            !state.controls &&
            !state.sEffect)
    },
    cameraPosition: state => {
        return state.camera ? state.camera.position : null
    },
    cameraTarget: state => {
        if(!state.camera) {
            return null
        }
        let vector = new THREE.Vector3( 0, 0, 0 )
        state.camera.getWorldDirection(vector)
        return vector
    }
}
const actions = {
    reloadMaterial({commit, rootState}, source) {
        commit("LOAD_MATERIAL", rootState.image.imgFile)
    },
    getImageData({commit, dispatch}, id) {
        return new Promise((resolve, reject) => {
            ImageService.getImageInfoById(id)
                .then(data => {
                    commit("image/SET_IMAGE_PARAMS", {
                        enableManualRotation: data.manual_camera_control,
                        rotationSpeed: data.rotation_speed,
                        name: data.name,
                        imgFile: data.source
                    }, { root: true })
                    dispatch("alert/addMessage", {messageText: 'Image data loaded', type: 'success'}, { root: true })
                    resolve(data)
                })
                .catch(error => {
                    console.log(error)
                    if(error.response.status === 404) {
                        dispatch("alert/addMessage", {messageText: 'Image not found', type: 'danger'}, { root: true })
                    }
                    reject(error)
                })
            }
        )
    },
    addMouseHandlers({state, dispatch, commit}) {
        let oldEvent = {clientX: 0, clientY: 0}
        let mouseMoveHandler = function(event) {
            if(state.clicked) {

                state.controls.handleMouseMoveRotate(event, oldEvent)
                dispatch('callRender')
                oldEvent = event
            }
        }
        let mouseClickHandler = function(event) {
            oldEvent = event
            //console.log("mouse clicked")
            commit('TOGGLE_ROTATION')
        }

        addListener(state.renderer.domElement, 'click', mouseClickHandler, false);
        addListener(state.renderer.domElement, 'mousemove', mouseMoveHandler, false);
        state.controls.dispose()
    },

    removeEventListeners({state}, event) {
        removeAllListeners(state.renderer.domElement, event)
        console.log('listeners removed')
    },

    resetState({commit}) {
        commit("RESET_STATE")
    },

    init({state, commit, dispatch, rootState}, {width, height, context}) {
        return new Promise(resolve => {
            commit("INITIALIZE_VIEWPORT", {width, height})
            commit("INITIALIZE_RENDERER", context)
            commit("INITIALIZE_CAMERA")
            commit("LOAD_MATERIAL", rootState.image.imgFile)
            commit("INITIALIZE_IMAGE_SPHERE")
            commit("INITIALIZE_SCENE")
            commit("INITIALIZE_CONTROLS")
            commit("INITIALIZE_STEREO")


/*            document.addEventListener( 'visibilitychange' , function() {
                    console.log('visibilitychange')
            }, false )*/

            if(rootState.image.enableManualRotation) {
                state.controls.dispose()
                dispatch('addMouseHandlers')
            }
            state.controls.update()
            dispatch('callRender')
            resolve()
        })
    },
    animate({state, dispatch, rootState}) {
        if(!state.paused) {
            window.requestAnimationFrame((val) => {
                dispatch("animate")
                if(!rootState.image.enableManualRotation) {

                    let speed = val * 0.00005 * rootState.image.rotationSpeed;
                    state.camera.position.x = Math.cos(speed) * 5;
                    state.camera.position.z = -Math.sin(speed) * 5;
                    state.camera.lookAt(state.scene.position)
                    state.camera.updateProjectionMatrix()
                    dispatch('callRender')
                }
            })
        }
    },
    callRender({state}) {
        if(state.VREnable) {
            state.sEffect.render(state.scene, state.camera)
        } else {
            state.renderer.setSize(state.width, state.height)
            state.renderer.render(state.scene, state.camera)
        }
    },
    toggleVRmode({commit, dispatch}) {
        commit('TOGGLE_STEREO')
        dispatch('callRender')
    },
    resize({commit, dispatch}, {width, height}) {
        commit('RESIZE', {width, height})
        console.log('resized')
        dispatch('callRender')
    },
    takeScreen({dispatch, state} ) {
        dispatch('callRender')
        let canvas = state.renderer.getContext("2d").canvas
        let data = canvas.toDataURL("image/jpg")
        dispatch('image/setPreview', data, {root: true})
    },
    pauseRender({commit, dispatch}) {
        console.log("Render paused")
        commit('SET_PAUSE', true)
        dispatch('removeEventListeners')
    },
    resumeRender({rootState, commit, dispatch}) {
        if(rootState.image.enableManualRotation) {
            dispatch('addMouseHandlers')
            console.log("Mouse handlers restored")
        }
        console.log('Render resumed')
        commit('SET_PAUSE', false)
        dispatch('animate')
    }

}

const mutations = {
    SET_PAUSE(state){
        state.paused = !state.paused
    },
    RESET_STATE(state) {
        Object.assign(state, getDefaultState())
    },
    INITIALIZE_VIEWPORT(state, {width, height}) {
        state.width = width
        state.height = height
    },
    INITIALIZE_RENDERER(state, context) {
        state.renderer = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true
        })
        state.renderer.setClearColor(0xffffff, 0)
        state.renderer.setPixelRatio(window.devicePixelRatio)
        state.renderer.setSize(state.width, state.height)
        state.renderer.shadowMap.enabled = true;
        state.renderer.setClearColor(0xEEEEEE);
        console.log(context)
        if (context != null) {
            context.appendChild(state.renderer.domElement)
        }

    },
        //
    INITIALIZE_CAMERA(state) {
        state.camera = new THREE.PerspectiveCamera(
            75, // Angle
            state.width/ state.height, // Aspect Ratio
            1, // Near view
            2300 // Far view
        )
        state.camera.position.set(400,400,0)
    },
    INITIALIZE_STEREO(state) {
        state.sEffect = new StereoEffect(state.renderer)
        state.sEffect.setSize(state.width, state.height)
        state.sEffect.setEyeSeparation(-2)

    },
    INITIALIZE_CONTROLS(state) {
        state.controls = new OrbitControls(state.camera, state.renderer.domElement)
        state.controls.rotateSpeed = 1.0
        state.controls.enableZoom = false
        state.controls.enablePan = false
        state.controls.enableRotate = false;
        state.controls.target.set(0, 0, 1);
        state.renderer.render(state.scene, state.camera)
    },

    LOAD_MATERIAL(state, source) {
        const loader = new THREE.TextureLoader()
        let texture = loader.load(source)
        if(state.material) {
            state.material.map = texture
        } else {
            state.material = new THREE.MeshPhongMaterial({
                color: "#ffffff",
                shininess: 0,
                map: texture,
                specular: "#000000",
                side: THREE.BackSide,
            })
            state.material.side = THREE.BackSide
        }
    },

    INITIALIZE_IMAGE_SPHERE(state) {

        let geometry = new THREE.SphereGeometry(330, 128, 128)
        state.imageSphere = new THREE.Mesh(geometry, state.material)
        state.imageSphere.rotation.y = Math.PI /1.8
        state.imageSphere.position.set(0,0,0)
        state.imageSphere.side = THREE.BackSide
    },
    INITIALIZE_SCENE(state) {
        state.scene = new THREE.Scene()
        let lightSource = new THREE.PointLight(0xffffff, 1, 1000, 0)
        lightSource.position.set(0, 0, 0)
        state.scene.add(state.camera)
        state.scene.add(lightSource)
        state.scene.add(state.imageSphere)
    },
    RESIZE(state, {width, height}) {
        state.width = width
        state.height = height
        state.camera.aspect = width/height
        state.camera.updateProjectionMatrix()
    },
    TOGGLE_STEREO(state) {
        state.VREnable = !state.VREnable
    },
    SET_NEW_VIEWPORT(state, context) {
         context.appendChild(state.renderer.domElement)
    },
    SET_CAMERA_POSITION(state, {x,y,z}) {

        state.camera.position.set(x,y,z)
        state.camera.updateProjectionMatrix()

    },
    TOGGLE_ROTATION(state) {
        state.clicked = !state.clicked
        if(state.clicked) {
            document.body.style.cursor = 'none'
        } else {
            document.body.style.cursor = 'auto'
        }
    }

}

const playerModule = {
    namespaced: true,
    getters,
    state,
    actions,
    mutations
}

export default playerModule