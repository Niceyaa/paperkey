<template>
  <div class="user-container">
    <div class="right-container" style="margin-right: 20px">
      <div class="right-title">纸饼列表</div>

      <el-dialog title="添加纸饼" :visible.sync="addFlag">
        <el-form :model="form">
          <el-form-item label="纸饼编号" :label-width="formLabelWidth">
            <el-input v-model="form.packageNum" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="纸饼重量" :label-width="formLabelWidth">
            <el-input v-model="form.weight" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFlag = false">取 消</el-button>
          <el-button type="primary" @click="addPillInfo">确 定</el-button>
        </div>
      </el-dialog>

      <el-table
        :data="pillData"
        style="width: 100%">
        <el-table-column
          prop="paperPillsNumber"
          label="纸饼编号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="paperPillsWeight"
          label="纸饼重量"
          min-width="120">
        </el-table-column>
      </el-table>
      <el-row class="finish-wrapper">
        <el-button type="success" plain @click="addOpen">添加纸饼</el-button>
      </el-row>
    </div>
    <el-dialog title="添加包裹" :visible.sync="handFlag">
      <el-form :model="form">
        <el-form-item >
          <el-input v-model="bagId" placeholder="请输入包裹id" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handFlag = false">取 消</el-button>
        <el-button type="primary" @click="handAdd">确 定</el-button>
      </div>
    </el-dialog>
    <div class="right-container">
      <div class="right-title">包裹列表</div>

      <el-table
        :data="bagList"
        style="width: 100%">
        <el-table-column
          prop="packageSort"
          label="包裹序号"
          width="120">
          <template slot-scope="scope">
            <span v-if="scope.$index !== (bagList.length-1)">{{scope.row.packageSort}}</span>
            <el-input v-else @keydown.enter.native="getPackageID" ref="inputFocus" v-model="codeInfo"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="packageNum"
          label="包裹编号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="paperCompress.operateUser"
          label="压缩人"
          min-width="140">
        </el-table-column>
      </el-table>
      <el-row class="finish-wrapper">
        <el-button type="success" plain @click="finishZip">压缩完成</el-button>
        <el-button style="margin-right: 15px" type="warning" plain @click="handFlag = true">手动添加包裹</el-button>
      </el-row>

    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  import {paperZipFinish,paperZipScanCode} from "../../api/recycleManagement";
  import {pillAdd,pillList} from "../../api/recycleManagement";
  import {bagList} from "../../api/bagManagement";

  export default {
    name: "tatterComponent",
    data(){
      return{
        bagId: null,
        handFlag:false,

        addFlag:false,
        formLabelWidth:"120px",
        form:{
          weight:null,
          packageNum:null
        },

        bagList:[],
        compressId:null,
        codeInfo:null,
        tmpInfo:null,
        pillData:[]
      }
    },
    watch:{
      tmpInfo(v){
        if (v!==null){
          let prm = {
            paperCompressId:this.compressId,
            orderPackageId:v.id
            // orderPackageId:1
          };
          paperZipScanCode(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:res.data.msg
              })
              this.getBagList()
            }
          })
        }
      }
    },
    methods: {
      addOpen(){
        this.addFlag = true;
        this.form.weight = null
        this.form.packageNum = null
      },
      addPillInfo(){
        let prm = {
          paperCompressId:this.compressId,
          paperPillsNumber:this.form.packageNum,
          paperPillsWeight:Number(this.form.weight)
        }
        pillAdd(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:'success',
              message:'添加完成'
            })
            this.getPillList()
            this.addFlag = false
          }
        })
      },
      getPackageID(){
        this.tmpInfo = JSON.parse(this.codeInfo);
        this.codeInfo = null
      },
      getBagList(){
        let prm = {
          "pageNum": 1,
          "pageSize": 20,
          paperCompressId:this.compressId
        }
        bagList(prm).then(res=>{
          this.bagList = res.data.result.list;
          this.bagList.push({
            packageNum:null,
            paperShredder:null,
            receiverUserInfo:null
          });
          this.$nextTick(()=>{
            this.$refs.inputFocus.focus();
          })
        })
      },
      getPillList(){
        let prm = {
          paperCompressId:this.compressId,
          pageSize: 20,
          pageNum:1
        }
        pillList(prm).then(res=>{
          this.pillData = res.data.result.list;
        })
      },
      finishZip(){
        let prm = qs.stringify({
          paperCompressId:this.compressId
        });
        paperZipFinish(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:'success',
              message:'压缩记录添加完成'
            })
            this.$router.push({
              path:"/recycle/paperCompress"
            })
          }
        })
      },
      handAdd(){
        let prm = {
          paperCompressId:this.compressId,
          // orderPackageId:v.id
          orderPackageId:parseInt(this.bagId)
        };
        paperZipScanCode(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:"success",
              message:res.data.msg
            })
            this.handFlag = false
            this.getBagList()
            this.$nextTick(()=>{
              this.$refs.inputFocus.focus();
            })
          }
        })
      }
    },
    mounted() {
      this.compressId = this.$route.query.compressId;
      this.compressId = parseInt(this.compressId)
      this.getBagList()
      this.getPillList()
    }
  }
</script>

<style scoped lang="less">
  .user-container{
    padding: 20px;
    display: flex;
    .left-container{
      flex: .5;
      margin-right: 30px;
    }
    .right-container{
      flex: .5;
      padding: 10px;
      box-shadow: 1px 1px 4px lightgray;
      .right-title{
        font-size: 18px;
        font-weight: bold;
      }
      .add-btn{
        margin: 15px 0;
      }
      .finish-wrapper{
        margin: 20px 0;
        .el-button{
          float: right;
        }
      }
    }
  }
</style>
