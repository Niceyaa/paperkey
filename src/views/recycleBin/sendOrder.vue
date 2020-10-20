<template>
  <div class="app-container">

    <el-button v-if="orderStatus===0||orderStatus===1" class="add-flag" type="success" plain @click="addOpen">添加派单</el-button>
    <!--<el-button class="add-flag" type="success" plain @click="addOpen">添加派单</el-button>-->

    <el-row>
      <el-input clearable class="search-container" v-model="searchInfo.sendName" placeholder="/派单人"></el-input>
      <el-input clearable class="search-container" v-model="searchInfo.receiver" placeholder="/回收人"></el-input>
      <el-date-picker
        v-model="searchInfo.startTime"
        type="datetime"
        placeholder="选择派单开始时间"
        align="right"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-date-picker
        v-model="searchInfo.endTime"
        type="datetime"
        placeholder="选择派单结束时间"
        align="right"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button style="margin: 0 10px 20px 0" plain type="primary" @click="searchList">搜索</el-button>
      <el-button style="margin: 0 10px 20px 0" plain type="warning" @click="resetList">重置</el-button>
    </el-row>



    <el-dialog title="添加派单" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="回收人" :label-width="formLabelWidth">
          <el-select v-model="form.receiver" placeholder="请选择回收人">
            <el-option
              v-for="item in receivers"
              :key="item.sysUserId"
              :label="item.userName"
              :value="item.sysUserId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveHandle">确 定</el-button>
      </div>
    </el-dialog>


    <el-row style="height: 1px;background: #8c939d"></el-row>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="distributeUser"
        label="派单人"
        width="80">
      </el-table-column>
      <el-table-column
        prop="distributeTime"
        label="派单时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="retrieveUser"
        label="回收人"
        width="100">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        min-width="140">
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
  import {sendOrderAdd,sendOrderList} from "../../api/recycleManagement";
  import {userList} from "../../api/userManagement";

  export default {
    data() {
      return {
        orderStatus:null,
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
        addFlag:false,
        orderId:null,
        paperTypes:[],
        form:{
          remark:null,
          receiver:null,

        },
        receivers:[],
        formLabelWidth:"120px",

        searchInfo:{sendName:null,receiver:null,startTime:null,endTime:null},
        tableData: [],
        // 分页配置
        pageSize: 10,
        total:0,
        currentPage:1
      };
    },
    watch:{
    },
    methods: {
      addOpen(){
        this.addFlag = true
        this.form.weight=null;
        this.form.receiver=null;
        this.getReceivers();
      },

      async getReceivers(i=1) {
        let prm = {
          "pageNum": i,
          "pageSize": this.pageSize,
        }
        const {
          data
        } = await userList(prm);
        const {
          result
        } = data;
        this.receivers = result.list;
      },

      saveHandle(){
        let prm = {
          "orderId": this.orderId,
          "remark": this.form.remark,
          "retrieveUser": this.form.receiver
        }
        sendOrderAdd(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              title:"添加成功!",
              type:'success'
            })
            this.addFlag = false;
            this.getList()
          }
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
          orderId:this.orderId
        }
        sendOrderList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      searchList(){
        let prm = {
          "pageNum": 1,
          "pageSize": this.pageSize,
          "distributeEndTime": this.searchInfo.endTime,
          "distributeStartTime": this.searchInfo.startTime,
          "distributeUser": this.searchInfo.sendName,
          "orderId": this.orderId,
          "retrieveUser": this.searchInfo.receiver
        }
        sendOrderList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      resetList(){
        this.searchInfo.sendName = null;
        this.searchInfo.endTime = null;
        this.searchInfo.startTime = null;
        this.searchInfo.receiver = null;
        this.getList()
      },
      showAll(){
        this.currentCompressType = null
      },

    },
    mounted() {
      if (this.$route.query.orderID){
        this.orderId = this.$route.query.orderID
        this.orderStatus = this.$route.query.orderStatus
        this.orderStatus = parseInt(this.orderStatus)
      }
      this.getList();
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
  .add-flag{
    margin-bottom: 20px;
  }
</style>
