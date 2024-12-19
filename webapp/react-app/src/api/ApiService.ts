import Axios from 'axios'

const ApiService = Axios.create({
  baseURL: 'http://52.45.165.140',
})
export default ApiService

