<template>
  <div class="app-container">
    <el-row class="user-top">
      <el-button type="primary" plain @click="addOpen">添加出库信息</el-button>
    </el-row>

    <el-row>
      <el-input clearable class="search-container" v-model="searchInfo.carFollowingUser" placeholder="/跟车人"></el-input>
      <el-input clearable class="search-container" v-model="searchInfo.driver" placeholder="/驾驶员"></el-input>
      <el-input clearable class="search-container" v-model="searchInfo.carNumber" placeholder="/车牌号"></el-input>
      <el-input clearable class="search-container" v-model="searchInfo.driverTel" placeholder="/驾驶员电话"></el-input>
      <el-input clearable class="search-container" v-model="searchInfo.paperMillName" placeholder="/纸厂名称"></el-input>
      <!--<el-row style="margin-bottom: 15px">
        <el-date-picker
          v-model="searchInfo.startTime"
          type="datetime"
          placeholder="选择start时间"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-date-picker
          v-model="searchInfo.endTime"
          type="datetime"
          placeholder="选择end时间"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>-->
        <el-button style="margin: 0 0 15px 10px" plain type="primary" @click="searchList">搜索</el-button>
        <el-button style="margin: 0 0 15px 10px" plain type="warning" @click="resetList">重置</el-button>
     <!-- </el-row>-->

    </el-row>

    <el-dialog title="添加出库信息" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="跟车人" :label-width="formLabelWidth">
          <el-input v-model="form.carFollowingUser" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="跟车车牌号" :label-width="formLabelWidth">
          <el-input v-model="form.carNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="驾驶员" :label-width="formLabelWidth">
          <el-input v-model="form.driver" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="驾驶员电话" :label-width="formLabelWidth">
          <el-input v-model="form.driverTel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="运费" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.freightCharges" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="装车时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.putInCarTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="纸厂名称" :label-width="formLabelWidth">
          <el-select v-model="form.paperStoreName" placeholder="请选择纸厂">
            <el-option v-for="item in stores" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveHandle">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="录入结算信息" :visible.sync="balanceFlag">
      <el-form :model="balanceForm">
        <el-form-item label="回收价格" :label-width="formLabelWidth">
          <el-input v-model="balanceForm.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="回收重量" :label-width="formLabelWidth">
          <el-input v-model="balanceForm.weight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="结算方式" :label-width="formLabelWidth">
          <el-radio v-model="balanceForm.balanceType" :label="1">实时结算</el-radio>
          <el-radio v-model="balanceForm.balanceType" :label="2">延期结算</el-radio>
        </el-form-item>
        <el-form-item label="回收时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="balanceForm.time"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="balanceFlag = false">取 消</el-button>
        <el-button type="primary" @click="addBalanceInfo">确 定</el-button>
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
            <el-form-item label="跟车人">
              <span>{{ scope.row.carFollowingUser }}</span>
            </el-form-item>
            <el-form-item label="车牌号">
              <span>{{ scope.row.carNumber }}</span>
            </el-form-item>
            <el-form-item label="驾驶员">
              <span>{{ scope.row.driver }}</span>
            </el-form-item>
            <el-form-item label="驾驶员电话">
              <span>{{ scope.row.driverTel }}</span>
            </el-form-item>
            <el-form-item label="结算完成时间">
              <span>{{ scope.row.finishSettlementTime }}</span>
            </el-form-item>
            <el-form-item label="运费">
              <span>{{ scope.row.freightCharges }}</span>
            </el-form-item>
            <el-form-item label="结算状态">
              <span>{{ scope.row.isFinishSettlement?"完成":"等待结算" }}</span>
            </el-form-item>
            <el-form-item label="装车状态">
              <span>{{ scope.row.isFinishWarehouseOut?"完成":"等待装车" }}</span>
            </el-form-item>
            <el-form-item label="装车完成时间">
              <span>{{ scope.row.finishWarehouseOutTime }}</span>
            </el-form-item>
            <el-form-item label="纸厂名称">
              <span>{{ scope.row.paperMillName }}</span>
            </el-form-item>
            <el-form-item label="纸厂回收价格">
              <span>{{ scope.row.paperMillRetrievePrice }}</span>
            </el-form-item>
            <el-form-item label="获取纸厂回收时间">
              <span>{{ scope.row.paperMillRetrieveTime }}</span>
            </el-form-item>
            <el-form-item label="纸厂回收重量">
              <span>{{ scope.row.paperMillRetrieveWeight }}</span>
            </el-form-item>
            <el-form-item label="纸厂结算方式">
              <span v-if="scope.row.paperMillSettlementModes">{{ scope.row.paperMillSettlementModes===1?"实时结算":"延期结算" }}</span>
            </el-form-item>
            <el-form-item label="纸饼数量">
              <span>{{ scope.row.paperPillsCount }}</span>
            </el-form-item>
            <el-form-item label="纸饼重量">
              <span>{{ scope.row.paperPillsWeight }}</span>
            </el-form-item>
            <el-form-item label="装车时间">
              <span>{{ scope.row.paperWarehouseOutTime }}</span>
            </el-form-item>
            <el-form-item label="收款时间">
              <span>{{ scope.row.receivePaymentTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="carFollowingUser"
        label="跟车人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="carNumber"
        label="车牌号"
        width="140">
      </el-table-column>
      <el-table-column
        prop="driver"
        label="驾驶员"
        width="140">
      </el-table-column>
      <el-table-column
        prop="driverTel"
        label="驾驶员电话"
        width="140">
      </el-table-column>
      <el-table-column
        label="结算状态"
        width="140">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isFinishSettlement" type="success">完成</el-tag>
          <el-tag v-else type="warning">未结算</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="装车状态"
        width="140">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isFinishWarehouseOut" type="success">完成</el-tag>
          <el-tag v-else type="warning">装车未完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="300">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.isFinishSettlement&&scope.row.isFinishWarehouseOut" @click="balanceOpen(scope.row)" type="primary" size="small">结算录入</el-button>
          <el-button v-if="!scope.row.isFinishSettlement" @click="addPill(scope.row)" type="warning" size="small">添加纸饼</el-button>
          <el-button v-if="scope.row.paperMillSettlementModes===2&&!scope.row.isFinishSettlement" @click="ensureBalance(scope.row)" type="danger" size="small">结算确认</el-button>
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
    outBoundAdd,
    outBoundList,
    outBoundSureBalance,
    balancePutIn,
  } from "../../api/recycleManagement";
  import qs from "qs";

  export default {
    name: 'limit',
    data() {
      return {
        currentOutId:null,
        addFlag:false,
        balanceFlag:false,
        stores:[
          {id:0,name:"测试1"},
          {id:2,name:"测试2"}
        ],
        balanceForm:{
          price:null,
          weight:null,
          balanceType:1,
          time:null
        },
        form:{
          carFollowingUser: null,
          carNumber: null,
          driver: null,
          driverTel: null,
          paperStoreName: null,
          putInCarTime:null,
          freightCharges:null
        },
        formLabelWidth:"120px",
        searchInfo:{
          carFollowingUser: null,
          carNumber: null,
          driver: null,
          driverTel: null,
          isFinishSettlement: null,
          paperMillName: null,
          paperWarehouseOutTimeEnd: null,
          paperWarehouseOutTimeStart: null
        },
        tableData: [],
        // 分页配置
        pageSize: 15,
        total:0,
        currentPage:1,
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      };
    },
    watch:{
    },
    methods: {
      addPill(info){
        this.$router.push({
          path:'/lcgComponent/outBoundComponent',
          query:{
            infoId:info.paperWarehouseOutId
          }
        })
      },
      ensureBalance(info){


        this.$confirm('请确认结算已经完成', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let prm = qs.stringify({
            paperWarehouseOutId:info.paperWarehouseOutId
          })
          outBoundSureBalance(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"操作成功"
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
      balanceOpen(info){
        this.balanceForm.time = null;
        this.balanceForm.weight = null;
        this.balanceForm.price = null;
        this.balanceForm.balanceType = 1;
        this.balanceFlag = true
        this.currentOutId = info.paperWarehouseOutId
      },
      addBalanceInfo(){
        let prm = {
          "paperMillRetrievePrice": parseInt(this.balanceForm.price),
          "paperMillRetrieveTime": this.balanceForm.time,
          "paperMillRetrieveWeight": parseFloat(this.balanceForm.weight),
          "paperMillSettlementModes": this.balanceForm.balanceType,
          "paperWarehouseOutId": this.currentOutId
        };
        balancePutIn(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:"success",
              message:"结算信息录入成功"
            })
            this.getList();
            this.balanceFlag = false
          }
        })
      },
      addOpen(){
        this.addFlag = true;
        this.form.putInCarTime = null;
        this.form.driverTel = null;
        this.form.driver = null;
        this.form.carNumber = null;
        this.form.carFollowingUser = null;
        this.form.freightCharges = null;
        this.form.paperStoreName = null;
      },
      formatDate(date){
        let tt = new Date(date);
        let y = tt.getFullYear();
        let mon = tt.getMonth()+1;
        let d = tt.getDate();
        return `${y}-${mon}-${d}`
      },
      saveHandle(){
        let prm = {
          "carFollowingUser": this.form.carFollowingUser,
          "carNumber": this.form.carNumber,
          "driver": this.form.driver,
          "driverTel": this.form.driverTel,
          "freightCharges": parseFloat(this.form.freightCharges),
          "paperMillName": this.form.paperStoreName,
          "paperWarehouseOutTime": this.form.putInCarTime
        };
        outBoundAdd(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:"success",
              message:"添加成功"
            })
            // this.getList();
            this.addFlag = false
            this.$router.push({
              path:'/lcgComponent/outBoundComponent',
              query:{
                infoId:res.data.result.paperWarehouseOutId
              }
            })
          }
        })
      },
      getList(v=1){
        let prm = {
          "pageNum": v,
          "pageSize": this.pageSize,
          "carFollowingUser": this.searchInfo.carFollowingUser,
          "carNumber": this.searchInfo.carNumber,
          "driver": this.searchInfo.driver,
          "driverTel": this.searchInfo.driverTel,
          "isFinishSettlement": this.searchInfo.isFinishSettlement,
          "paperMillName": this.searchInfo.paperMillName,
          /*"paperWarehouseOutTimeEnd": "",
          "paperWarehouseOutTimeStart": ""*/
        }
        outBoundList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      searchList(){
        this.getList()
      },
      resetList(){
        this.searchInfo.carNumber = null;
        this.searchInfo.carFollowingUser = null;
        this.searchInfo.driverTel = null;
        this.searchInfo.driver = null;
        this.searchInfo.paperMillName = null;
        this.getList()
      },

    },
    mounted() {
      this.getList();
    }
  };
</script>
<style scoped lang="less">
  .user-top{
    margin: 10px 0 10px 0;
  }
  .search-container{
    width: 160px;
    margin: 15px 0;
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
</style>
