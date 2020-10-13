import request from "@/utils/request"

export function cityList(data){
  return request({
    url:"/pub-resource/sys/city/queryCityList",
    method: "post",
    data
  })
}

export function cityAdd(data){
  return request({
    url:"/pub-resource/sys/city/addCity",
    method: "post",
    data
  })
}

export function cityUpdate(data){
  return request({
    url:"/pub-resource/sys/city/updateCity",
    method: "post",
    data
  })
}

export function cityDelete(data){
  return request({
    url:"/pub-resource/sys/city/deleteCity",
    method: "post",
    data
  })
}

export function cityTreeList(data){
  return request({
    url:"/pub-resource/sys/city/listCityPage",
    method: "post",
    data
  })
}
