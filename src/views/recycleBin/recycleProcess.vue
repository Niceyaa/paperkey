<template>
  <div class="app-container">
    <el-row class="user-top">
      <el-button type="primary" plain @click="addOpen">添加路程</el-button>
    </el-row>

    <el-row>
      <el-input clearable class="search-container" v-model="searchInfo.name" placeholder="/名称"></el-input>
      <el-button plain type="primary" @click="searchList">搜索</el-button>
      <el-button plain type="warning" @click="resetList">重置</el-button>
    </el-row>


    <el-dialog :title="diaTitle" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择商品类型">
            <el-option v-for="item in goodsTypes" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveHandle">确 定</el-button>
      </div>
    </el-dialog>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="goodsType"
        label="编码"
        width="160">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="400">
        <template slot-scope="scope">
          <el-button @click="editOpen(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteHandle(scope.row)" type="danger" size="small">删除</el-button>
          <el-button plain size="mini" type="success" @click="goToPrice(scope.row)">价格管理</el-button>
          <el-button plain size="mini" type="success" @click="goToWeight(scope.row)">重量管理</el-button>
          <el-button plain size="mini" type="success" @click="goToNode(scope.row)">节点管理</el-button>
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
  import {
    recycleProcessAdd,
    recycleProcessDelete,
    recycleProcessList,
    recycleProcessUpdate
  } from "../../api/recycleManagement";

  export default {
    name: 'limit',
    data() {
      return {
        goodsTypes:[{id:0,name:"aaa"},{id:1,name:"bbb"},{id:2,name:"ccc"}],
        processId:null,
        searchInfo:{name:null},
        form: {
          name:'',
          type:null
        },
        formLabelWidth: '120px',
        diaTitle: '',
        addFlag: false,
        tableData: [],
        // 分页配置
        pageSize: 15,
        total:0,
        currentPage:1
      };
    },
    methods: {
      getList(v=1){
        let prm = {
          "pageNum": v,
          "pageSize": this.pageSize,
        }
        recycleProcessList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
          console.log(res)
        })
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      addOpen(){
        this.addFlag = true;
        this.diaTitle = "添加路程";
        this.form.name = null
        this.form.type = null
      },
      editOpen(info){
        console.log(info)
        this.addFlag = true;
        this.diaTitle = "修改路程"
        this.form.name = info.name
        this.form.type = info.goodsType
        this.processId = info.retrieveProcessId;
      },
      saveHandle(){
        if (this.diaTitle === "添加路程"){
          let prm = {
            "name": this.form.name,
            goodsType: this.form.type
          }

          recycleProcessAdd(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message: "添加成功"
              })
              this.getList();
              this.addFlag = false
            }
          })
        }else if(this.diaTitle === "修改路程"){
          let prm = {
            retrieveProcessId: this.processId,
            "name": this.form.name,
            goodsType: this.form.type
          }
          recycleProcessUpdate(prm).then(res=>{
            this.$message({
              type:"success",
              message: "修改成功"
            })
            this.getList();
            this.addFlag = false
            console.log(res)
          })
        }
      },
      deleteHandle(info){
        console.log(info)
        this.$confirm('此操作将永久删除该路程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let prm = {
            ids: [info.retrieveProcessId]
          };
          recycleProcessDelete(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"删除成功"
              })
              this.getList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      searchList(){
        let prm = {
          "pageNum": 1,
          "pageSize": this.pageSize,
          name: this.searchInfo.name
        }
        recycleProcessList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      resetList(){
        this.searchInfo.name = null;
        this.getList()
      },
      goToNode(info){
        this.$router.push({
          path:"/recycle/recycleProcessNode",
          query:{
            processId:info.retrieveProcessId
          }
        })
      },
      goToPrice(info){
        this.$router.push({
          path:"/recycle/recyclePrice",
          query:{
            processId:info.retrieveProcessId
          }
        })
      },
      goToWeight(info){
        this.$router.push({
          path:"/recycle/recycleWeight",
          query:{
            processId:info.retrieveProcessId
          }
        })
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
  .search-container{
    width: 300px;
    margin: 15px 0;
  }
</style>
