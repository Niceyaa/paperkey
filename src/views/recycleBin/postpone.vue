<template>
  <div class="app-container">

        <el-button v-if="orderStatus===0||orderStatus===1" class="add-flag" type="success" plain @click="addOpen">添加延期</el-button>
<!--    <el-button class="add-flag" type="success" plain @click="addOpen">添加延期</el-button>-->

    <el-row>
      <el-input clearable class="search-container" v-model="searchInfo.name" placeholder="/延期人"></el-input>
      <el-date-picker
        v-model="searchInfo.startTime"
        type="datetime"
        placeholder="选择延期开始时间"
        align="right"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-date-picker
        v-model="searchInfo.endTime"
        type="datetime"
        placeholder="选择延期结束时间"
        align="right"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button style="margin: 0 10px 20px 0" plain type="primary" @click="searchList">搜索</el-button>
      <el-button style="margin: 0 10px 20px 0" plain type="warning" @click="resetList">重置</el-button>
    </el-row>



    <el-dialog title="添加延期" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="延期原因" :label-width="formLabelWidth">
          <el-input v-model="form.delayReason" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="延期时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.delayTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
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
        prop="delayUser"
        label="延期人"
        width="80">
      </el-table-column>
      <el-table-column
        prop="delayTime"
        label="延期时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="delayReason"
        label="延期原因"
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
  import {postponeAdd,postponeList} from "../../api/recycleManagement";
  export default {
    data() {
      return {
        postponeId:null,
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
          delayReason:null,
          delayTime:null,
          receiver:null
        },
        formLabelWidth:"120px",

        searchInfo:{
          name:null,
          endTime:null,
          startTime:null,
        },
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
      },
      saveHandle(){
        let prm = {
          "delayReason": this.form.delayReason,
          "delayTime": this.form.delayTime,
          "orderId": this.orderId,
          delayUser:parseInt(this.postponeId)
        }
        postponeAdd(prm).then(res=>{
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
        postponeList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      searchList(){
        let prm = {
          "delayEndTime": this.searchInfo.endTime,
          "delayStartTime": this.searchInfo.startTime,
          "delayUser": this.searchInfo.name,
          "pageNum": 1,
          "pageSize": this.pageSize,
          orderId:this.orderId
        }
        postponeList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      resetList(){
        this.searchInfo.name = null;
        this.searchInfo.startTime = null;
        this.searchInfo.endTime = null;
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
        this.postponeId = this.$route.query.postponeId
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
