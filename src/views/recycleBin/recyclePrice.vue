<template>
  <div class="app-container">
    <el-row class="user-top">
      <el-button type="primary" plain @click="addOpen">添加价格参数</el-button>
    </el-row>

    <!--<el-row>
      <el-input clearable class="search-container" v-model="searchInfo.name" placeholder="/名称"></el-input>
      <el-button style="margin-left: 10px" plain type="primary" @click="searchList">搜索</el-button>
      <el-button plain type="warning" @click="resetList">重置</el-button>
    </el-row>-->

    <el-row class="process-wrapper">
      <el-select v-model="retrieveProcessId" placeholder="请选择路程名称">
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
        <el-form-item label="代理商" :label-width="formLabelWidth">
          <el-select v-model="form.agentId" placeholder="请选择代理商">
            <el-option v-for="item in agents" :label="item.name" :value="item.agentId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始距离" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.distanceBegin" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="结束距离" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.distanceEnd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收入价格" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.incomePrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="需支付价格" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.payPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="积分" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.integral" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位名称" :label-width="formLabelWidth">
          <el-input v-model="form.unitName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="回收站" :label-width="formLabelWidth">
          <el-select v-model="form.recyclerId" placeholder="请选择回收站">
            <el-option v-for="item in recycles" :label="item.name" :value="item.recyclerId"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="启用" :label-width="formLabelWidth">
          <el-radio v-model="form.isUse" :label="0">启用</el-radio>
          <el-radio v-model="form.isUse" :label="1">禁用</el-radio>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveHandle">确 定</el-button>
      </div>
    </el-dialog>
    <el-row style="height: 1px;background: #8c939d"></el-row>
    <el-table
      :data="tableData"
      type="expand"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
           <!-- <el-form-item label="代理商id">
              <span>{{ scope.row.agentId }}</span>
            </el-form-item>-->
            <el-form-item label="创建时间">
              <span>{{ scope.row.createTime }}</span>
            </el-form-item>
            <el-form-item label="创建人">
              <span>{{ scope.row.createUser }}</span>
            </el-form-item>
            <el-form-item label="起始距离">
              <span>{{ scope.row.distanceBegin }}</span>
            </el-form-item>
            <el-form-item label="结束距离">
              <span>{{ scope.row.distanceEnd }}</span>
            </el-form-item>
            <el-form-item label="用户收入价格">
              <span>{{ scope.row.incomePrice }}</span>
            </el-form-item>
            <el-form-item label="回收积分">
              <span>{{ scope.row.integral }}</span>
            </el-form-item>
            <el-form-item label="回收过程名称">
              <span>{{ scope.row.name }}</span>
            </el-form-item>
            <el-form-item label="回收积分">
              <span>{{ scope.row.integral }}</span>
            </el-form-item>
            <el-form-item label="需支付价格">
              <span>{{ scope.row.payPrice }}</span>
            </el-form-item>
            <!--<el-form-item label="回收站Id">
              <span>{{ scope.row.recyclerId }}</span>
            </el-form-item>-->
            <el-form-item label="单位名称">
              <span>{{ scope.row.unitName }}</span>
            </el-form-item>
            <el-form-item label="更新时间">
              <span>{{ scope.row.updateTime }}</span>
            </el-form-item>
            <el-form-item label="更新人">
              <span>{{ scope.row.updateUser }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="retrievePriceId"
        label="id"
        width="120">
      </el-table-column>
      <el-table-column
        prop="payPrice"
        label="需支付价格"
        width="140">
      </el-table-column>
      <el-table-column
        prop="incomePrice"
        label="收入价格"
        width="140">
      </el-table-column>
      <el-table-column
        prop="integral"
        label="回收积分"
        width="120">
      </el-table-column>
      <el-table-column
        prop="unitName"
        label="单位名称"
        width="140">
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
  import {recycleList} from "../../api/recycleManagement";
  import qs from "qs"
  import {
    recyclePriceAdd,
    recyclePriceDelete,
    recyclePriceList,
    recyclePriceUpdate,
    recycleProcessList
  } from "../../api/recycleManagement";
  import {agentList} from "../../api/angenManagement";

  export default {
    name: 'limit',
    data() {
      return {
        recycles:null,
        processPriceId:null,
        agents:[],
        processList:[],
        processData:[],
        retrieveProcessId:null,
        processId:null,
        searchInfo:{name:null},
        form: {
          agentId:null,
          distanceBegin:null,
          distanceEnd:null,
          incomePrice:null,
          integral:null,
          payPrice:null,
          unitName:null,
          isUse:null,
          recyclerId:null
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
        console.log(this.processId)
        let prm = {
          "currentPage": 1,
          "pageSize": this.pageSize,
          name:null,
          "retrieveProcessId": val,
        }
        recyclePriceList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      }
    },
    methods: {
      getRecycleList(){
        let prm = {
          currentPage:1,
          pageSize:20,
        }
        recycleList(prm).then(res=>{
          this.recycles = res.data.result.list
        })
      },
      getAgentList(){
        let prm = {
          currentPage:1,
          pageSize:20
        };
        agentList(prm).then(res=>{
          let {result} = res.data;
          this.agents = result.list;
        })
      },
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
          "currentPage": v,
          "pageSize": this.pageSize,
          "retrieveProcessId": this.processId,
          name:null
        }
        recyclePriceList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      addOpen(){
        this.addFlag = true;
        this.diaTitle = "添加价格参数";
        this.form.agentId = null
        this.form.distanceBegin = null
        this.form.distanceEnd = null
        this.form.incomePrice = null
        this.form.integral = null
        this.form.payPrice = null
        this.form.unitName = null
        this.form.isUse = null
        this.form.recyclerId = null
        this.getRecycleList()
        this.getAgentList()
      },
      editOpen(info){
        console.log(info)
        this.addFlag = true;
        this.diaTitle = "修改价格参数"
        this.form.agentId = info.agentId
        this.form.distanceBegin = info.distanceBegin
        this.form.distanceEnd = info.distanceEnd
        this.form.incomePrice = info.incomePrice
        this.form.integral = info.integral
        this.form.payPrice = info.payPrice
        this.form.unitName = info.unitName
        this.form.recyclerId = info.recyclerId
        this.processPriceId = info.retrievePriceId
        this.form.isUse = info.isUse
        this.processId = info.retrieveProcessNodeId;
      },
      saveHandle(){
        if (this.diaTitle === "添加价格参数"){
          let prm = {
            "agentId": parseInt(this.form.agentId),
            "distanceBegin": parseInt(this.form.distanceBegin),
            "distanceEnd": parseInt(this.form.distanceEnd),
            "incomePrice": parseInt(this.form.incomePrice),
            "integral": parseInt(this.form.integral),
            "isUse": this.form.isUse,
            "payPrice": parseInt(this.form.payPrice),
            "recyclerId": this.form.recyclerId,
            "retrievePriceId": null,
            "retrieveProcessId": this.processId,
            "unitName": this.form.unitName
          }

          recyclePriceAdd(prm).then(res=>{
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
        }else if(this.diaTitle === "修改价格参数"){
          let prm = {
            "agentId": parseInt(this.form.agentId),
            "distanceBegin": parseInt(this.form.distanceBegin),
            "distanceEnd": parseInt(this.form.distanceEnd),
            "incomePrice": parseInt(this.form.incomePrice),
            "integral": parseInt(this.form.integral),
            "isUse": this.form.isUse,
            "payPrice": parseInt(this.form.payPrice),
            "recyclerId": this.form.recyclerId,
            "retrievePriceId": this.processPriceId,
            "retrieveProcessId": this.processId,
            "unitName": this.form.unitName
          }
          recyclePriceUpdate(prm).then(res=>{
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

          let prm = qs.stringify({
            retrievePriceId: info.retrievePriceId
          });
          recyclePriceDelete(prm).then(res=>{
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
          "currentPage": 1,
          "pageSize": this.pageSize,
          name:this.searchInfo.name,
          "retrieveProcessId": this.processId,
        }
        recyclePriceList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      resetList(){
        this.searchInfo.name = null;
        this.getList()
      },
      showAll(){
        this.retrieveProcessId = null
        let prm = {
          "currentPage":1,
          "pageSize": this.pageSize,
          name:null,
          retrieveProcessId:null
        }
        recyclePriceList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      }

    },
    mounted() {
      if (this.$route.query.processId){
        this.processId = parseInt(this.$route.query.processId)
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
