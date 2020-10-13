<template>
  <div class="app-container">

    <el-button v-if="orderStatus===2||orderStatus===3" class="add-flag" type="success" plain @click="addOpen">添加包裹</el-button>

    <!--<el-row>
      <el-input clearable class="search-container" v-model="searchInfo.name" placeholder="/名称"></el-input>
      <el-button style="margin-left: 10px" plain type="primary" @click="searchList">搜索</el-button>
      <el-button plain type="warning" @click="resetList">重置</el-button>
    </el-row>-->



    <el-dialog title="添加包裹" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="包裹序号" :label-width="formLabelWidth">
          <el-input v-model="form.packageSort" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="包装袋编号" :label-width="formLabelWidth">
          <el-input v-model="form.packageNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重量(估计)" :label-width="formLabelWidth">
          <el-input v-model="form.weight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="入库重量" :label-width="formLabelWidth">
          <el-input v-model="form.inStorageWeight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收件人" :label-width="formLabelWidth">
          <el-select v-model="form.receiver" placeholder="请选择收件人">
            <el-option
              v-for="item in receivers"
              :key="item.sysUserId"
              :label="item.userName"
              :value="item.sysUserId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.receiveTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="纸张类型" :label-width="formLabelWidth">
          <el-select v-model="form.paperType" placeholder="请选择纸张类型">
            <el-option
              v-for="item in paperTypes"
              :key="item.paperClassifyId"
              :label="item.name"
              :value="item.paperClassifyId">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveHandle">添加</el-button>
        <el-button type="primary" @click="addFinish">添加并确认收件完成</el-button>
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
            <el-form-item label="包裹序号">
              <span>{{scope.row.packageSort }}</span>
            </el-form-item>
            <el-form-item label="包装袋编号">
              <span>{{ scope.row.packageNum }}</span>
            </el-form-item>
            <el-form-item label="派单人">
              <span>{{ scope.row.distributeUserInfo.userName }}</span>
            </el-form-item>
            <el-form-item label="收件人">
              <span>{{ scope.row.receiverUserInfo.userName }}</span>
            </el-form-item>
            <el-form-item label="重量">
              <span>{{ scope.row.weight }}</span>
            </el-form-item>
            <el-form-item label="入库重量">
              <span>{{ scope.row.inStorageWeight }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{ scope.row.isFinishDeal?"完成":"处理中" }}</span>
            </el-form-item>
            <el-form-item label="派单时间">
              <span>{{ scope.row.distributeTime }}</span>
            </el-form-item>
            <el-form-item label="订单号">
              <span>{{ scope.row.orderId }}</span>
            </el-form-item>
            <el-form-item label="包裹数量">
              <span>{{ scope.row.packageNum }}</span>
            </el-form-item>
            <el-form-item label="纸张类型">
              <span>{{ scope.row.paperType }}</span>
            </el-form-item>
            <el-form-item label="收件时间">
              <span>{{ scope.row.receiveTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="packageSort"
        label="包裹序号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="distributeUserInfo.userName"
        label="派单人"
        width="100">
      </el-table-column>
      <el-table-column
        prop="receiverUserInfo.userName"
        label="收件人"
        width="100">
      </el-table-column>
      <el-table-column
        prop="inStorageWeight"
        label="入库重量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="distributeTime"
        label="派件时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="receiveTime"
        label="收件时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="isFinishDeal"
        label="状态"
        min-width="140">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnd" type="success">完成</el-tag>
          <el-tag v-else type="warning">处理中</el-tag>
        </template>
      </el-table-column>
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
  import {bagList,bagAdd} from "../../api/bagManagement";
  import {paperClassifyList,receiveFinish} from "../../api/recycleManagement";
  import {userList} from "../../api/userManagement";
  import qs from "qs";

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
          weight:null,
          packageSort:null,
          packageNum:null,
          receiver:null,
          receiveTime:null,
          paperType:null,
          inStorageWeight:null
        },
        receivers:[],
        formLabelWidth:"120px",

        searchInfo:{name:null},
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
        this.form.packageSort=null;
        this.form.packageNum=null;
        this.form.receiver=null;
        this.form.receiveTime=null;
        this.form.paperType=null;
        this.form.inStorageWeight=null
        let prm = {
          "pageNum": 1,
          "pageSize": this.pageSize,
        }
        paperClassifyList(prm).then(res=>{
          this.paperTypes = res.data.result.list
        })
        this.getReceivers();
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
        this.receivers = result.list;
      },


      saveHandle(){
        let prm = {
          inStorageWeight:parseFloat(this.form.inStorageWeight),
          "orderId": this.orderId,
          "packageNum": this.form.packageNum,
          "packageSort": parseInt(this.form.packageSort),
          "paperType": parseInt(this.form.paperType),
          "receiveTime": this.form.receiveTime,
          "receiver": parseInt(this.form.receiver),
          "weight": parseFloat(this.form.weight)
        }
        bagAdd(prm).then(res=>{
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
      addFinish(){
        let prm = {
          inStorageWeight:parseFloat(this.form.inStorageWeight),
          "orderId": this.orderId,
          "packageNum": this.form.packageNum,
          "packageSort": parseInt(this.form.packageSort),
          "paperType": parseInt(this.form.paperType),
          "receiveTime": this.form.receiveTime,
          "receiver": parseInt(this.form.receiver),
          "weight": parseFloat(this.form.weight)
        }
        bagAdd(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              title:"添加成功!",
              type:'success'
            })

            this.$confirm('确认包裹添加完毕，执行收件完成吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {

              let prm = qs.stringify({
                orderId: this.orderId
              });
              receiveFinish(prm).then(res=>{
                if (res.data.code === 200){
                  this.$message({
                    type:"success",
                    message:"收件完成"
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
          "currentPage": v,
          "pageSize": this.pageSize,
          orderId:this.orderId
        }
        bagList(prm).then(res=>{
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
          name:this.searchInfo.name,
          "retrieveProcessId": this.processId,
        }
        recycleWeightList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      resetList(){
        this.searchInfo.name = null;
        this.getList()
      },
      showAll(){
        this.currentCompressType = null
      },

    },
    mounted() {
      this.orderId = this.$route.query.orderID
      this.orderStatus = this.$route.query.orderStatus
      this.orderStatus = parseInt(this.orderStatus)
      console.log(this.orderStatus)
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
