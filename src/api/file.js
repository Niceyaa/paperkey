import request from "@/utils/request"

//file
export function policy(data){
  return request({
    url:"/zmsys-file/oss/policyWithType?"+data,
    method: "get",
  })
}

export function fileUpload(data){
  return request({
    url:"/zmsys-file/file-manage/upload",
    method: "post",
    data
  })
}


