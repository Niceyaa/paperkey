<template>
  <div class="app-container">

    <el-button class="add-flag" type="success" plain @click="addOpen">添加入库</el-button>

    <el-row>
      <el-input clearable class="search-container" v-model="searchInfo.name" placeholder="/入库人"></el-input>
      <el-date-picker
        v-model="searchInfo.startTime"
        type="datetime"
        placeholder="选择入库开始时间"
        align="right"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-date-picker
        v-model="searchInfo.endTime"
        type="datetime"
        placeholder="选择入库结束时间"
        align="right"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button style="margin: 0 10px 20px 0" plain type="primary" @click="searchList">搜索</el-button>
      <el-button style="margin: 0 10px 20px 0" plain type="warning" @click="resetList">重置</el-button>
    </el-row>



    <el-dialog title="添加入库" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="包裹序号" :label-width="formLabelWidth">
          <el-input readonly v-model="form.packageSort" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="包装袋编号" :label-width="formLabelWidth">
          <el-input readonly v-model="form.packageNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重量" :label-width="formLabelWidth">
          <el-input @keydown.enter.native="getPackageId" id="focusInput" v-model="form.weight" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="addFlag = false">取 消</el-button>
        <el-button plain type="success" @click="saveHandle">入库并退出</el-button>
        <el-button plain type="primary" @click="continuePutIn">入库并继续</el-button>
      </div>
    </el-dialog>


    <el-row style="height: 1px;background: #8c939d"></el-row>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="inStorageUserInfo.userName"
        label="入库员"
        width="80">
      </el-table-column>
      <el-table-column
        prop="orderPackage.packageNum"
        label="包裹编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="order.address"
        label="订单地址"
        width="100">
      </el-table-column>
      <el-table-column
        prop="weight"
        label="重量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="inStorageTime"
        label="入库时间"
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
  import  qs from 'qs'
  import {bagPutInAdd,bagPutInList,bagDetail} from "../../api/recycleManagement";


  export default {
    data() {
      return {
        searchInfo:{
          name:null,
          endTime:null,
          startTime:null,
        },

        codeInfo:null,

        currentPackageId:null,
        packageInfo:{},

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
        form:{
          weight:null,
          packageSort:null,
          packageNum:null,
        },
        formLabelWidth:"120px",

        tableData: [],
        // 分页配置
        pageSize: 10,
        total:0,
        currentPage:1
      };
    },
    watch:{
      codeInfo(v){
        if (v===null){
          return
        }else{
          // sendmsg
          let prm = qs.stringify({
            orderPackageId:v.id
          })
          bagDetail(prm).then(res=>{
            this.form.packageSort = res.data.result.packageSort
            this.form.packageNum = res.data.result.packageNum
            this.form.weight = res.data.result.weight
          })
        }

      }
    },
    methods: {
      getPackageId(){
        this.codeInfo = JSON.parse(this.form.weight);
        this.form.weight = null;
        /*console.log(this.codeInfo)*/
      },

      continuePutIn(){
        document.getElementById("focusInput").focus()

         let prm = {
           orderPackageId:this.currentPackageId,
           weight:this.form.weight.length>0?this.form.weight:this.packageInfo.weight
         }
         bagPutInAdd(prm).then(res=>{
           if (res.data.code === 200){
             this.$message({
               title:"添加成功!",
               type:'success'
             })
             this.form.weight = null
             this.form.packageNum = null
             this.form.packageSort = null
           }
         })
      },
      addOpen(){
        this.addFlag = true
        this.form.weight=null;
        this.form.packageSort=null;
        this.form.packageNum=null;
        this.$nextTick(()=>{
          document.getElementById("focusInput").focus()
        })

      },

      saveHandle(){
        let prm = {
          orderPackageId:this.currentPackageId,
          weight:this.form.weight.length>0?this.form.weight:this.packageInfo.weight
        }
        bagPutInAdd(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              title:"add success!",
              type:'success'
            })
            this.form.weight = null
            this.form.packageNum = null
            this.form.packageSort = null
            this.addFlag = false
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
          "currentPage": v,
          "pageSize": this.pageSize
        }
        bagPutInList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      searchList(){
        let prm = {
          "currentPage": 1,
          "pageSize": this.pageSize,
          "inStorageTimeEnd": this.searchInfo.endTime,
          "inStorageTimeStart": this.searchInfo.startTime,
          "inStorageUserName": this.searchInfo.name,
        }
        bagPutInList(prm).then(res=>{
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

      },

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
  /deep/.self-focus .el-input__inner{
    height: 180px;
    text-align: center;
    line-height: 180px;
  }
</style>
