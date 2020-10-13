import request from "@/utils/request"

/*角色管理接口*/
export function getList(){
  return request({
    url:"/zmsys-auth/sys/permissionCategory/list",
    method: "get"
  })
}

export function addCategory(data){
  return request({
    url:"/zmsys-auth/sys/permissionCategory/insert",
    method: "post",
    data
  })
}

export function deleteCategory(data){
  return request({
    url:"/zmsys-auth/sys/permissionCategory/deleteBatch",
    method: "post",
    data
  })
}

export function sortCategory(data){
  return request({
    url:"/zmsys-auth/sys/permissionCategory/changeSort",
    method: "post",
    data
  })
}

export function updateCategory(data){
  return request({
    url:"/zmsys-auth/sys/permissionCategory/update",
    method: "post",
    data
  })
}

export function getUserPermission(){
  return request({
    url:"/zmsys-auth/sys/permissionCategory/listPermissionTree",
    method: "get"
  })
}
