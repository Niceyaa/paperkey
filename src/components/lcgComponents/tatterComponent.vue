<template>
    <div class="user-container">
      <div class="left-container">
        <div class="right-title">纸饼信息</div>

        <!--  <el-button class="add-btn" type="primary" plain @click="addBag">添加包裹</el-button>-->
      </div>

      <el-dialog title="添加碎纸" :visible.sync="addFlag">
        <el-form :model="form">
          <el-form-item >
            <el-input v-model="bagId" placeholder="请输入包裹id" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFlag = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
        </div>
      </el-dialog>
      <div class="right-container">
        <div class="right-title">包裹列表</div>

      <!--  <el-button class="add-btn" type="primary" plain @click="addBag">添加包裹</el-button>-->
        <el-table
          :data="bagList"
          type="expand"
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
            prop="receiverUserInfo.userName"
            label="收件人"
            width="120">
          </el-table-column>
          <el-table-column
            prop="paperShredder.shredderUser"
            label="碎纸人"
            min-width="140">
          </el-table-column>
        </el-table>
        <el-row class="finish-wrapper">
          <el-button type="success" plain @click="finishTatter">碎纸完成</el-button>
          <el-button style="margin-right: 15px" type="warning" plain @click="addFlag = true">手动添加包裹</el-button>

        </el-row>

      </div>
    </div>
</template>

<script>
  import qs from 'qs'
  import {tatterAdd,tatterIsFinish,tatterScanCode} from "../../api/recycleManagement";
  import {bagList} from "../../api/bagManagement";

  export default {
      name: "tatterComponent",
      data(){
          return{
            bagId:null,

            bagList:[],
            tatterId:null,
            codeInfo:null,
            tmpInfo:null,

            addFlag:false,
            formLabelWidth:'120px',
            form:{

            }
          }
      },
    watch:{
      tmpInfo(v){
        if (v!==null){
          let prm = {
            paperShredderId:this.tatterId,
            orderPackageId:v.id
          };
          tatterScanCode(prm).then(res=>{
            if (res.data.code === 200){
              this.getBagList()
            }
          })
        }
      }
    },
    methods: {
      getPackageID(){
        this.tmpInfo = JSON.parse(this.codeInfo);
        this.codeInfo = null
      },
      getBagList(){
        let prm = {
          "pageNum": 1,
          "pageSize": 20,
          paperShredderId:this.tatterId
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
      finishTatter(){
        let prm = qs.stringify({
          paperShredderId:this.tatterId
        });
        tatterIsFinish(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:'success',
              message:'碎纸添加完成'
            })
            this.$router.push({
              path:"/recycle/tatter"
            })
          }
        })
      },
      handleAdd(){
        let prm = {
          paperShredderId:this.tatterId,
          orderPackageId:parseInt(this.bagId)
        };
        tatterScanCode(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              message:"添加成功",
              type:'success'
            })
            this.getBagList()
            this.addFlag = false
            this.$nextTick(()=>{
              this.$refs.inputFocus.focus();
            })
          }
        })
      }
    },

    mounted() {
        this.tatterId = this.$route.query.tatterInfo;
        this.tatterId = parseInt(this.tatterId);
        this.getBagList()
    }
  }
</script>

<style scoped lang="less">
.user-container{
  padding: 20px;
  display: flex;
  .left-container{
    min-width: 400px;
    height: 300px;
    background: #3A71A8;
    margin-right: 30px;
  }
  .right-container{
    flex: 1;
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
