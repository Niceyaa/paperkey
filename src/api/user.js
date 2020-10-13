import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',http://192.168.1.57:19082/zmsys-auth
    url: '/zmsys-auth/sys/login',//http://192.168.1.57:19082/zmsys-auth
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/zmsys-auth/sys/logout',
    method: 'post'
  })
}

export function updatePwd(data) {
  return request({
    url: '/zmsys-auth/sys/sysUser/updatePassword',
    method: 'post',
    data
  })
}
