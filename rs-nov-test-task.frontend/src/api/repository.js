import Axios from 'axios'

const baseURL = 'http://91.103.252.69:80/'

export default Axios.create({
    baseURL
})