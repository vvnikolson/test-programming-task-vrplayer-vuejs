import ImageService from 'service/imageService.js'
// Модуль отвечающий за загрузку и отправку новых изображений на сервер

const state = {
    enableManualRotation: false,
    rotationSpeed: 5,
    name: null,
    preview: null,
    imgFile: null,
    inputFile: null
}

const getters = {
    uploadReady: state => {
        return state.inputFile && state.preview && state.name
    }
}

const actions = {
    uploadImage({state, dispatch}) {
    ImageService.uploadImage({
            name: state.name,
            imageFile: state.inputFile,
            enableManualRotation: state.enableManualRotation,
            rotationSpeed: state.rotationSpeed
        },
        state.preview).then(response => {
            dispatch("alert/addMessage",
                {messageText: 'File successfully loaded to server.',type: 'success'},
                {root:true})
            dispatch("resetState")
        }).catch(error => {
            dispatch("alert/addMessage",
                {messageText: 'File Load Error: ' + error.statusCode, type: 'danger'}, {root:true})
            throw error
    })
    },
    setPreview({commit}, preview) {
        commit("SET_PREVIEW", preview)
    },
    resetState({commit}) {
        commit("RESET_STATE")
    }
}

const mutations = {
    RESET_STATE(state) {
        state.rotationSpeed =  5
        state.name = null
        state.preview = null
        state.imgFile = null
        state.inputFile = null
    },
    SET_PREVIEW(state, canvas) {
        state.preview = canvas
    },
    SET_IMAGE_PARAMS(state, {name, enableManualRotation, rotationSpeed, imgFile, inputFile=null}) {
        state.enableManualRotation = enableManualRotation
        state.rotationSpeed = rotationSpeed
        state.name = name
        state.imgFile = imgFile
        state.inputFile = inputFile
    }
}

const imageModule = {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}

export default imageModule