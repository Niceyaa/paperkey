import request from "@/utils/request"

export function menuList(data){
  return request({
    url:"/zmsys-auth/sys/menuManage/listPage",
    method: "post",
    data
  })
}

export function menuAdd(data){
  return request({
    url:"/zmsys-auth/sys/menuManage/insert",
    method: "post",
    data
  })
}

export function menuUpdate(data){
  return request({
    url:"/zmsys-auth/sys/menuManage/update",
    method: "post",
    data
  })
}

export function menuDelete(data){
  return request({
    url:"/zmsys-auth/sys/menuManage/delete",
    method: "post",
    data
  })
}

export function menuSort(data){
  return request({
    url:"/zmsys-auth/sys/menuManage/moveSort?"+data,
    method: "get"
  })
}


