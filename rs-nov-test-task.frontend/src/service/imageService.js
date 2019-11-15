import {RepositoryFactory} from "api/repositoryFactory";

const ImageRepo = RepositoryFactory.get('images')

export default {
    uploadImage,
    getSourceImageById,
    getImageInfoById,
    getAllImagesData
}

function uploadImage({name, imageFile,enableManualRotation,rotationSpeed}, preview) {
    let formdata = new FormData()
    formdata.append("name",name)
    formdata.append("file",imageFile)
    formdata.append("enableManualRotation",enableManualRotation)
    formdata.append("rotationSpeed",rotationSpeed)
    formdata.append("previewImg", preview.split(',')[1])
    console.log('data prepared')
    return ImageRepo.uploadImage(formdata).then(response => {
        console.log(response)
        return response.data
    }).catch(error => {
        console.log(error)
        return Promise.new(error)
    })
}

function getImageInfoById(id) {
    return ImageRepo.getImageInfo(id)
        .then(response => {
            return response.data
            }
        ).catch(err => {
            console.log(err)
            return Promise.reject(err)
            }
        )
}

function getSourceImageById(id) {
    return ImageRepo.getSourceImage(id)
        .then(response => {
            console.log(response)
            return response.data
        })
        .catch(error => {
            throw error
        })
}

function getAllImagesData() {
    return new Promise((resolve, reject) => {
        ImageRepo.getAllImages().then( response => {
            const data = response.data
            resolve( data)
        }).catch(error => {
            console.log(error)
            reject(error)
        })
    })
}