import request from "@/utils/request"

/*文章管理*/
export function addArticle(data){
  return request({
    url:"/pub-resource/sys/article/addArticle",
    method: "post",
    data
  })
}

export function deleteArticle(data){
  return request({
    url:"/pub-resource/sys/article/dellArticle",
    method: "post",
    data
  })
}

export function singleFind(data){
  return request({
    url:"/pub-resource/sys/article/queryArticle",
    method: "post",
    data
  })
}

export function articleList(data){
  return request({
    url:"/pub-resource/sys/article/queryArticleList",
    method: "post",
    data
  })
}

export function updateArticle(data){
  return request({
    url:"/pub-resource/sys/article/updateArticle",
    method: "post",
    data
  })
}

export function topArticle(data){
  return request({
    url:"/pub-resource/sys/article/updateArticleIsTop",
    method: "post",
    data
  })
}

export function checkArticle(data){
  return request({
    url:"/pub-resource/sys/article/updateArticleIsUse",
    method: "post",
    data
  })
}


// 文章分类
export function addArticleCategory(data){
  return request({
    url:"/pub-resource/sys/articleCategory/addArticleCategory",
    method: "post",
    data
  })
}

export function deleteArticleCategory(data){
  return request({
    url:"/pub-resource/sys/articleCategory/dellArticleCategory",
    method: "post",
    data
  })
}

export function singleArticleCategory(data){
  return request({
    url:"/pub-resource/sys/articleCategory/queryArticleCategory",
    method: "post",
    data
  })
}

export function articleCategoryList(data){
  return request({
    url:"/pub-resource/sys/articleCategory/queryArticleCategoryList",
    method: "post",
    data
  })
}

export function updateArticleCategory(data){
  return request({
    url:"/pub-resource/sys/articleCategory/updateArticleCategory",
    method: "post",
    data
  })
}

