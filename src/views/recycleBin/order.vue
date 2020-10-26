<template>
  <div class="app-container">
   <!-- <el-row class="user-top">
      <el-button type="primary" plain @click="addOpen">添加订单</el-button>
    </el-row>-->

    <!-- <el-row>
       <div @click="openStartCalendar" class="open-calendar">{{startTime}}</div>
       <el-calendar class="start-date" v-if="startTimeFlag" v-model="startTime">
       </el-calendar>
     </el-row>-->
    <!--<el-row>
      <el-input clearable class="search-container" v-model="searchInfo.name" placeholder="/名称"></el-input>
      <el-button style="margin-left: 10px" plain type="primary" @click="searchList">搜索</el-button>
      <el-button plain type="warning" @click="resetList">重置</el-button>
    </el-row>-->
    <el-row class="search-container">

      <el-row class="process-wrapper">
        <el-select v-model="currentRecycle" placeholder="请选择回收站">
          <el-option
            v-for="item in recycles"
            :key="item.recyclerId"
            :label="item.name"
            :value="item.recyclerId">
          </el-option>
        </el-select>
      </el-row>
      <el-row class="process-wrapper">
      <el-select v-model="currentAgent" placeholder="请选择代理商">
        <el-option
          v-for="item in agents"
          :key="item.agentId"
          :label="item.name"
          :value="item.agentId">
        </el-option>
      </el-select>
    </el-row>
     <!-- <el-row class="process-wrapper">
        <el-select v-model="currentCity" placeholder="请选择城市">
          <el-option
            v-for="item in citys"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-row>-->
      <el-row class="process-wrapper">
        <el-select v-model="currentProcess" placeholder="请选择回收过程">
          <el-option
            v-for="item in process"
            :key="item.retrieveProcessId"
            :label="item.name"
            :value="item.retrieveProcessId">
          </el-option>
        </el-select>

      </el-row>
      <el-row class="btn-wrapper">
        <el-button style="margin-left: 10px" type="success" plain @click="searchList">搜索</el-button>
