import request from "@/utils/request"

export function agentList(data){
  return request({
    url:"/zmsys-agent/sys/agent/queryAgent",
    method: "post",
    data
  })
}

export function agentAdd(data){
  return request({
    url:"/zmsys-agent/sys/agent/addAgent",
    method: "post",
    data
  })
}

export function agentUpdate(data){
  return request({
    url:"/zmsys-agent/sys/agent/updateAgent",
    method: "post",
    data
  })
}

export function agentDelete(data){
  return request({
    url:"/zmsys-agent/sys/agent/deleteAgent",
    method: "post",
    data
  })
}


