<template>
  <div class="app-container">
     <el-row class="user-top">
       <el-button type="primary" plain @click="addOpen">添加回收站</el-button>
     </el-row>
    <el-row class="search-wrapper">
      <el-row>
        <el-input clearable class="search-container" v-model="searchInfo.idNum" placeholder="/证件号码"></el-input>
        <el-input clearable class="search-container" v-model="searchInfo.name" placeholder="/回收站名称"></el-input>
        <el-button style="margin-left: 10px" plain type="primary" @click="searchList">搜索</el-button>
<!--        <el-button style="margin-left: 10px" plain type="warning" @click="resetList">重置</el-button>-->
      </el-row>
    </el-row>
    <el-row class="process-wrapper">
      <el-select v-model="currentAgent" placeholder="请选择代理商">
        <el-option
          v-for="item in agents"
          :key="item.agentId"
          :label="item.name"
          :value="item.agentId">
        </el-option>
      </el-select>
      <el-select v-model="currentIdType" placeholder="请选择证件类型">
        <el-option
          v-for="item in idTypes"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button style="margin-left: 10px" type="success" plain @click="showAll">查看所有</el-button>
    </el-row>

     <el-dialog :title="optTitle" :visible.sync="addFlag">
       <el-form :model="form">
         <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
         </el-form-item>
         <el-form-item label="地址" :label-width="formLabelWidth">
           <el-input v-model="form.address"></el-input>
         </el-form-item>
         <el-form-item label="证件号码" :label-width="formLabelWidth">
           <el-input v-model="form.idNum"></el-input>
         </el-form-item>
         <el-form-item label="证件类型" :label-width="formLabelWidth">
           <el-select v-model="form.idType" placeholder="请选择证件类型">
             <el-option
               v-for="item in idTypes"
               :key="item.id"
               :label="item.name"
               :value="item.id">
             </el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="代理商" :label-width="formLabelWidth">
           <el-select v-model="form.agentId" placeholder="请选择代理商">
             <el-option
               v-for="item in agents"
               :key="item.agentId"
               :label="item.name"
               :value="item.agentId">
             </el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="城市" :label-width="formLabelWidth">
           <el-input @focus="cityHandle" v-model="form.city"></el-input>
         </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="addFlag = false">取 消</el-button>
         <el-button type="primary" @click="saveHandle">确 定</el-button>
       </div>
     </el-dialog>


    <el-dialog class="inner-dialog" title="城市选择" :visible.sync="cityFlag">
      <el-tree
        node-key="cityId"
        :data="cityData"
        :props="defaultProps"
        show-checkbox
        check-strictly
        highlight-current
        @check-change="handleCityItemClick"
        ref="menuTree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cityFlag = false">取 消</el-button>
        <el-button type="primary" @click="getChooseCity">确 定</el-button>
      </div>
    </el-dialog>

    <el-row style="height: 1px;background: #8c939d"></el-row>
    <el-table
      :data="recycles"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        width="100">
      </el-table-column>
      <el-table-column
        prop="agent.name"
        label="代理商"
        width="80">
      </el-table-column>
      <el-table-column
        prop="city.name"
        label="城市"
        width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="160">
        <template slot-scope="scope">
          <el-button @click="editOpen(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteHandle(scope.row)" type="danger" size="small">删除</el-button>
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
  import {agentList} from "../../api/angenManagement";
  import {cityTreeList} from "../../api/cityManagement";
  import {recycleAdd,recycleList,recycleDelete,recycleUpdate} from "../../api/recycleManagement";

  export default {
    data() {
      return {
        checkedId:null,
        currentIdType:null,
        cityFlag:false,
        defaultProps: {
          children: 'subMenus',
          label: 'name'
        },
        cityData:[],
        currentCityInfo:{},

        optTitle:null,

        currentAgent:null,
        agents:[],

        currentCity:null,
        citys:[],
        currentRecycleId:null,
        recycles:[],
        idTypes: [{id:1,name:"身份证"},{id:2,name:'营业执照'}],
        form:{
          name:null,
          address:null,
          agentId:null,
          city:null,
          idType:null,
          idNum:null
        },

        searchInfo:{name:null,idNum:null},
        formLabelWidth: '120px',
        addFlag: false,
        // 分页配置
        pageSize: 10,
        total:0,
        currentPage:1
      };
    },
    watch:{
      currentAgent(v){
       this.getRecycleList()
      },
      currentIdType(v){
        this.getRecycleList()
      }
    },
    methods: {
      cityHandle(){
        this.currentCityInfo = {}
        this.cityFlag = true;
        let prm = {
          pageNum:1,
          pageSize:100,
          parentCityId: 0
        };
        cityTreeList(prm).then(res=>{
          this.cityData = res.data.result.list;
          console.log(res)
        })
      },

      handleCityItemClick(v,checked,node){
        if(checked === true) {
          this.currentCityInfo = v;
          this.checkedId = v.cityId;
          this.$refs.menuTree.setCheckedKeys([v.cityId]);
        } else {
          if (this.checkedId === v.cityId) {
            this.$refs.menuTree.setCheckedKeys([v.cityId]);
          }
        }
      },
      getChooseCity(){
        this.form.city = this.currentCityInfo.name;
        this.cityFlag = false;
      },


      getAgentList(){
        let prm = {
          pageNum:1,
          pageSize:20
        }
        agentList(prm).then(res=>{
          this.agents = res.data.result.list
        })
      },

      getRecycleList(v=1){
        let prm = {
          pageNum:v,
          pageSize:this.pageSize,
          agentId:this.currentAgent,
          idNum:this.searchInfo.idNum,
          name:this.searchInfo.name,
          idType:this.currentIdType
        }
        recycleList(prm).then(res=>{
          this.recycles = res.data.result.list
          this.total = res.data.result.total
        })
      },

      formatDate(date){
        let tt = new Date(date);
        let y = tt.getFullYear();
        let mon = tt.getMonth()+1;
        let d = tt.getDate();
        return `${y}-${mon}-${d}`
      },
      handleCurrentChange(v){
        this.getRecycleList(v)
      },
      addOpen(){
        this.addFlag = true;
        this.optTitle = "添加回收站"
        this.form.address = null;
        this.form.agentId = null;
        this.form.city = null;
        this.form.idNum = null;
        this.form.idType = null;
        this.form.name = null;
      },
      editOpen(info){
        this.addFlag = true;
        this.optTitle = "修改信息"
        this.form.address = info.address;
        this.form.agentId = info.agentId;
        this.form.city = info.city.name;
        this.form.idNum = info.idNum;
        this.form.idType = info.idType;
        this.form.name = info.name;
        this.currentRecycleId = info.recyclerId
      },
      saveHandle(){
        if (this.optTitle === '添加回收站'){
          let prm = {
            "address": this.form.address,
            "agentId": this.form.agentId,
            "cityId": this.currentCityInfo.cityId,
            "idNum": this.form.idNum,
            "idType": this.form.idType,
            "name": this.form.name
          }
          recycleAdd(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message: "添加成功"
              })
              this.getRecycleList();
              this.addFlag = false
            }else{
              this.$message({
                type:"error",
                message:res.data.msg
              })
            }
          })
        }else{
          let prm = {
            "address": this.form.address,
            "agentId": this.form.agentId,
            "cityId": this.currentCityInfo.cityId,
            "idNum": this.form.idNum,
            "idType": this.form.idType,
            "name": this.form.name,
            recyclerId:this.currentRecycleId
          }
          recycleUpdate(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message: "修改成功"
              })
              this.getRecycleList();
              this.addFlag = false
            }else{
              this.$message({
                type:"error",
                message:res.data.msg
              })
            }
          })
        }


      },
      deleteHandle(info){
        this.$confirm('此操作将永久从列表中取消该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let prm = qs.stringify({
            recyclerId: info.recyclerId
          });
          recycleDelete(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"取消成功"
              })
              this.getRecycleList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        });
      },
      searchList(){
        this.getRecycleList()
      },
      showAll(){
        this.searchInfo.name = null;
        this.currentAgent = null
        this.currentIdType = null
        this.searchInfo.idNum = null
        this.getList()
      },

    },
    mounted() {
      this.getAgentList();
      this.getRecycleList();
    }
  };
</script>
<style scoped lang="less">
  .user-top{
    margin: 10px 0 20px 0;
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
  .search-wrapper{
    display: flex;
    min-width: 860px;

    .search-container{
      width: 226px;
      margin: 15px 0;
    }
  }
  .process-wrapper{
     margin: 0 10px 15px 0;
   }
</style>