<!--        <el-button style="margin-left: 10px" type="success" plain @click="resetList">重置</el-button>-->
        <el-button style="margin-left: 10px" type="success" plain @click="showAll">查看所有</el-button>
      </el-row>
    </el-row>





   <!-- <el-dialog title="添加压缩" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="压缩类型" :label-width="formLabelWidth">
          <el-select v-model="form.compressType" placeholder="请选择压缩类型">
            <el-option v-for="item in compressTypes" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作人" :label-width="formLabelWidth">
          <el-select v-model="form.optUserId" placeholder="请选择操作人">
            <el-option v-for="item in optUsers" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveHandle">确 定</el-button>
      </div>
    </el-dialog>-->
    <el-row style="height: 1px;background: #8c939d"></el-row>
    <el-table
      :data="tableData"
      type="expand"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="订单号">
              <span>{{scope.row.orderId }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span>{{ scope.row.address }}</span>
            </el-form-item>
           <!-- <el-form-item label="代理商">
              <span>{{ scope.row.agent&&scope.row.agent.name?scope.row.agent.name:"无" }}</span>
            </el-form-item>
            <el-form-item label="城市">
              <span>{{ scope.row.city&&scope.row.city.name?scope.row.city.name:"无" }}</span>
            </el-form-item>-->
            <el-form-item label="收入价格">
              <span>{{ scope.row.incomePrice }}</span>
            </el-form-item>
            <el-form-item label="回收积分">
              <span>{{ scope.row.integral }}</span>
            </el-form-item>
            <el-form-item label="需支付金额">
              <span>{{ scope.row.payPrice }}</span>
            </el-form-item>
            <el-form-item label="联系电话">
              <span>{{ scope.row.phone }}</span>
            </el-form-item>
            <el-form-item label="预约上门时间">
              <span>{{ scope.row.predictComeTime }}</span>
            </el-form-item>
            <el-form-item label="预估收入价格">
              <span>{{ scope.row.predictIncomePrice }}</span>
            </el-form-item>
            <el-form-item label="预估支付金额">
              <span>{{ scope.row.predictPayPrice }}</span>
            </el-form-item>
            <el-form-item label="预估重量">
              <span>{{ scope.row.predictWeight }}</span>
            </el-form-item>
            <el-form-item label="单位名称">
              <span>{{ scope.row.unitName }}</span>
            </el-form-item>
            <el-form-item label="回收过程">
              <span>{{ scope.row.confRetrieveProcess&&scope.row.confRetrieveProcess.name?scope.row.confRetrieveProcess.name:"无" }}</span>
            </el-form-item>
            <el-form-item label="回收站">
              <span>{{ scope.row.recycler&&scope.row.recycler.name?scope.row.recycler.name:"无" }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ scope.row.remark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderId"
        label="订单号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        width="100">
      </el-table-column>
      <el-table-column
        label="代理商"
        width="80">
        <template slot-scope="scope">{{ scope.row.agent&&scope.row.agent.name?scope.row.agent.name:"无" }}</template>
      </el-table-column>
<!--
      <el-table-column
        prop="incomePrice"
        label="收入价格"
        width="90">
      </el-table-column>
      <el-table-column
        prop="integral"
        label="积分"
        width="60">
      </el-table-column>-->
      <el-table-column
        prop="phone"
        label="电话"
        width="120">
    </el-table-column>
      <el-table-column
        label="订单状态"
        width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.orderState === 0">下单</el-tag>
          <el-tag v-if="scope.row.orderState === 1" type="warning">已派单</el-tag>
          <el-tag v-if="scope.row.orderState === 2" type="warning">已接单</el-tag>
          <el-tag v-if="scope.row.orderState === 3" type="warning">已收件</el-tag>
          <el-tag v-if="scope.row.orderState === 4" type="warning">已入库</el-tag>
          <el-tag v-if="scope.row.orderState === 5" type="warning">已碎纸</el-tag>
          <el-tag v-if="scope.row.orderState === 100" type="danger">订单取消</el-tag>
          <el-tag v-if="scope.row.orderState === 200" type="success">订单完成</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column
        label="压缩状态"
        width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.orderState" type="success">完成</el-tag>
          <el-tag v-else type="warning">处理中</el-tag>
        </template>
      </el-table-column>-->

      <el-table-column
        fixed="right"
        label="操作"
        min-width="400">
        <template slot-scope="scope">
          <el-button v-if="scope.row.orderState<3" plain type="danger" size="mini" @click="deleteOrder(scope.row)">取消订单</el-button>
          <el-button v-if="scope.row.orderState===1" plain type="success" size="mini" @click="receiveOrder(scope.row)">接单</el-button>
          <el-button v-if="scope.row.orderState===3||scope.row.orderState===2" plain type="success" size="mini" @click="goToBag(scope.row)">包裹管理</el-button>
          <el-button v-if="scope.row.orderState<3"  plain type="primary" size="mini" @click="goToPostpone(scope.row)">延期管理</el-button>
<!--          <el-button plain type="primary" size="mini" @click="goToPostpone(scope.row)">轨迹查询</el-button>-->
          <el-button v-if="scope.row.orderState===0||scope.row.orderState===1" plain type="warning" size="mini" @click="goToSendOrder(scope.row)">派单管理</el-button>
          <el-button v-if="scope.row.orderState>=3||scope.row.orderState===100" plain type="warning" size="mini" @click="goToOrderTrail(scope.row)">运输轨迹</el-button>
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
  import qs from "qs"
  import {orderAdd,orderDelete,orderList,orderDetail,orderReceive} from '../../api/recycleManagement';
  import {agentList} from "../../api/angenManagement";
  import {recycleProcessList} from "../../api/recycleManagement";
  import {recycleList} from "../../api/recycleManagement";
  import {cityTreeList} from "../../api/cityManagement";

  export default {
    name: 'limit',
    data() {
      return {
        currentAgent:null,
        agents:[],

        currentCity:null,
        citys:[],

        currentProcess:null,
        process:[],

        currentRecycle:null,
        recycles:[],

        searchInfo:{name:null},
        formLabelWidth: '120px',
        addFlag: false,
        tableData: [],
        // 分页配置
        pageSize: 10,
        total:0,
        currentPage:1
      };
    },
    watch:{},
    methods: {
      goToBag(info){
        this.$router.push({
          path:'/recycle/bag',
          query:{
            orderID:info.orderId,
            orderStatus:info.orderState
          }
        })
      },
      goToPostpone(info){
        this.$router.push({
          path:'/recycle/postpone',
          query:{
            orderID:info.orderId,
            orderStatus:info.orderState,
            postponeId:info.sysUser.sysUserId
          }
        })
      },
      goToSendOrder(info){
        this.$router.push({
          path:'/recycle/sendOrder',
          query:{
            orderID:info.orderId,
            orderStatus:info.orderState
          }
        })
      },
      goToOrderTrail(info){
        this.$router.push({
          path:'/recycle/orderTrail',
          query:{
            orderID:info.orderId,
          }
        })
      },
      getAgentList(){
        let prm = {
          pageNum:1,
          pageSize:20
        }
        agentList(prm).then(res=>{
          this.agents = res.data.result.list
        })
      },

      getProcessList(){
        let prm = {
          pageNum:1,
          pageSize:20
        }
        recycleProcessList(prm).then(res=>{
          this.process = res.data.result.list
        })
      },

      getRecycleList(){
        let prm = {
          pageNum:1,
          pageSize:20
        }
        recycleList(prm).then(res=>{
          this.recycles = res.data.result.list
        })
      },

      formatDate(date){
        let tt = new Date(date);
        let y = tt.getFullYear();
        let mon = tt.getMonth()+1;
        let d = tt.getDate();
        return `${y}-${mon}-${d}`
      },
      getList(v=1){
        let prm = {
          "pageNum": v,
          "pageSize": this.pageSize,
        }
        orderList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      addOpen(){
        this.addFlag = true;
        this.form.compressType= null
      },
      editOpen(info){
        console.log(info)
        this.addFlag = true;
        this.form.compressType = info.compressType
      },
      saveHandle(){
        let prm = {
          operateUser: this.form.optUserId,
          compressType: this.form.compressType,
        }

        paperZipAdd(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:"success",
              message: "添加成功"
            })
            this.$router.push({
              path:'/lcgComponent/compressComponent',
              query:{
                compressInfo:res.data.result
              }
            })
            // this.getList();
            this.addFlag = false
          }else{
            this.$message({
              type:"error",
              message:res.data.msg
            })
          }
        })

      },
      deleteOrder(info){
        this.$confirm('此操作将永久从列表中取消该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let prm = qs.stringify({
            orderId: info.orderId
          });
          orderDelete(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"取消成功"
              })
              this.getList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        });
      },
      receiveOrder(info){
        this.$confirm('确认接单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let prm = qs.stringify({
            orderId: info.orderId
          });
          orderReceive(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"接单成功"
              })
              this.getList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        });
      },
      searchList(){
        let prm = {
          "pageNum": 1,
          "pageSize": this.pageSize,
          "retrieveProcessId": this.currentProcess,
          agentId:this.currentAgent,
          recyclerId:this.currentRecycle
        }
        orderList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      resetList(){
        // this.searchInfo.name = null;
        this.currentAgent = null
        this.currentProcess = null
        this.currentRecycle = null
        this.getList()
      },
      showAll(){
        this.currentAgent = null
        this.currentProcess = null
        this.currentRecycle = null
        this.getList()
      },

    },
    mounted() {
      this.getList();
      this.getAgentList();
      this.getProcessList();
      this.getRecycleList();
    }
  };
</script>
<style scoped lang="less">
  .user-top{
    margin: 10px 0 20px 0;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 130px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .open-calendar{
    width: 160px;
    height: 30px;
    border: 1px solid lightgray;
    border-radius: 20px;
    text-align: center;
    line-height: 30px;
    cursor:pointer;
    font-size: 14px;
    color: #8c939d;
  }
  /deep/ .start-date{
    width: 320px;
    .el-calendar__header{
      padding: 0!important;
    }
    .el-calendar-table thead th{
      padding: 3px 0;
    }
    .el-calendar-table td.is-selected{
      color: blue;
      font-weight: bold;
    }
    .el-calendar-table .el-calendar-day{
      padding: 0!important;
      height: 40px;
      text-align: center;
      line-height: 40px;
    }
  }
  .search-container{
    display: flex;
    min-width: 860px;
    .process-wrapper{
      width: 146px;
      margin: 0 10px 15px 0;
    }
  }
</style>
