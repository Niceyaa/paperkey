import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from "qs"

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: "http://192.168.1.57:19082/zmsys-auth/", // url = base url + request url
  // baseURL: "/dpc", // url = base url + request url
  // baseURL: "http://192.168.1.165:19082",
  baseURL: "http://192.168.2.31:19082",
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
   /* if (config.method === "post"){
      config.data = qs.stringify(config.data);
    }*/

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 1111 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('登录身份已过期，请重新登录', '登录过期', {
          confirmButtonText: '确定',
          cancelButtonText: '停留',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response
    }
  },
  error => {
    // console.log('err111' ,error.response.status) // for debug
    if (error.response.status === 401){

        // to re-login
      MessageBox.confirm('登录身份已过期，请重新登录', '登录过期', {
        confirmButtonText: '确定',
        cancelButtonText: '停留',
        type: 'warning'
      }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })

    }else{
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export default service
