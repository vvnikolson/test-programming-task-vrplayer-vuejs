import ImageRepo from 'api/ImageRepository'

const repos = {
    images: ImageRepo
}

export const RepositoryFactory = {
    get: name => repos[name]
}