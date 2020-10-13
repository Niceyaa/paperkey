import request from "@/utils/request"

// 纸张分类管理
export function paperClassifyDelete(data){
  return request({
    url:"/zmsys-retrieve/sys/confPaperClassify/deleteBatch",
    method: "post",
    data
  })
}

export function paperClassifyAdd(data){
  return request({
    url:"/zmsys-retrieve/sys/confPaperClassify/insert",
    method: "post",
    data
  })
}

export function paperClassifyList(data){
  return request({
    url:"/zmsys-retrieve/sys/confPaperClassify/listPage",
    method: "post",
    data
  })
}


export function paperClassifyUpdate(data){
  return request({
    url:"/zmsys-retrieve/sys/confPaperClassify/update",
    method: "post",
    data
  })
}

//回收过程管理
export function recycleProcessDelete(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrieveProcess/deleteBatch",
    method: "post",
    data
  })
}

export function recycleProcessAdd(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrieveProcess/insert",
    method: "post",
    data
  })
}

export function recycleProcessList(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrieveProcess/listPage",
    method: "post",
    data
  })
}

export function recycleProcessUpdate(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrieveProcess/update",
    method: "post",
    data
  })
}


//回收过程节点管理
export function processNodeDelete(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrieveProcessNode/deleteBatch",
    method: "post",
    data
  })
}

export function processNodeAdd(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrieveProcessNode/insert",
    method: "post",
    data
  })
}

export function processNodeList(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrieveProcessNode/listPage",
    method: "post",
    data
  })
}

export function processNodeUpdate(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrieveProcessNode/update",
    method: "post",
    data
  })
}


//人员轨迹
export function staffPathAdd(data){
  return request({
    url:"/zmsys-retrieve/app/retrieveTrail/insertRetrieveTrail",
    method: "post",
    data
  })
}

export function staffPathList(data){
  return request({
    url:"/zmsys-retrieve/app/retrieveTrail/selectRetrieveTrailList",
    method: "post",
    data
  })
}


//回收价格参数
export function recyclePriceDelete(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrievePrice/deleteConfRetrievePrice",
    method: "post",
    data
  })
}

export function recyclePriceAdd(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrievePrice/insertConfRetrievePrice",
    method: "post",
    data
  })
}

export function recyclePriceList(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrievePrice/selectConfRetrievePriceList",
    method: "post",
    data
  })
}

export function recyclePriceUpdate(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrievePrice/updateConfRetrievePrice",
    method: "post",
    data
  })
}


//回收重量参数
export function recycleWeightDelete(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrieveWeight/deleteConfRetrieveWeight",
    method: "post",
    data
  })
}

export function recycleWeightAdd(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrieveWeight/insertConfRetrieveWeight",
    method: "post",
    data
  })
}

export function recycleWeightList(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrieveWeight/selectConfRetrieveWeightList",
    method: "post",
    data
  })
}

export function recycleWeightUpdate(data){
  return request({
    url:"/zmsys-retrieve/sys/confRetrieveWeight/updateConfRetrieveWeight",
    method: "post",
    data
  })
}


// 碎紙
export function tatterList(data){
  return request({
    url:"/zmsys-retrieve/sys/paperShredder/selectPaperShredder",
    method: "post",
    data
  })
}

export function tatterAdd(data){
  return request({
    url:"/zmsys-retrieve/sys/paperShredder/addOrderDistribution",
    method: "post",
    data
  })
}

export function tatterIsFinish(data){
  return request({
    url:"/zmsys-retrieve/sys/paperShredder/finishPaperShredder",
    method: "post",
    data
  })
}

export function tatterScanCode(data){
  return request({
    url:"/zmsys-retrieve/sys/paperShredder/scanPaperShredder",
    method: "post",
    data
  })
}

//紙張壓縮
export function paperZipList(data){
  return request({
    url:"/zmsys-retrieve/sys/pageCompress/listPage",
    method: "post",
    data
  })
}

export function paperZipAdd(data){
  return request({
    url:"/zmsys-retrieve/sys/pageCompress/insert",
    method: "post",
    data
  })
}

export function paperZipFinish(data){
  return request({
    url:"/zmsys-retrieve/sys/pageCompress/finishCompressTask?"+data,
    method: "get"
  })
}

