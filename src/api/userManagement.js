import request from "@/utils/request"

export function userList(data){
  return request({
    url:"/zmsys-auth/sys/sysUser/queryUserList",
    method: "post",
    data
  })
}

export function addUser(data){
  return request({
    url:"/zmsys-auth/sys/sysUser/addUser",
    method: "post",
    data
  })
}

export function resetPwd(data){
  return request({
    url:"/zmsys-auth/sys/sysUser/resetPassword",
    method: "post",
    data
  })
}

export function changeInfo(data){
  return request({
    url:"/zmsys-auth/sys/sysUser/updateUserInfo",
    method: "post",
    data
  })
}

export function updateState(data){
  return request({
    url:"/zmsys-auth/sys/sysUser/updateUserState",
    method: "post",
    data
  })
}
