<template>
  <div class="app-container">
    <el-row class="top-btn">
      <el-button plain type="success" @click="addHandle">新增分类</el-button>
    </el-row>
    <el-row class="search-wrapper">
      <el-input style="margin-right: 15px" placeholder="/名称" v-model="searchInfo.name"></el-input>
      <el-input placeholder="/编码" v-model="searchInfo.code"></el-input>
      <el-button plain style="margin-left: 15px" @click="searchList" type="primary">搜索</el-button>
      <el-button plain type="warning" @click="resetList">重置</el-button>
    </el-row>
    <el-row style="height: 1px;background: #8c939d"></el-row>

    <!--addMenu-->
    <el-dialog :title="optTitle" :visible.sync="addFlag">
      <el-form :model="form">
        <!--<el-form-item v-if="!rootClassify" label="上级分类" :label-width="formLabelWidth">
          <el-input @focus="innerMenuList" v-model="form.lastClassify" autocomplete="off"></el-input>
        </el-form-item>-->
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" :label-width="formLabelWidth">
          <el-input v-model="form.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-radio v-model="form.isUse" :label="true">启用</el-radio>
          <el-radio v-model="form.isUse" :label="false">禁用</el-radio>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveHandle">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog class="inner-dialog" title="上级目录" :visible.sync="innerFlag">
      <el-tree
        class="filter-tree"
        node-key="menuId"
        :data="tableData"
        :props="defaultProps"
        default-expand-all
        highlight-current
        @node-click="handleNodeClick"
        ref="menuTree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerFlag = false">取 消</el-button>
        <el-button type="primary" @click="getLastMenu">确 定</el-button>
      </div>
    </el-dialog>


    <el-table
      class="menu-table"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="commodityClassifyId"
      :tree-props="{children: 'subMenus', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="commodityClassifyName"
        label="名称"
        width="200">
      </el-table-column>
      <el-table-column
        align="center"
        prop="commodityClassifyCode"
        label="编码"
        width="100">
      </el-table-column>
      <el-table-column
        align="center"
        prop="createUser"
        label="添加人"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        width="120"
        prop="createTime"
        label="添加时间">
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        prop="updateUser"
        label="修改人">
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        prop="updateTime"
        label="修改时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        min-width="270px"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="itemAdd(scope.row)" size="mini" type="success" icon="el-icon-circle-plus-outline" plain>添加</el-button>
          <el-button @click="itemEdit(scope.row)" size="mini" type="primary" icon="el-icon-edit" plain>编辑</el-button>
          <el-button @click="itemDelete(scope.row)" size="mini" type="danger" icon="el-icon-delete" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row class="center-page">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, total, jumper"
        :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>

import qs from 'qs'
import {goodsClassifyAdd,goodsClassifyDelete,goodsClassifyEdit,goodsClassifyList,goodsClassifyTreeList} from "../../api/goods";

export default {
  name: 'index',
  data() {
    return {
      searchInfo:{name:null,code:null,lastClassifyId:null},
      rootClassify: false,

      currentOptInfo:null,

      form:{
        name:null,
        code:null,
        isUse:true,
        lastClassify:null
      },
      addFlag: false,
      tableData: [],
      optTitle: null,
      formLabelWidth: '120px',
      innerFlag: false,

      //上级目录
      filterText: '',
      defaultProps: {
        children: 'subMenus',
        label: 'name'
      },

      pageSize:10,
      total:null,
      currentPage:1
    }
  },
  methods: {
    handleNodeClick(){},
    getList(i=1){
      let prm = {
        /*"commodityClassifyCode": this.searchInfo.code,
        "commodityClassifyName": this.searchInfo.name,
        "commodityClassifySuperId": this.searchInfo.lastClassifyId,*/
        "pageNum": i,
        "pageSize": this.pageSize
      };
      goodsClassifyTreeList(prm).then(res=>{
        this.tableData = res.data.result.list;
        this.total = res.data.result.total;
      })
    },

    handleCurrentChange(v){
      let prm = {
        "commodityClassifyCode": this.searchInfo.code,
        "commodityClassifyName": this.searchInfo.name,
        "commodityClassifySuperId": this.searchInfo.lastClassifyId,
        "pageNum": v,
        "pageSize": this.pageSize
      };
      goodsClassifyList(prm).then(res=>{
        this.tableData = res.data.result.list;
        this.total = res.data.result.total;
      })
    },
    resetList(){
      this.searchInfo.name = null
      this.searchInfo.code = null
      this.getList();
    },
    searchList(){
      let prm = {
        "commodityClassifyCode": this.searchInfo.code,
        "commodityClassifyName": this.searchInfo.name,
        "commodityClassifySuperId": this.searchInfo.lastClassifyId,
        "pageNum": 1,
        "pageSize": this.pageSize
      };
      goodsClassifyList(prm).then(res=>{
        this.tableData = res.data.result.list;
        this.total = res.data.result.total;
      })
    },

    itemAdd(info){
      this.rootClassify = false;
      this.currentOptInfo = info;

      this.form.name = null;
      this.form.code = null;
      this.form.isUse = true;

      this.optTitle = "添加分类"
      this.addFlag = true;
    },
    itemEdit(info){
      this.rootClassify = false;
      this.currentOptInfo = info;

      this.form.name = info.commodityClassifyName;
      this.form.code = info.commodityClassifyCode;
      this.form.isUse = info.isUse;

      this.optTitle = "修改信息"
      this.addFlag = true;
    },
    itemDelete(info){

      this.$confirm('此操作将永久删除该商品分类信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let prm = qs.stringify({
          commodityClassifyId:info.commodityClassifyId
        })
        goodsClassifyDelete(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:"success",
              message:"刪除成功"
            })
            this.getList();
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


      console.log(info)
    },

    addHandle(){
      this.rootClassify = true;
      this.currentOptInfo = null


      this.form.name = null;
      this.form.code = null;
      this.form.isUse = true;

      this.optTitle = "添加分类"
      this.addFlag = true;
    },

    getLastMenu(){
      this.innerFlag = false;
      this.form.lastMenu = this.currentOptInfo.name
    },

    saveHandle(){
      if (this.optTitle === "添加分类"){
        let prm = {
          "commodityClassifyCode": this.form.code,
          "commodityClassifyName": this.form.name,
          "commodityClassifySuperId": !this.currentOptInfo?0:this.currentOptInfo.commodityClassifyId,
          "isUse": this.form.isUse
        };
        goodsClassifyAdd(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:"success",
              message:"添加成功"
            })
            this.getList()
          }
        })
      }else if (this.optTitle === "修改信息"){
        let prm = {
          "commodityClassifyCode": this.form.code,
          "commodityClassifyId": this.currentOptInfo.commodityClassifyId,
          "commodityClassifyName": this.form.name,
          "isUse": this.form.isUse
        };
        goodsClassifyEdit(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:"success",
              message:"修改成功"
            })
            this.getList()
          }
        })
      }

      this.addFlag = false;
    },
    innerMenuList(){
      this.innerFlag = true
    },
  },
  mounted() {
    this.getList()
  }
}
</script>
<style scoped lang="less">
  .app-container{
    .search-wrapper{
      width: 500px;
      margin: 20px 0;
      display: flex;
    }
    .top-btn{
      margin: 10px 0 20px 0;
    }
    /*.el-table .el-table__header-wrapper .el-table__header*/
    .has-gutter{

      tr{
        th{
          background-color: lightgray!important;
        }
      }
    }
    .inner-dialog{
      -width:5%;
    }
  }
</style>