export function paperZipScanCode(data){
  return request({
    url:"/zmsys-retrieve/interface/paperCompress/packageCompressScan",
    data,
    method: "post"
  })
}


// 紙餅
export function pillAdd(data){
  return request({
    url:"/zmsys-retrieve/sys/paperPills/insert",
    data,
    method: "post"
  })
}

export function pillList(data){
  return request({
    url:"/zmsys-retrieve/sys/paperPills/listPage",
    data,
    method: "post"
  })
}


//订单管理
export function orderAdd(data){
  return request({
    url:"/zmsys-retrieve/sys/order/addOrder",
    method: "post",
    data
  })
}

export function orderDelete(data){
  return request({
    url:"/zmsys-retrieve/sys/order/cancelOrder",
    method: "post",
    data
  })
}

export function orderDetail(data){
  return request({
    url:"/zmsys-retrieve/sys/order/queryOrderDetails",
    method: "post",
    data
  })
}

export function orderList(data){
  return request({
    url:"/zmsys-retrieve/sys/order/queryOrderList",
    method: "post",
    data
  })
}

export function receiveFinish(data){
  return request({
    url:"/zmsys-retrieve/sys/order/receiptFinished",
    method: "post",
    data
  })
}

//回收站
export function recycleAdd(data){
  return request({
    url:"/zmsys-agent/sys/recycler/addRecycler",
    method: "post",
    data
  })
}

export function recycleDelete(data){
  return request({
    url:"/zmsys-agent/sys/recycler/dellRecycler",
    method: "post",
    data
  })
}

export function recycleList(data){
  return request({
    url:"/zmsys-agent/sys/recycler/queryRecyclerList",
    method: "post",
    data
  })
}

export function recycleUpdate(data){
  return request({
    url:"/zmsys-agent/sys/recycler/updateRecycler",
    method: "post",
    data
  })
}


//包裹入庫
export function bagPutInList(data){
  return request({
    url:"/zmsys-retrieve/sys/paperStorage/queryPaperStorageList",
    method: "post",
    data
  })
}

export function bagPutInAdd(data){
  return request({
    url:"/zmsys-retrieve/sys/paperStorage/addPaperStorage",
    method: "post",
    data
  })
}

export function bagDetail(data){
  return request({
    url:"/zmsys-retrieve/sys/orderPackage/queryOrderPackage",
    method: "post",
    data
  })
}

//延期
export function postponeList(data){
  return request({
    url:"/zmsys-retrieve/sys/orderDelay/selectOrderDelayList",
    method: "post",
    data
  })
}

export function postponeAdd(data){
  return request({
    url:"/zmsys-retrieve/sys/orderDelay/addOrderDelay",
    method: "post",
    data
  })
}


//派單
export function sendOrderAdd(data){
  return request({
    url:"/zmsys-retrieve/sys/orderDistribution/addOrderDistribution",
    method: "post",
    data
  })
}

export function sendOrderList(data){
  return request({
    url:"/zmsys-retrieve/sys/orderDistribution/selectOrderDistribution",
    method: "post",
    data
  })
}


// 裝車出庫
export function outBoundList(data){
  return request({
    url:"/zmsys-retrieve/sys/paperWarehouseOut/listPage",
    method: "post",
    data
  })
}

export function outBoundAdd(data){
  return request({
    url:"/zmsys-retrieve/sys/paperWarehouseOut/insert",
    method: "post",
    data
  })
}

export function outBoundFinish(data){
  return request({
    url:"/zmsys-retrieve/sys/paperWarehouseOut/finishOutPaperPillsTask?"+data,
    method: "get"
  })
}

export function outBoundSureBalance(data){
  return request({
    url:"/zmsys-retrieve/sys/paperWarehouseOut/confirmSettlement?"+data,
    method: "get"
  })
}

export function balancePutIn(data){
  return request({
    url:"/zmsys-retrieve/sys/paperWarehouseOut/updateSettlementInfo",
    method: "post",
    data
  })
}

export function scanCodeAddPill(data){
  return request({
    url:"/zmsys-retrieve/sys/paperWarehouseOut/outPaperPillsScan",
    method: "post",
    data
  })
}

//接單
export function orderReceive(data){
  return request({
    url:"/zmsys-retrieve/sys/order/orderReceive",
    method: "post",
    data
  })
}

