// axios拦截，验权
import axios from 'axios'
// import { Message, MessageBox } from 'element-ui'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth' // setToken

// 创建axios实例
const service = axios.create({
  // baseURL: 'http://192.168.0.163:8888', // api的base_url(process.env.BASE_API)
  // timeout: 30000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非200是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if (res.status === 'success') {
      // setToken(res.token) // 更新token
      return res
    } else {
      // 没有权限
      if (res.status === 'login') {
        Message({
          message: res.message,
          type: 'error',
          duration: 2 * 1000
        })
        setTimeout(function() {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        }, 2000)
      } else {
        Message({
          message: res.message,
          type: 'error',
          duration: 2 * 1000
        })
        return Promise.reject(res)
      }
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
