import request from "@/utils/request"

export function permissionList(data){
  return request({
    url:"/zmsys-auth/sys/permission/listPage",
    method: "post",
    data
  })
}

export function permissionAdd(data){
  return request({
    url:"/zmsys-auth/sys/permission/insert",
    method: "post",
    data
  })
}

export function permissionEdit(data){
  return request({
    url:"/zmsys-auth/sys/permission/update",
    method: "post",
    data
  })
}

export function permissionDelete(data){
  return request({
    url:"/zmsys-auth/sys/permission/deleteBatch",
    method: "post",
    data
  })
}

// 自权限接口
export function permissionChildList(data){
  return request({
    url:"/zmsys-auth/sys/subPermission/listPage",
    method: "post",
    data
  })
}

export function permissionChildDelete(data){
  return request({
    url:"/zmsys-auth/sys/subPermission/deleteBatch",
    method: "post",
    data
  })
}

export function permissionChildAdd(data){
  return request({
    url:"/zmsys-auth/sys/subPermission/insert",
    method: "post",
    data
  })
}

export function permissionChildEdit(data){
  return request({
    url:"/zmsys-auth/sys/subPermission/update",
    method: "post",
    data
  })
}

