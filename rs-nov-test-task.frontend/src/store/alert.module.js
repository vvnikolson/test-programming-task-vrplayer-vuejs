const state = {
    messages: []
}

const lifetimeInterval = 5000
let messageId = 0

const getters = {
    getAlertMessages: state => { return state.messages}
}

const actions = {
    addMessage({commit}, {messageText, type='info', lifetime = lifetimeInterval}) {
        const id = ++messageId
        commit('ADD_MESSAGE', {id, messageText, type, lifetime})
        setTimeout(() => commit("REMOVE_MESSAGE", id), lifetime)
    }
}

const mutations = {
    ADD_MESSAGE(state, data) {
        console.log(data)
        state.messages.push(data)
    },
    REMOVE_MESSAGE(state, id) {
        state.messages = state.messages.filter(item => item.id !== id)
    }
}

const alertModule = {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}

export default alertModule