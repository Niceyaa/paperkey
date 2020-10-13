import request from "@/utils/request"

export function bagList(data){
  return request({
    url:"/zmsys-retrieve/sys/orderPackage/queryOrderPackageList",
    method: "post",
    data
  })
}

export function bagAdd(data){
  return request({
    url:"/zmsys-retrieve/sys/orderPackage/addOrderPackage",
    method: "post",
    data
  })
}
