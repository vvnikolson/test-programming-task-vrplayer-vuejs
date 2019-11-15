import Repo from 'api/repository.js'

export default {
    uploadImage(payload) {
        const requestOptions = {
            headers: {
                'Content-Type': "multipart/form-data"
            }}
        return Repo.post('/images', payload, requestOptions)
    },
    getSourceImage(id) {
        return Repo.get(`/images/${id}/source`)
    },
    getImageInfo(id) {
        return Repo.get(`/images/${id}`)
    },
    getAllImages() {
        return Repo.get('/images')
    },
    getImagePreview(id) {
        return Repo.get(`/images/${id}/preview`)
    }

}