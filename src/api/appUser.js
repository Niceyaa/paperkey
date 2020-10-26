import request from "@/utils/request"

export function invoiceList(data){
  return request({
    url:"/zmsys-user/sys/userInvoice/getUserInvoiceList",
    method: "post",
    data
  })
}

export function invoiceAdd(data){
  return request({
    url:"/zmsys-user/sys/userInvoice/addUserInvoice",
    method: "post",
    data
  })
}

export function invoiceUpdate(data){
  return request({
    url:"/zmsys-user/sys/userInvoice/updateUserInvoice",
    method: "post",
    data
  })
}

export function invoiceDelete(data){
  return request({
    url:"/zmsys-user/sys/userInvoice/delUserInvoice",
    method: "post",
    data
  })
}

export function invoiceDeal(data){
  return request({
    url:"/zmsys-user/sys/userInvoice/invoiceHandle",
    method: "post",
    data
  })
}

//快遞處理
export function expressDeal(data){
  return request({
    url:"/zmsys-user/sys/userExpress/expressHandle",
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


