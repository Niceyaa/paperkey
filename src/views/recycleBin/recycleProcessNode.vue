<template>
  <div class="app-container">
    <el-row class="user-top">
      <el-button type="primary" plain @click="addOpen">添加节点</el-button>
    </el-row>

    <el-row>
      <el-input clearable class="search-container" v-model="searchInfo.name" placeholder="/名称"></el-input>
      <el-input clearable class="search-container" v-model="searchInfo.code" placeholder="/编码"></el-input>
      <el-button style="margin-left: 10px" plain type="primary" @click="searchList">搜索</el-button>
      <el-button plain type="warning" @click="resetList">重置</el-button>
    </el-row>

    <el-row class="process-wrapper">
      <el-select v-model="retrieveProcessId" placeholder="请选择回收过程">
        <el-option
          v-for="item in processList"
          :key="item.retrieveProcessId"
          :label="item.name"
          :value="item.retrieveProcessId">
        </el-option>
      </el-select>
      <el-button style="margin-left: 10px" type="success" plain @click="showAll">查看所有</el-button>
    </el-row>


    <el-dialog :title="diaTitle" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" :label-width="formLabelWidth">
          <el-input v-model="form.code" autocomplete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="展示" :label-width="formLabelWidth">
          <el-radio v-model="form.show" :label="true">展示</el-radio>
          <el-radio v-model="form.show" :label="false">隐藏</el-radio>
        </el-form-item>-->
        <!--<el-form-item label="显示名称" :label-width="formLabelWidth">
          <el-input v-model="form.showName" autocomplete="off"></el-input>
        </el-form-item>-->
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
        prop="nodeName"
        label="名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="nodeCode"
        label="编码"
        width="160">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="220">
        <template slot-scope="scope">
          <el-button @click="editOpen(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteHandle(scope.row)" type="danger" size="small">删除</el-button>
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
    processNodeAdd,
    processNodeDelete,
    processNodeUpdate,
    processNodeList,
    recycleProcessList
  } from "../../api/recycleManagement";

  export default {
    name: 'limit',
    data() {
      return {
        processList:[],
        nodeId:null,
        processData:[],
        retrieveProcessId:null,
        goodsTypes:[{id:0,name:"aaa"},{id:1,name:"bbb"},{id:2,name:"ccc"}],
        processId:null,
        searchInfo:{name:null,code:null},
        form: {
          name:'',
          code:null,
          show:null,
          showName:null
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
    watch:{
      retrieveProcessId(val){
        this.processId = val;
          let prm = {
          "pageNum": 1,
          "pageSize": this.pageSize,
          "retrieveProcessId": val,
        }
        processNodeList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      }
    },
    methods: {
      getProcessList(){
        let prm = {
          "pageNum": 1,
          "pageSize": 30,
        }
        recycleProcessList(prm).then(res=>{
          this.processList = res.data.result.list
        })
      },
      getList(v=1){
        let prm = {
          "pageNum": v,
          "pageSize": this.pageSize,
          "retrieveProcessId": this.processId,
        }
        processNodeList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      addOpen(){
        this.addFlag = true;
        this.diaTitle = "添加节点";
        this.form.name = null
        this.form.code = null
        this.form.showName = null
        this.form.show = null
      },
      editOpen(info){
        console.log(info)
        this.addFlag = true;
        this.diaTitle = "修改节点"
        this.form.name = info.nodeName
        this.form.code = info.nodeCode
        this.nodeId = info.retrieveProcessNodeId;
      },
      saveHandle(){
        if (this.diaTitle === "添加节点"){
          let prm = {
            "isShow": this.form.show,
            "nodeCode": this.form.code,
            "nodeName": this.form.name,
            "retrieveProcessId": this.processId,
            "showName": this.form.showName
          }

          processNodeAdd(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message: "添加成功"
              })
              this.getList();
              this.addFlag = false
            }else{
              this.$message({
                type:"error",
                message:res.data.msg
              })
            }
          })
        }else if(this.diaTitle === "修改节点"){
          let prm = {
            nodeCode: this.form.code,
            "nodeName": this.form.name,
            "retrieveProcessNodeId": this.nodeId,
          }
          processNodeUpdate(prm).then(res=>{
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
        this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let prm = {
            confPaperNodeIds: [info.retrieveProcessNodeId]
          };
          processNodeDelete(prm).then(res=>{
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
          nodeName: this.searchInfo.name,
          nodeCode:this.searchInfo.code,
          "retrieveProcessId": this.processId,
        }
        processNodeList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      resetList(){
        this.searchInfo.name = null;
        this.searchInfo.code = null;
        this.getList()
      },
      showAll(){
        this.retrieveProcessId = null
        let prm = {
          "pageNum":1,
          "pageSize": this.pageSize
        }
        processNodeList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      }

    },
    mounted() {
      if (this.$route.query.processId){
        this.processId = this.$route.query.processId
      }
      this.getList();
      this.getProcessList();
    }
  };
</script>
<style scoped lang="less">
  .user-top{
    margin: 10px 0 20px 0;
  }
  .search-container{
    width: 226px;
    margin: 15px 0;
  }
  .process-wrapper{
    margin: 0 0 15px 0;
  }
</style>
