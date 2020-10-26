<template>
  <div class="app-container">

    <el-row class="top-btn">
      <el-button type="success" @click="goToNewArticle">新增文章</el-button>
    </el-row>
    <el-row>

      <el-input clearable class="search-container" v-model="keys" placeholder="标题关键字"></el-input>
      <el-button plain type="primary" @click="searchList">搜索</el-button>
      <el-button plain type="warning" @click="resetList">重置</el-button>
    </el-row>
   <!-- <el-row>
      <el-divider class="bigFont" content-position="left">{{currentCategoryInfo.categoryName}}</el-divider>
    </el-row>-->
    <div class="content-container">

      <el-select v-model="categoryId" placeholder="请选择">
        <el-option
          v-for="item in categoryData"
          :key="item.categoryId"
          :label="item.categoryName"
          :value="item.categoryId">
        </el-option>
      </el-select>
      <div class="right-container">
        <el-table
          :data="tableData"
          style="width: 100%;margin-bottom: 20px;"
          border>
          <el-table-column
            prop="articleId"
            label="文章Id"
            width="100">
          </el-table-column>
          <el-table-column
            label="文章分类"
            width="120">
            <template slot-scope="scope">
              {{scope.row.articleCategory&&scope.row.articleCategory.categoryName?scope.row.articleCategory.categoryName:"无"}}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="置顶"
            width="100">
            <template slot-scope="scope">
              <el-tag v-if="!scope.row.isTop" type="primary">正常</el-tag>
              <el-tag v-else type="danger">置顶</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="状态"
            width="100">
            <template slot-scope="scope">
              <el-tag v-if="!scope.row.isUse" type="danger">禁用</el-tag>
              <el-tag v-else type="primary">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            min-width="140"
            prop="title"
            label="标题">
          </el-table-column>
          <el-table-column
            fixed="right"
            width="150"
            label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit(scope.row)">查看</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {addArticle,updateArticle,deleteArticle,singleFind,articleList,articleCategoryList} from "../../api/articleManagement";
import qs from "qs";

export default {
  name: 'index',
  data() {
    return {
      keys:"",
      categoryId:"",
      search:"",
      // 文章列表数据
      tableData: [],
      categoryData: [],
      defaultProps: {
        children: 'children',
        label: 'categoryName'
      },
      // 分页配置
      pageSize:10,
      total:0
    }
  },
  watch: {
    categoryId(v){
      console.log(11111)
      if (v === "a"){
        let prm = {
          "pageNum": 1,
          "pageSize": this.pageSize
        };
        articleList(prm).then(res=>{
          this.tableData = res.data.result.list;
          this.total = res.data.result.total
        })
      }else {
        this.getArticleList(1,v);
      }
    }
  },
  async mounted() {
    this.getArticleList()
    this.getArticleCategoryList()
  },
  methods: {
    handleCurrentChange(v){
      this.getArticleList(v);
    },
    goToNewArticle(){
      this.$router.push({
        path:'/article/newArticle',
        query:{
          categoryId:this.categoryId
        }
      })
    },
    getArticleList(pageNum=1,cId=null){
      let prm = {
        "categoryId": cId,
        "pageNum": pageNum,
        "pageSize": this.pageSize
      };
      articleList(prm).then(res=>{
        this.tableData = res.data.result.list;
        this.total = res.data.result.total
      })
    },
    getArticleCategoryList(){
      let prm = {
        pageNum:1,
        pageSize:30
      };
      articleCategoryList(prm).then(res=>{
        this.categoryData = res.data.result.list;
        // this.categoryData.push({categoryId:"a",categoryName:"所有"})
        /*this.categoryId = this.categoryData[0].categoryId;
        this.getArticleList(1,this.categoryId);*/
      })
    },
    handleDelete(info){
      this.$confirm('此操作将永久删除该文章信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let prm = qs.stringify({
          aid: info.articleId
        });
        deleteArticle(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:"success",
              message:"删除成功"
            })
            this.getArticleList(1,this.categoryId)
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleEdit(info){
      this.$router.push({
        path:'/article/newArticle',
        query:{
          articleInfo:info
        }
      })
    },
    searchList(){
        let prm = {
          "categoryId": this.categoryId,
          "pageNum": 1,
          "pageSize": this.pageSize,
          title:this.keys
        };
        articleList(prm).then(res=>{
          this.tableData = res.data.result.list;
        })
    },
    resetList(){
      this.categoryId = null
      this.keys = ''
    }
  }
}
</script>
<style scoped lang="less">
  .top-btn{
    margin: 10px 0 20px 0;
  }
  .app-container{
    width: 100%;
    .search-container{
      width: 300px;
      margin: 15px 0;
    }
    .bigFont{
      .el-divider__text{

        font-size: 20px!important;
      }
    }
  }
  .content-container{
    width: 100%;
    .left-container{
      min-width: 250px;
      height: 200px;
      .self-width{
        width: 220px;
        margin-bottom: 20px;
      }
    }
    .right-container{
      width: 100%;
      flex: 1;
      margin-top: 20px;
    }
  }
</style>

