import axios from 'axios'

const instance = axios.create({
  baseURL: '/',
  timeout: 36000,
  headers: {
    Accept: 'application/json, text/plain, */*'
  }
})

instance.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截
instance.interceptors.response.use(
  res => {
    const {status, data} = res
    return {status, data}
  },
  error => {
    return Promise.reject(error.response)
  }
)

export default instance
