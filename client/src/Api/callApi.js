import axios from 'axios'

export default axios.create({
  baseURL: `http://localhost:5000/`,
  mode: 'cors',
  headers: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
  }
})
