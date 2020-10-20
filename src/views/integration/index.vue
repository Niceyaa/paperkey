<template>
  <div class="app-container">
    <el-row class="user-top">
      <el-button :type="currentType==='in'?'primary':''"  @click="currentType = 'in'">入库记录</el-button>
      <el-button :type="currentType==='out'?'primary':''"  @click="currentType = 'out'">出库记录</el-button>
    </el-row>

    <el-row style="width: 400px;display: flex">
      <el-input v-model="goodsName" placeholder="/商品名"></el-input>
      <el-button style='margin: 0 0 15px 15px' type="success"  @click="searchList">搜索</el-button>
      <el-button style='margin: 0 0 15px 15px' type="warning"  @click="resetList">重置</el-button>
    </el-row>

    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="commodityName"
        label="商品名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="commodityInStorageCount"
        label="数量"
        width="120">
        <template slot-scope="scope">{{currentType==='in'?scope.row.commodityInStorageCount:scope.row.commodityOutStorageCount}}</template>
      </el-table-column>
      <el-table-column
        prop="inStorageUserName"
        label="操作员"
        width="120">
        <template slot-scope="scope">{{currentType==='in'?scope.row.inStorageUserName:scope.row.outStorageUserName}}</template>
      </el-table-column>
      <el-table-column
        prop="inStorageUserName"
        label="操作时间"
        min-width="120">
        <template slot-scope="scope">{{currentType==='in'?scope.row.inStorageTime:scope.row.outStorageTime}}</template>
      </el-table-column>
    </el-table>
    <el-row class="center-page">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage1"
        :page-size="pageSize"
        layout="prev, pager, next, total, jumper"
        :total="total">
      </el-pagination>
    </el-row>

  </div>
</template>

<script>
  import {getList,updateCategory,addCategory,deleteCategory,sortCategory} from "../../api/permissionClassify";
  import {goodsInWarehouseList,goodsOutWarehouseList} from "../../api/goods";

  export default {
    name: 'index',
    data() {
      return {
        currentType: 'in',
        tableData: [],
        goodsName: null,

        currentPage1:1,

        pageSize: 10,
        total:null
      };
    },
    watch:{
      currentType(v){
        this.goodsName = null
        this.getList()
      }
    },
    methods: {
      getList(v=1){
        if (this.currentType === 'in'){
          let prm = {
            "commodityName": this.goodsName,
            "pageNum": v,
            "pageSize": this.pageSize
          };
          goodsInWarehouseList(prm).then(res=>{
            this.tableData = res.data.result.list
            this.total = res.data.result.total
          })
        }else if (this.currentType === 'out'){
          let prm = {
            "commodityName": this.goodsName,
            "pageNum": v,
            "pageSize": this.pageSize
          };
          goodsOutWarehouseList(prm).then(res=>{
            this.tableData = res.data.result.list
            this.total = res.data.result.total
          })
        }
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      searchList(){
        this.getList()
      },
      resetList(){
        this.goodsName = null
        this.getList()
      }
    },
    mounted() {
      this.getList();
    }
  };
</script>
<style scoped lang="less">
  .user-top{
    margin: 10px 0 20px 0;
  }
</style>
