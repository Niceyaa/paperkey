<template>
  <div class="app-container">
    <el-row class="user-top">
      <el-button type="primary" plain @click="addOpen">添加发票</el-button>
    </el-row>

    <el-row class="search-wrapper">
      <el-col style="margin-right: 20px;width: 200px">
        <el-select v-model="searchInfo.invoiceState" placeholder="请选择发票状态">
          <el-option label="正在开票" :value="0"></el-option>
          <el-option label="已开票" :value="1"></el-option>
          <el-option label="已邮寄" :value="200"></el-option>
        </el-select>
      </el-col>
      <el-col  style="margin-right: 20px;width: 200px">
        <el-select v-model="searchInfo.invoiceType" placeholder="请选择发票类型">
          <el-option v-for="item in invoiceTypes" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col style="margin-right: 20px;width: 200px">
        <el-date-picker
          style="margin-right: 20px;width: 200px"
          v-model="searchInfo.applyStartTime"
          type="date"
          placeholder="申请开始时间">
        </el-date-picker>
      </el-col>
      <el-col  style="margin-right: 20px;width: 200px">
        <el-date-picker
          style="margin-right: 20px;width: 200px"
          v-model="searchInfo.applyEndTime"
          type="date"
          placeholder="申请结束时间">
        </el-date-picker>
      </el-col>
      <el-button plain type="primary" @click="searchList">搜索</el-button>
      <el-button plain type="warning" @click="resetData">重置</el-button>
    </el-row>

    <!--添加發票-->
    <el-dialog class="addInvoice" :title="diaTitle" :visible.sync="addFlag">

      <div v-if="diaTitle==='添加发票'">
        <el-row class="form-search">
          <el-col :span="4">
            <el-select v-model="ruleForm.orderType" placeholder="请选择订单类型">
              <el-option label="商品订单" :value="1"></el-option>
              <el-option label="回收订单" :value="2"></el-option>
            </el-select>
          </el-col>
          <el-col style="margin-left: 15px" :span="8">
            <el-input clearable tyep="number" v-model="formSearchInfo.user" placeholder="/用户ID"></el-input>
          </el-col>
          <el-col style="margin-left: 15px" :span="6">
            <el-button plain type="primary" @click="searchOrderById">搜索</el-button>
            <el-button plain type="warning" @click="resetOrderById">重置</el-button>
          </el-col>
        </el-row>

        <!--商品订单表-->
        <el-table
          v-if="ruleForm.orderType===1"
          ref="multipleTable"
          :data="orderData"
          height="250"
          tooltip-effect="dark"
          style="width: 100%;margin-bottom: 20px"
          @selection-change="selectOrderHandle">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="commodityOrderCode"
            label="订单编号"
            width="200">
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
            min-width="140">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.payType===1">微信</el-tag>
              <el-tag type="success" v-if="scope.row.payType===2">支付宝</el-tag>
              <el-tag type="success" v-if="scope.row.payType===3">余额支付</el-tag>
              <el-tag type="success" v-if="scope.row.payType===4">积分支付</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <!--回收订单表-->
        <el-table
          v-else
          height="250"
          ref="multipleTable"
          :data="orderData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="selectOrderHandle">
          <el-table-column
            type="selection"
            width="55">
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
          <el-table-column
            prop="phone"
            label="电话"
            width="120">
          </el-table-column>
          <el-table-column
            label="订单状态"
            min-width="120">
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
        </el-table>
      </div>



      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="税号" prop="taxCode">
          <el-input v-model="ruleForm.taxCode"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="firm">
          <el-input v-model="ruleForm.firm"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="收件地址" prop="receiverAddress">
          <el-input v-model="ruleForm.receiverAddress"></el-input>
        </el-form-item>
        <el-form-item label="机构类型" prop="organization">
          <el-select v-model="ruleForm.organization" placeholder="请选择机构类型">
            <el-option v-for="item in organizations" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="cityid">
          <el-cascader
            v-model="ruleForm.cityid"
            :options="cityData"
            :props="cityProps"
            @change="cityHandle"></el-cascader>
        </el-form-item>
        <el-form-item label="发票类型" prop="invoiceType">
          <el-select v-model="ruleForm.invoiceType" placeholder="请选择发票类型">
            <el-option v-for="item in invoiceTypes" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件人" prop="receiver">
          <el-input v-model="ruleForm.receiver"></el-input>
        </el-form-item>
        <el-form-item v-if="fileUrl" label="发票文件">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="httpRequest">
            <img v-if="fileUrl" :src="fileUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="addFlag=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--處理發票-->
    <el-dialog class="dealInvoice"  title="处理发票" :visible.sync="dealFlag">
      <el-form :model="dealForm" :rules="dealRules" ref="dealForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="发票单号" prop="invoiceNum">
          <el-input v-model="dealForm.invoiceNum"></el-input>
        </el-form-item>

        <el-form-item label="发票类型" prop="invoiceType">
          <el-select v-model="dealForm.invoiceType" placeholder="请选择收件人">
            <el-option v-for="item in invoiceTypes" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票文件">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="httpRequest">
            <img v-if="fileUrl" :src="fileUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dealInvoiceHandle('dealForm')">添加</el-button>
          <el-button @click="dealFlag = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--快遞處理-->
    <el-dialog class="dealInvoice"  title="快递处理" :visible.sync="expressFlag">
      <el-form :model="expressForm" :rules="expressRules" ref="expressForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="快递单号" prop="expressNum">
          <el-input v-model="expressForm.expressNumber"></el-input>
        </el-form-item>
        <el-form-item label="快递类型" prop="expressType">
          <el-select v-model="expressForm.expressType" placeholder="请选择快递类型">
            <el-option v-for="item in expressTypes" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="dealExpressHandle('expressForm')">确定</el-button>
          <el-button @click="expressFlag = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


    <el-table
      :data="tableData"
      type="expand"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="发票总金额">
              <span>{{ scope.row.accountTotal }}</span>
            </el-form-item>
            <el-form-item label="申请时间">
              <span>{{ scope.row.applyTime }}</span>
            </el-form-item>
            <el-form-item label="申请人">
              <span>{{ scope.row.applyUser }}</span>
            </el-form-item>
            <el-form-item label="公司名称">
              <span>{{ scope.row.companyName }}</span>
            </el-form-item>
            <el-form-item label="邮箱">
              <span>{{ scope.row.email }}</span>
            </el-form-item>
            <el-form-item label="机构类型">
              <span>{{ scope.row.institutionType===1?'单位':'个人' }}</span>
            </el-form-item>
            <el-form-item label="发票处理人">
              <span>{{ scope.row.invoiceDealSysuser }}</span>
            </el-form-item>
            <el-form-item label="发票处理时间">
              <span>{{ scope.row.invoiceDealTime }}</span>
            </el-form-item>
            <el-form-item label="发票单号">
              <span>{{ scope.row.invoiceNumber }}</span>
            </el-form-item>
            <el-form-item label="发票状态">
              <span v-if="scope.row.invoiceState==0">正在开票</span>
              <span v-if="scope.row.invoiceState==1">已开票</span>
              <span v-if="scope.row.invoiceState==200">邮寄完成</span>
            </el-form-item>
            <el-form-item label="发票类型">
              <span>{{ scope.row.invoiceType===1?'普通发票':'电子发票' }}</span>
            </el-form-item>
            <el-form-item label="订单类型">
              <span>{{ scope.row.orderType===1?'商品订单':'回收订单' }}</span>
            </el-form-item>
            <el-form-item label="收件人">
              <span>{{ scope.row.receiver }}</span>
            </el-form-item>
            <el-form-item label="收件人地址">
              <span>{{ scope.row.receiverAddress }}</span>
            </el-form-item>
            <el-form-item label="收件人电话">
              <span>{{ scope.row.receiverTel }}</span>
            </el-form-item>
            <el-form-item label="税号">
              <span>{{ scope.row.taxcode }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        prop="institutionType"
        label="机构类型"
        width="120">
        <template slot-scope="scope">{{scope.row.institutionType===1?"单位":"个人"}}</template>
      </el-table-column>
      <el-table-column
        prop="institutionType"
        label="发票类型"
        width="120">
        <template slot-scope="scope">{{scope.row.invoiceType===1?"普通发票":"电子发票"}}</template>
      </el-table-column>
      <el-table-column
        prop="institutionType"
        label="订单类型"
        width="120">
        <template slot-scope="scope">{{scope.row.orderType===1?"商品订单":"回收订单"}}</template>
      </el-table-column>
      <el-table-column
        prop="taxcode"
        label="税号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="invoiceFile"
        label="发票文件"
        width="100">
        <template slot-scope="scope">
          <a v-if="scope.row.invoiceFile" style="color: blue;font-weight: bold" :href="scope.row.invoiceFile" target="_blank">查看</a>
        </template>
      </el-table-column>
      <el-table-column
      prop="invoiceState"
      label="发票状态"
      width="100">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.invoiceState===0">正在开票</el-tag>
          <el-tag type="primary" v-if="scope.row.invoiceState===1">已开票</el-tag>
          <el-tag type="success" v-if="scope.row.invoiceState===200">邮寄完成</el-tag>
        </template>
    </el-table-column>
      <el-table-column
        align="center"
        label="状态"
        width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status === 1" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="340">
        <template slot-scope="scope">
          <el-button v-if="scope.row.invoiceState===0" size="small" type="warning" plain @click="dealInvoice(scope.row)">处理发票</el-button>
          <el-button v-if="scope.row.invoiceState===1&&scope.row.invoiceType===1" size="small" type="danger" plain @click="dealExpress(scope.row)">快递处理</el-button>
          <el-button @click="editOpen(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteHandle(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row class="center-page">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage1"
        :page-size="pageSize"
        layout="prev, pager, next, total, jumper"
        :total="totalList">
      </el-pagination>
    </el-row>

  </div>
</template>

<script>
  import qs from 'qs'
  import {invoiceAdd,invoiceDeal,invoiceDelete,invoiceList,invoiceUpdate,expressDeal} from "../../api/appUser";
  import {goodsOrderList} from "../../api/goods";
  import {orderList} from "../../api/recycleManagement";
  import {cityTreeList} from "../../api/cityManagement";
  import {policy} from "../../api/file";
  import axios from "axios";

  export default {
    name: 'index',
    data() {
      return{
        //处理发票信息配置
        fileUrl:null,
        dealFlag:false,
        dealForm:{
          invoiceType:1,
          invoiceNum:null
        },
        dealRules:{
          invoiceType: [
            { required: true, message: '请选择发票类型', trigger: 'change' }
          ],
          invoiceNum:[
            { required: true, message: '请输入发票单号', trigger: 'blur' }
          ]
        },
        tempFILE:null,

        //处理快递信息配置
        expressFlag:false,
        expressForm:{
          expressNumber:null,
          expressType:null
        },
        expressTypes:[

        ],
        expressRules:{
          expressNumber:[
            { required: true, message: '请输入快递单号', trigger: 'blur' }
          ],
         /* expressType: [
            { required: true, message: '请选择快递类型', trigger: 'change' }
          ],*/
        },


        invoiceId:null,
        orderData:[],
        formSearchInfo:{
          user:null
        },
        cityProps:{
          children: 'subMenus',
          label: 'name',
          value:'cityId',
          checkStrictly: true
        },

        cityData:[],
        users:[],
        organizations:[{id:1,name:'单位'},{id:2,name:"个人"}],
        invoiceTypes:[{id:1,name:'普通发票'},{id:2,name:"电子发票"}],
        searchInfo:{
          applyEndTime:null,
          applyStartTime:null,
          invoiceState:null,
          invoiceType:null,
          userId:null,
        },

        ruleForm: {
          firm:null,
          orderArr:[],
          orderType:1,
          invoiceType:1,
          taxCode: '',
          organization: 1,
          email:null,
          receiver:null,
          receiverAddress:null,
          cityid:null
        },
        rules: {
          taxCode: [
            { required: true, message: '请输入税号', trigger: 'blur' },
            { min: 6,  message: '长度最少 6 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          organization: [
            { required: true, message: '请选择机构类型', trigger: 'change' }
          ],
          invoiceType: [
            { required: true, message: '请选择发票类型', trigger: 'change' }
          ],
          receiver: [
            { required: true, message: '请选择收件人', trigger: 'change' }
          ],
          receiverAddress: [
            { required: true, message: '请填写收件人地址', trigger: 'blur' }
          ],
        },



        formLabelWidth: '120px',
        diaTitle: '',
        addFlag: false,
        tableData: [],
        // 分页配置
        totalList:null,
        pageSize:10,
        currentPage1:1
      };
    },
    watch:{
      'ruleForm.orderType':{
        handler(){
          this.orderData = []
        }
      }
    },
    methods: {
      //快递处理
      dealExpress(info){
        this.expressFlag = true
        this.expressForm.expressNumber = null;
        this.expressForm.expressType = null;
        this.invoiceId = info.invoiceId
      },
      dealExpressHandle(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let prm = {
              "expressNumber": this.expressForm.expressNumber,
              // "expressType": this.expressForm.expressType,
              "expressType": 1,
              "invoiceId": this.invoiceId
            }
            expressDeal(prm).then(res=>{
              if (res.data.code === 200){
                this.$message({
                  type:'success',
                  message:res.data.msg
                })
                this.getList()
                this.expressFlag = false
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //文件上傳
      httpRequest(file){
        console.log("file",file)
        this.tempFILE = file.file
        this.fileUrl = URL.createObjectURL(file.file)
      },
      //處理發票
      dealInvoice(info){
        this.dealFlag = true;
        this.invoiceId = info.invoiceId
        this.dealForm.invoiceNum = null
        this.fileUrl = null
      },
      dealInvoiceHandle(formName){

        this.$refs[formName].validate((valid) => {
          if (valid) {
            let policyPrm = qs.stringify({
              fileNum:1,
              uploadType:5
            })
            policy(policyPrm).then(res=>{
              let {result} = res.data;
              let idx = this.tempFILE.name.lastIndexOf('.')
              let name = this.tempFILE.name.substring(idx)
              let requestData = new FormData();
              let fileId = result.fileIds[0]
              let fileKey = result.dir+fileId+name
              requestData.append('policy',result.policy)
              requestData.append("signature",result.signature)
              requestData.append("ossaccessKeyId",result.accessid)
              requestData.append("key",fileKey)
              requestData.append("dir",result.dir)
              requestData.append("host",result.host)
              requestData.append("file",this.tempFILE)

             axios({
                url:result.host,
                method:'post',
                data:requestData
              }).then(res=>{
               console.log(111,res)
                if (res.status === 204){
                  this.$message({
                    type:"success",
                    message:"文件上传成功！"
                  })
                  var tempUrl = result.host + '/' + fileKey
                  let dealPrm = {
                    "invoiceFile": tempUrl,
                    "invoiceId": this.invoiceId,
                    "invoiceNumber": this.dealForm.invoiceNum,
                    "invoiceType": this.dealForm.invoiceType,
                  }
                  invoiceDeal(dealPrm).then(uploadRes=>{
                    if (res.data.code === 200){
                      this.$message({
                        type:"success",
                        message:'发票处理成功！'
                      })
                      this.getList()
                      this.dealFlag = false
                    }
                  })
                }

               console.log(tempUrl)
             });

            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //城市选择
      cityHandle(v){
        this.ruleForm.cityid = v[v.length-1]
      },
      //重置订单搜索信息
      resetOrderById(){
        this.formSearchInfo.user = null
        this.orderData = []
      },
      // 获取选中订单
      selectOrderHandle(val){
        this.ruleForm.orderArr = []
        if (this.ruleForm.orderType === 1){
         val.forEach(item=>{
           this.ruleForm.orderArr.push(item.commodityOrderId)
         })
        }else{
          val.forEach(item=>{
            this.ruleForm.orderArr.push(item.orderId)
          })
        }
        console.log("select",val)
        console.log("this.ruleForm.orderArr",this.ruleForm.orderArr.join(","))
      },
      //根据ID获取订单
      searchOrderById(){
        if (this.ruleForm.orderType === 1){
          let prm = {
            pageSize:100,
            pageNum:1,
            userUuid:this.formSearchInfo.user
          }
          goodsOrderList(prm).then(res=>{
            this.orderData = res.data.result.list
          })
        }else {
          let prm = {
            pageSize:100,
            pageNum:1,
            userUuid:this.formSearchInfo.user
          }
          orderList(prm).then(res=>{
            this.orderData = res.data.result.list
          })
        }
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      getList(v=1){
        let prm = {
          "pageNum": v,
          "pageSize":this.pageSize,
          "applyEndTime": this.searchInfo.applyEndTime,
          "applyStartTime": this.searchInfo.applyStartTime,
          "invoiceState": this.searchInfo.invoiceState,
          "invoiceType": this.searchInfo.invoiceType,
          // "userId": this.searchInfo.userId,
        }
        invoiceList(prm).then(res=>{
          let {list} = res.data.result
          this.tableData = list
          this.totalList = res.data.result.total
        })
      },
      addOpen(){
        this.addFlag = true;
        this.diaTitle = "添加发票";
        this.orderData = []
        this.ruleForm.cityid = null
        this.ruleForm.firm = null
        this.ruleForm.orderType = 1
        this.ruleForm.orderArr = []
        this.ruleForm.taxCode = null
        this.ruleForm.invoiceType = 1
        this.ruleForm.organization = 1
        this.ruleForm.receiverAddress = null
        this.ruleForm.receiver = null
        this.ruleForm.email = null
        this.fileUrl = null
      },
      editOpen(info){
        this.invoiceId = info.invoiceId
        this.addFlag = true;
        this.diaTitle = "修改信息"
        this.ruleForm.cityid = info.cityid
        this.ruleForm.firm = info.companyName
        this.ruleForm.orderType = info.orderType
        this.ruleForm.orderArr = []
        this.ruleForm.taxCode = info.taxcode
        this.ruleForm.invoiceType = info.invoiceType
        this.ruleForm.organization = info.institutionType
        this.ruleForm.receiverAddress = info.receiverAddress
        this.ruleForm.receiver = info.receiver
        this.ruleForm.email = info.email
        this.fileUrl = info.invoiceFile
      },
      deleteHandle(info){

        this.$confirm('此操作将永久删除该发票信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let prm = qs.stringify({
            invoiceId: info.invoiceId
          });
          invoiceDelete(prm).then(res=>{
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
        if (this.searchInfo.applyStartTime&&this.searchInfo.applyEndTime){
          this.searchInfo.applyStartTime = this.FormatTime(this.searchInfo.applyStartTime)
          this.searchInfo.applyEndTime = this.FormatTime(this.searchInfo.applyEndTime)
        }

        this.getList()
      },
      resetData(){
        this.searchInfo.applyEndTime = null
        this.searchInfo.applyStartTime = null
        this.searchInfo.invoiceState = null
        this.searchInfo.invoiceType = null
        this.searchInfo.userId = null
        this.getList()
      },

      //格式化時間
      FormatTime(d){
        let dd = new Date(d)
        let y = dd.getFullYear()
        let mm = dd.getMonth()+1;
        let day = dd.getDate()
        return `${y}-${mm}-${day}`
      },
      //5717034
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.diaTitle === '添加发票'){
              let prm = {
                "cityid": this.ruleForm.cityid,
                "companyName": this.ruleForm.firm,
                "email": this.ruleForm.email,
                "institutionType": this.ruleForm.organization,
                "invoiceType": this.ruleForm.invoiceType,
                "orderIds": this.ruleForm.orderArr.join(","),
                "orderType": this.ruleForm.orderType,
                "receiver": this.ruleForm.receiver,
                "receiverAddress": this.ruleForm.receiverAddress,
                "taxcode": this.ruleForm.taxCode,
              }
              invoiceAdd(prm).then(res=>{
                if (res.data.code === 200){
                  this.$message({
                    type:'success',
                    message:"添加成功！"
                  })
                  this.getList();
                  this.addFlag = false
                }
              })
            }else{
              let prm = {
                "cityid": this.ruleForm.cityid,
                "companyName": this.ruleForm.firm,
                "email": this.ruleForm.email,
                "institutionType": this.ruleForm.organization,
                "invoiceType": this.ruleForm.invoiceType,
                "orderIds": this.ruleForm.orderArr.join(","),
                "orderType": this.ruleForm.orderType,
                "receiver": this.ruleForm.receiver,
                "receiverAddress": this.ruleForm.receiverAddress,
                "taxcode":this.ruleForm.taxCode,
                invoiceId:this.invoiceId
              }
              invoiceUpdate(prm).then(res=>{
                if (res.data.code === 200){
                  this.$message({
                    type:'success',
                    message:"修改成功！"
                  })
                  this.getList();
                  this.addFlag = false
                }
              })
            }

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
    mounted() {
      let prm = {
        pageSize:10000,
        pageNum:1
      }
      cityTreeList(prm).then(res=>{
        this.cityData = res.data.result.list
      })
      this.getList();
    }
  };
</script>
<style scoped lang="less">
  .user-top{
    margin: 10px 0 20px 0;
  }
  .search-wrapper{
    margin: 20px 0;
  }
  .center-page{
    min-width: 700px;
    display: flex;
    justify-content: center;
  }
  .app-container{
    /deep/.addInvoice{
      width: 100%;
      height: 100%;
      .el-dialog{
        width: 100%;
        height: 100%;
        margin: 0!important;
        .form-search{
          padding-bottom: 15px;
        }
      }
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

    /deep/.avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }


  }
</style>
