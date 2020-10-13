<template>
  <div class="app-container">
    <el-row class="user-top">
      <el-button type="primary" plain @click="addOpen">添加压缩</el-button>
    </el-row>



    <el-row class="process-wrapper">
      <el-row>
        <el-input clearable class="search-container" v-model="searchInfo.optName" placeholder="/压缩人"></el-input>
        <el-input clearable class="search-container" v-model="searchInfo.createName" placeholder="/录入人"></el-input>
        <el-button style="margin-left: 10px" plain type="primary" @click="searchList">搜索</el-button>
        <el-button style="margin-left: 10px" plain type="warning" @click="resetList">重置</el-button>
      </el-row>
      <el-select v-model="currentCompressType" placeholder="请选择压缩类型">
        <el-option
          v-for="item in compressTypes"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button style="margin-left: 10px" type="success" plain @click="showAll">查看所有</el-button>
    </el-row>


    <el-dialog title="添加压缩" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="压缩类型" :label-width="formLabelWidth">
          <el-select v-model="form.compressType" placeholder="请选择压缩类型">
            <el-option v-for="item in compressTypes" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作人" :label-width="formLabelWidth">
          <el-select v-model="form.optUserId" placeholder="请选择操作人">
            <el-option v-for="item in optUsers" :label="item.userName" :value="item.sysUserId"></el-option>
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
      type="expand"
      style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="压缩类型">
                <span>{{scope.row.compressType===1?"直接压缩":"纸花压缩" }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ scope.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="创建人">
                <span>{{ scope.row.createUserName }}</span>
              </el-form-item>
              <el-form-item label="结束时间">
                <span>{{ scope.row.endTime }}</span>
              </el-form-item>
              <el-form-item label="操作人姓名">
                <span>{{ scope.row.operateUserName }}</span>
              </el-form-item>
              <el-form-item label="纸饼数量">
                <span>{{ scope.row.paperPillsCount }}</span>
              </el-form-item>
              <el-form-item label="纸饼重量">
                <span>{{ scope.row.paperPillsWeight }}</span>
              </el-form-item>
              <el-form-item label="开始压缩时间">
                <span>{{ scope.row.startTime }}</span>
              </el-form-item>
              <el-form-item label="压缩状态">
                <span>{{ scope.row.isEnd?"压缩完成":"处理中" }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      <el-table-column
        prop="operateUserName"
        label="操作人员姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="createUserName"
        label="录入人姓名"
        width="140">
      </el-table-column>
      <el-table-column
        prop="compressType"
        label="压缩类型"
        width="140">
        <template slot-scope="scope">{{scope.row.compressType===1?"直接压缩":"纸花压缩"}}</template>
      </el-table-column>
      <el-table-column
        prop="isEnd"
        label="压缩状态"
        min-width="140">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnd" type="success">完成</el-tag>
          <el-tag v-else type="warning">处理中</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column
        label="操作"
        min-width="140">
        <template slot-scope="scope">
          <el-button plain type="primary" size="mini" @click="finishStatus(scope.row)">压缩完成</el-button>
        </template>
      </el-table-column>-->
      <!--<el-table-column
        fixed="right"
        label="操作"
        min-width="100">
        <template slot-scope="scope">
          <el-button @click="editOpen(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteHandle(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>-->
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
  import {userList} from "../../api/userManagement";
  import {paperZipAdd,paperZipFinish,paperZipList} from "../../api/recycleManagement";

  export default {
    data() {
      return {
        startTimeFlag:false,
        startTime:null,
        endTime:"请选择时间",
        currentCompressType:null,
        compressTypes:[
          {id:1,name:"直接压缩"},
          {id:2,name:"纸花压缩"}
          ],
        optUsers:[],
        searchInfo:{
          optName:null,
          createName:null
        },
        form: {
          compressType:null,
          optUserId:null
        },
        formLabelWidth: '120px',
        addFlag: false,
        tableData: [],
        // 分页配置
        pageSize: 10,
        total:0,
        currentPage:1
      };
    },
    watch:{
      startTime(val){
        console.log(val)
        this.startTime = this.formatDate(val)
      },
      currentCompressType(val){
        let prm = {
          "pageNum": 1,
          "pageSize": this.pageSize,
          compressType:val
        }
        paperZipList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      }
    },
    methods: {
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
          operateUserName:this.searchInfo.optName,
          createUserName:this.searchInfo.createName,
        }
        paperZipList(prm).then(res=>{
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
        this.getReceivers()
      },
      async getReceivers(i=1) {
        let prm = {
          "currentPage": i,
          "pageSize": this.pageSize,
        }
        const {
          data
        } = await userList(prm);
        const {
          result
        } = data;
        this.optUsers = result.list;
      },
      editOpen(info){
        console.log(info)
        this.addFlag = true;
        this.form.compressType = info.compressType
      },
      saveHandle(){
          let prm = {
            operateUser: parseInt(this.form.optUserId),
            compressType: parseInt(this.form.compressType),
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
                  compressId:res.data.result.paperCompressId
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
      searchList(){
        this.getList()
      },
      resetList(){
        this.searchInfo.optName = null;
        this.searchInfo.createName = null;
        this.getList()
      },
      showAll(){
        this.currentCompressType = null
      },
      finishStatus(info){
        let prm = `paperCompressId=${info.paperCompressId}`
        paperZipFinish(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:"success",
              message:"状态已经更新"
            })
            this.getList()
          }
        })
        console.log("wancheng")
      }

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
</style>
