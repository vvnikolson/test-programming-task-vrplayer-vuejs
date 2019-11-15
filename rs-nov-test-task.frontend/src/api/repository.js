import Axios from 'axios'

const baseURL = 'http://localhost:8080/'

export default Axios.create({
    baseURL
})