<template>
  <div class="user-container">
    <div class="right-container">
      <div class="right-title">纸饼列表</div>

      <el-table
        :data="pillData"
        style="width: 100%">
        <el-table-column
          prop="paperPillsNumber"
          label="纸饼编号"
          width="300">
          <template slot-scope="scope">
            <span v-if="scope.$index !== (pillData.length-1)">{{scope.row.paperPillsNumber}}</span>
            <el-input v-else @keydown.enter.native="getPackageID" ref="inputFocus" v-model="codeInfo"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="paperPillsWeight"
          label="纸饼重量"
          min-width="400">
        </el-table-column>
      </el-table>
      <el-row class="finish-wrapper">
        <el-button type="success" plain @click="finishZip">装车完成</el-button>
      </el-row>

    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  import {pillAdd,pillList,scanCodeAddPill,outBoundFinish} from "../../api/recycleManagement";

  export default {
    name: "tatterComponent",
    data(){
      return{
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
            "paperPillsId": v.id,
            "paperWarehouseOutId": this.compressId,
          };
          scanCodeAddPill(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:res.data.msg
              })
              this.getPillList()
            }
          })
        }
      }
    },
    methods: {
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

      getPillList(){
        let prm = {
          paperWarehouseOutId:this.compressId,
          pageSize: 20,
          pageNum:1
        }
        pillList(prm).then(res=>{
          this.pillData = res.data.result.list;
          this.pillData.push({
            paperPillsNumber:null,
            paperPillsWeight:null
          });
          this.$nextTick(()=>{
            this.$refs.inputFocus.focus();
          })
        })
      },
      finishZip(){
        let prm = qs.stringify({
          paperWarehouseOutId:this.compressId
        });
        outBoundFinish(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:'success',
              message:'装车完成'
            })
            this.$router.push({
              path:"/recycle/outBound"
            })
          }
        })
      }
    },
    mounted() {
      this.compressId = this.$route.query.infoId;
      this.compressId = parseInt(this.compressId)
      this.getPillList()
    }
  }
</script>

<style scoped lang="less">
  .user-container{
    padding: 20px;

    .right-container{
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
