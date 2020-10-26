<template>
  <div class="app-container">

    <el-row class="process-wrapper">
      <el-select v-model="searchInfo.payType" placeholder="请选择支付类型">
        <el-option
          v-for="item in payTypes"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="searchInfo.commodityOrderStatus" placeholder="请选择订单状态">
        <el-option
          v-for="item in commodityOrderStatuss"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="searchInfo.user" placeholder="请选择用户">
        <el-option
          v-for="item in users"
          :key="item.sysUserId"
          :label="item.userName"
          :value="item.sysUserId">
        </el-option>
      </el-select>
    <!--  <el-button style="margin-left: 10px" type="primary" plain @click="searchList">搜索</el-button>-->
      <el-button style="margin-left: 10px" type="success" plain @click="showAll">查看所有</el-button>
    </el-row>


    <el-dialog title="发货信息" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="快递单号" :label-width="formLabelWidth">
          <el-input v-model="form.expressNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="快递公司" :label-width="formLabelWidth">
          <el-select v-model="form.expressType" placeholder="请选择快递公司">
            <el-option v-for="item in expressTypes" :label="item.name" :value="item.id"></el-option>
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
        prop="commodityOrderCode"
        label="订单编号"
        width="120">
      </el-table-column>
      <el-table-column
        label="订单状态"
        width="140">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.commodityOrderStatus===0">待支付</el-tag>
          <el-tag v-if="scope.row.commodityOrderStatus===1">支付中</el-tag>
          <el-tag v-if="scope.row.commodityOrderStatus===100">取消支付</el-tag>
          <el-tag v-if="scope.row.commodityOrderStatus===101">关闭支付</el-tag>
          <el-tag v-if="scope.row.commodityOrderStatus===200">支付成功</el-tag>
          <el-tag v-if="scope.row.commodityOrderStatus===300">已发货</el-tag>
          <el-tag v-if="scope.row.commodityOrderStatus===301">已收货</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="payMoney"
        label="支付金额"
        width="140">
      </el-table-column>
      <el-table-column
        prop="totalPrice"
        label="总价"
        width="120">
      </el-table-column>
      <el-table-column
        label="支付方式"
        width="140">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.payType===1">微信</el-tag>
          <el-tag type="success" v-if="scope.row.payType===2">支付宝</el-tag>
          <el-tag type="success" v-if="scope.row.payType===3">余额支付</el-tag>
          <el-tag type="success" v-if="scope.row.payType===4">积分支付</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="320">
        <template slot-scope="scope">
          <el-button :disabled="!(scope.row.commodityOrderStatus===200)" @click="editOpen(scope.row)" type="primary" size="small">发货</el-button>
          <el-button :disabled="!(scope.row.commodityOrderStatus===300)" @click="ensureReceive(scope.row)" type="danger" size="small">收货</el-button>
          <!--<el-button  @click="editOpen(scope.row)" type="primary" size="small">发货</el-button>
          <el-button  @click="ensureReceive(scope.row)" type="danger" size="small">收货</el-button>-->
          <el-popover
            placement="right"
            trigger="hover">
            <el-table :data="scope.row.orderItems">
              <el-table-column width="100" property="commodityName" label="商品名"></el-table-column>
              <el-table-column width="100" property="commodityCode" label="编码"></el-table-column>
              <el-table-column width="100" property="commodityCount" label="数量"></el-table-column>
              <el-table-column width="100" property="price" label="价格"></el-table-column>
            </el-table>
            <el-button type="info" slot="reference" size="small">订单详情</el-button>
          </el-popover>
          <el-popover
            placement="right"
            trigger="hover">
            <el-table :data="scope.row.deliveryRecords">
              <el-table-column width="80" property="deliveryContact" label="发货人"></el-table-column>
              <el-table-column width="100" property="deliveryTel" label="发货人电话"></el-table-column>
              <el-table-column width="100" property="deliveryTime" label="发货时间"></el-table-column>
              <el-table-column width="100" property="deliveryAddress" label="发货地址"></el-table-column>
              <el-table-column width="100" property="receiptTime" label="收件时间"></el-table-column>
              <el-table-column width="80" label="发货状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.deliveryStatus===0">待结算</span>
                  <span v-if="scope.row.deliveryStatus===1">待发货</span>
                  <span v-if="scope.row.deliveryStatus===2">已发货</span>
                  <span v-if="scope.row.deliveryStatus===3">待收货</span>
                </template>
              </el-table-column>
              <el-table-column width="100" property="expressNumber" label="快递单号"></el-table-column>
              <el-table-column width="100" label="快递类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.expressType===1">顺丰速运</span>
                  <span v-if="scope.row.expressType===2">邮政EMS</span>
                  <span v-if="scope.row.expressType===3">中通快递</span>
                  <span v-if="scope.row.expressType===4">韵达快递</span>
                  <span v-if="scope.row.expressType===5">圆通速递</span>
                  <span v-if="scope.row.expressType===6">申通快递</span>
                  <span v-if="scope.row.expressType===7">百世快递</span>
                  <span v-if="scope.row.expressType===8">宅急送快运</span>
                  <span v-if="scope.row.expressType===9">天天快递</span>
                  <span v-if="scope.row.expressType===10">快捷快递</span>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="warning" slot="reference" size="small">发货记录</el-button>
          </el-popover>
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
  import {userList} from "../../api/userManagement";
  import {goodsOrderList,orderReceive,orderDeliver} from "../../api/goods";

  export default {
    name: 'limit',
    data() {
      return {
        users:null,

        payTypes:[
          {id:1,name:'微信'},
          {id:2,name:'支付宝'},
          {id:3,name:'余额'},
          {id:4,name:'仅积分'},
        ],
        commodityOrderStatuss:[
          {id:0,name:'待支付'},
          {id:1,name:'支付中'},
          {id:100,name:'取消支付'},
          {id:101,name:'关闭支付'},
          {id:200,name:'支付成功'},
          {id:300,name:'已发货'},
          {id:301,name:'已收货'},
        ],
        // 1顺丰速运,2邮政EMS,3中通快递,4韵达快递,5圆通速递6申通快递,7百世快递,8宅急送快运，9天天快递,10快捷快递，默认0
        expressTypes:[
          {id:1,name:'顺丰速运'},
          {id:2,name:'邮政EMS'},
          {id:3,name:'中通快递'},
          {id:4,name:'韵达快递'},
          {id:5,name:'圆通速递'},
          {id:6,name:'申通快递'},
          {id:7,name:'百世快递'},
          {id:8,name:'宅急送快运'},
          {id:9,name:'天天快递'},
          {id:10,name:'快捷快递'},
        ],
        searchInfo:{
          paySuccessTimeEnd:null,
          commodityOrderStatus:null,
          paySuccessTimeStart:null,
          payType:null,
          user:null,
        },
        form: {
          expressNumber:null,
          expressType:null,
        },
        orderId:null,
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
      "searchInfo":{
        handler(){
          this.getList()
        },
        deep:true
      }
    },
    methods: {
      getUserList(){
        let prm = {
          pageNum:1,
          pageSize:200,
        }
        userList(prm).then(res=>{
          this.users = res.data.result.list
        })
      },
      getList(v=1){
        let prm = {
          "pageNum": v,
          "pageSize": this.pageSize,
          "commodityOrderStatus": this.searchInfo.commodityOrderStatus,
          "paySuccessTimeEnd": this.searchInfo.paySuccessTimeEnd,
          "paySuccessTimeStart": this.searchInfo.paySuccessTimeStart,
          "payType": this.searchInfo.payType,
          "userUuid": this.searchInfo.user,
        }
        goodsOrderList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      editOpen(info){
        console.log(info)
        this.addFlag = true;
        this.orderId = info.commodityOrderId
      },
      saveHandle(){
          let prm = {
            "commodityOrderId": this.orderId,
            "expressNumber": this.form.expressNumber,
            "expressType": this.form.expressType
          }
          orderDeliver(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message: "发货成功"
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

      },
      ensureReceive(info){
        this.$confirm('确认更新订单状态为已收货吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let prm = qs.stringify({
            commodityOrderId: info.commodityOrderId
          });
          orderReceive(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"更新完成"
              })
              this.getList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消更新'
          });
        });
      },
      searchList(){
        this.getList()
      },
      showAll(){
        this.searchInfo.user = null;
        this.searchInfo.payType = null;
        this.searchInfo.commodityOrderStatus = null;
        this.getList()
      }

    },
    mounted() {
      this.getList();
      this.getUserList();
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
