import axios from 'axios'
import config from '../Config/config'

export default axios.create({
  baseURL: config.SERVER_URL,
  mode: 'cors',
  headers: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
      'Cache-Control': 'no-cache'
    },
  }
})
