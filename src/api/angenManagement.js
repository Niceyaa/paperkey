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


//代理商聯系人
export function contactList(data){
  return request({
    url:"/zmsys-agent/sys/contact/queryContactList",
    method: "post",
    data
  })
}

export function contactAdd(data){
  return request({
    url:"/zmsys-agent/sys/contact/addContact",
    method: "post",
    data
  })
}

export function contactDelete(data){
  return request({
    url:"/zmsys-agent/sys/contact/dellContact",
    method: "post",
    data
  })
}

export function contactEdit(data){
  return request({
    url:"/zmsys-agent/sys/contact/updateContact",
    method: "post",
    data
  })
}


