import request from "@/utils/request"

/*角色管理接口*/
export function rolesList(data){
  return request({
    url:"/zmsys-auth/sys/role/listPage",
    method: "post",
    data
  })
}

export function rolesAdd(data){
  return request({
    url:"/zmsys-auth/sys/role/insert",
    method: "post",
    data
  })
}

export function rolesUpdate(data){
  return request({
    url:"/zmsys-auth/sys/role/update",
    method: "post",
    data
  })
}

export function rolesDelete(data){
  return request({
    url:"/zmsys-auth/sys/role/delete",
    method: "post",
    data
  })
}

/*角色权限管理接口*/
export function addRolePermission(data){
  return request({
    url:"/zmsys-auth/sys/rolePermission/addRolePermission",
    method: "post",
    data
  })
}

export function deleteRolePermission(data){
  return request({
    url:"/zmsys-auth/sys/rolePermission/deleteRolePermission",
    method: "post",
    data
  })
}

export function findRolePermission(data){
  return request({
    url:"/zmsys-auth/sys/rolePermission/findRolePermission",
    method: "post",
    data
  })
}

/*角色用户管理接口*/
export function rolesUserDelete(data){
  return request({
    url:"/zmsys-auth/sys/userRole/delete",
    method: "post",
    data
  })
}

export function rolesUserAdd(data){
  return request({
    url:"/zmsys-auth/sys/userRole/insert",
    method: "post",
    data
  })
}

export function rolesUserList(data){
  return request({
    url:"/zmsys-auth/sys/userRole/listPage",
    method: "post",
    data
  })
}
