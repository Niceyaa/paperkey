<template>
  <div class="app-container">

    <el-dialog class="inner-dialog" title="城市选择" :visible.sync="cityFlag">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>

      <el-tree
        class="filter-tree"
        node-key="menuId"
        :data="cityData"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        highlight-current
        @node-click="handleCityItemClick"
        ref="menuTree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerFlag = false">取 消</el-button>
        <el-button type="primary" @click="getChooseCity">确 定</el-button>
      </div>
    </el-dialog>

    <el-row class="search-wrapper">
      <el-col :span="8" style="margin-right: 20px;min-width: 200px">
        <el-input  placeholder="/名称" v-model="search.name">
        </el-input>
      </el-col>
      <el-col :span="8" style="margin-right: 20px;min-width: 200px">
        <el-input  placeholder="/证件号" v-model="search.num">
        </el-input>
      </el-col>
      <el-button plain type="primary" @click="searchList">搜索</el-button>
      <el-button plain type="warning" @click="resetData">重置</el-button>
    </el-row>

    <el-row class="user-top">
      <el-button type="primary" plain @click="addOpen">添加代理商</el-button>
    </el-row>

    <el-dialog :title="diaTitle" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth">
          <el-input @focus="cityHandle" v-model="form.city" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="代理商类型" :label-width="formLabelWidth">
          <el-select v-model="form.agentType" placeholder="请选择证件类型">
            <el-option v-for="item in agentTypes" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件类型" :label-width="formLabelWidth">
          <el-select v-model="form.idType" placeholder="请选择证件类型">
            <el-option v-for="item in idTypes" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" :label-width="formLabelWidth">
          <el-input v-model="form.idNum" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="addLimit">确 定</el-button>
      </div>
    </el-dialog>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
     <!-- <el-table-column
        prop="agentId"
        label="代理商Id"
        width="120">
      </el-table-column>-->
      <el-table-column
        prop="name"
        label="名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="140">
      </el-table-column>
      <el-table-column
        prop="createUser"
        label="创建人"
        width="100">
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
        prop="updateUser"
        label="修改人"
        width="80">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
        width="140">
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
  import {agentList,agentAdd,agentDelete,agentUpdate} from "../../api/angenManagement";
  import {cityTreeList} from "../../api/cityManagement";

  export default {
    name: 'index',
    data() {
      return{
        //城市选择信息配置
        cityFlag:false,
        filterText:"",
        defaultProps: {
          children: 'subMenus',
          label: 'name'
        },
        currentCityInfo:{},
        cityData:[],
        agentTypes:[{id:1,name:'自营'},{id:0,name:"加盟"}],
        search:{name:"",num:""},
        idTypes: [{id:1,name:"身份证"},{id:2,name:'营业执照'}],
        searchVal:null,
        currentAgentId:null,
        currentId: null,
        form: {
          name:'',
          city:null,
          agentType:null,
          address:null,
          createUser:null,
          idType:null,
          idNum:null
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
    methods: {
      handleCityItemClick(v){
        this.currentCityInfo = v;
        console.log(v)
      },

      handleCurrentChange(v){
        this.getList(v)
      },
      cityHandle(){
        this.currentCityInfo = {}
        this.cityFlag = true;
        let prm = {
          pageNum:1,
          pageSize:10
        };
        cityTreeList(prm).then(res=>{
          this.cityData = res.data.result.list;
          console.log(res)
        })
      },
      getChooseCity(){
        this.form.city = this.currentCityInfo.name;
        this.cityFlag = false;
      },


      getList(v=1){
        let prm = {
          "currentPage": v,
          "pageSize":this.pageSize,
        }
        agentList(prm).then(res=>{
          let {list} = res.data.result
          this.tableData = list
          this.totalList = res.data.result.total
        })
      },
      addOpen(){
        this.addFlag = true;
        this.diaTitle = "添加代理商";
        this.form.name = ""
        this.form.sort = null
        this.form.address = ''
        this.form.city = null
        this.form.agentType = null
        this.form.idNum = null
        this.form.idType = null
      },
      editOpen(info){
        this.currentAgentId = info.agentId;
        this.addFlag = true;
        this.diaTitle = "编辑代理商"
        this.form.name = info.name
        this.form.address = info.address
        this.form.city = info.cityName
        this.form.agentType = info.agentType
        this.form.createUser = info.createUser
        this.form.idNum = info.idNum
        this.form.idType = info.idType
      },
      addLimit(){
        if (this.diaTitle === "添加代理商"){
          let prm = {
            name:this.form.name,
            cityId:this.currentCityInfo.cityId,
            agentType:this.form.agentType,
            address:this.form.address,
            // createUser:this.form.createUser,
            idType:this.form.idType,
            idNum:this.form.idNum
          }
          agentAdd(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message: "添加成功"
              })
              this.getList();
              this.addFlag = false
            }
            console.log()
          })
        }else if(this.diaTitle === "编辑代理商"){
          let prm = {
            agentId:this.currentAgentId,
            name:this.form.name,
            cityId:this.currentCityInfo.cityId,
            agentType:this.form.agentType,
            address:this.form.address,
            // createUser:this.form.createUser,
            idType:this.form.idType,
            idNum:this.form.idNum
          }
          agentUpdate(prm).then(res=>{
            this.$message({
              type:"success",
              message: "修改成功"
            })
            this.getList();
            this.addFlag = false
            console.log(res)
          })
        }
      },
      deleteHandle(info){

        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let prm = qs.stringify({
            contactId: info.agentId
          });
          agentDelete(prm).then(res=>{
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
      async searchList(){
        this.listLoading = true;
        let prm = {
          "currentPage": 1,
          "pageSize": this.pageSize,
          name: this.search.name,
          idNum: this.search.num
        }
        this.search.name = ''
        this.search.num = ''
        const {
          data
        } = await agentList(prm);
        let {list} = data.result
        this.tableData = list
        this.totalList = data.result.total;
        console.log("result:", data);
        this.listLoading = false
      },
      resetData(){
        this.getList()
      }
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
  .search-wrapper{
    margin: 20px 0;
  }
  .center-page{
    min-width: 700px;
    display: flex;
    justify-content: center;
  }
</style>
