import request from "@/utils/request"

//商品分類
export function goodsClassifyDelete(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodityClassify/deleteCommodityClassify",
    method: "post",
    data
  })
}

export function goodsClassifyAdd(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodityClassify/insertCommodityClassify",
    method: "post",
    data
  })
}

export function goodsClassifyList(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodityClassify/selectCommodityClassifyList",
    method: "post",
    data
  })
}

export function goodsClassifyTreeList(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodityClassify/selectCommodityClassifyTree",
    method: "post",
    data
  })
}

export function goodsClassifyEdit(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodityClassify/updateCommodityClassify",
    method: "post",
    data
  })
}


//商品
export function goodsDelete(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodity/deleteBatch",
    method: "post",
    data
  })
}

export function goodsAdd(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodity/insert",
    method: "post",
    data
  })
}

export function goodsList(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodity/listPage",
    method: "post",
    data
  })
}

export function goodsEdit(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodity/update",
    method: "post",
    data
  })
}

export function goodsPicOpt(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodityPhoto/addOrUpdateCommodityPhoto",
    method: "post",
    data
  })
}

export function goodsPicList(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodityPhoto/listCommodityPhoto?"+data,
    method: "get"
  })
}

export function goodsPicDelete(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodityPhoto/delete?"+data,
    method: "get"
  })
}



//商品库存
export function goodsSupplyList(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodityStock/queryCommodityStockList",
    method: "post",
    data
  })
}

//商品出入库
export function goodsInWarehouse(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodityStorage/addCommodityByStorage",
    method: "post",
    data
  })
}

export function goodsOutWarehouse(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodityStorage/outCommodityByStorage",
    method: "post",
    data
  })
}

export function goodsInWarehouseList(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodityStorage/queryCommodityInStorageList",
    method: "post",
    data
  })
}

export function goodsOutWarehouseList(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodityStorage/queryCommodityOutStorageList",
    method: "post",
    data
  })
}


//商品訂單
export function goodsOrderList(data){
  return request({
    url:"/zmsys-integral-mall/sys/commodityOrder/listPageOrder",
    method: "post",
    data
  })
}

export function orderDeliver(data){
  return request({
    url:"/zmsys-integral-mall/sys/deliveryRecord/delivery",
    method: "post",
    data
  })
}

export function orderReceive(data){
  return request({
    url:"/zmsys-integral-mall/sys/deliveryRecord/receiving",
    method: "post",
    data
  })
}
