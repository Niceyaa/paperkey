<template>
  <div class="app-container">
    <el-row class="add-btn">
      <el-button type="primary" @click="addRoleTrue">添加角色</el-button>

      <el-row class="search-wrapper">
        <el-input placeholder="/名称" v-model="searchInfo.name"></el-input>
        <el-input style="margin-left: 15px" placeholder="/编码" v-model="searchInfo.roleCode"></el-input>
        <el-button plain style="margin-left: 15px" @click="searchList" type="primary">搜索</el-button>
        <el-button plain type="warning" @click="resetList">重置</el-button>
      </el-row>

      <el-dialog :title="optTitle" :visible.sync="addVisible">
        <el-form :model="addFormData">
          <el-form-item label="角色名" :label-width="formLabelWidth">
            <el-input v-model="addFormData.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色編碼" :label-width="formLabelWidth">
            <el-input v-model="addFormData.codeName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="代理商" :label-width="formLabelWidth">
            <el-select v-model="addFormData.agent" placeholder="请选择代理商">
              <el-option v-for="item in agents" :label="item.name" :value="item.agentId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="addHandle">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
    <el-table
      border
      :data="rolesList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%">
      <el-table-column
        align="center"
        label="角色ID"
        width="100"
        prop="roleId">
      </el-table-column>
      <el-table-column
        align="center"
        label="名称"
        width="100"
        prop="name">
      </el-table-column>
      <el-table-column
        align="center"
        label="角色编码"
        width="100"
        prop="roleCode">
      </el-table-column>
      <el-table-column
        align="center"
        label="代理商"
        width="100"
        prop="agentVo.name">
      </el-table-column>
     <!-- <el-table-column
        align="center"
        label="权限"
        width="140">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="openLimitCom(scope.row)">查看</el-button>
        </template>

      </el-table-column>
      <el-table-column
        align="center"
        label="用户"
        width="140">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="openUserCom(scope.row)">查看</el-button>
        </template>
      </el-table-column>-->
      <el-table-column
        label="操作"
        min-width="300"
        align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="openUserCom(scope.row)">角色用户</el-button>
          <el-button
            size="mini"
            type="success"
            @click="openLimitCom(scope.row)">角色权限</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="editRoleInfo(scope.row)">編輯</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteRoleInfo(scope.row)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>


  import {rolesList,rolesAdd,rolesDelete,rolesUpdate} from "../../api/roleManagement";
  import {agentList} from "../../api/angenManagement";

  export default {

    name: 'index',
    data() {
      return {
        searchInfo:{name:"",roleCode:""},

        editId: null,
        optTitle: "",
        optType: '',
        agents: [],
        currentRoleLimitId: null,
        currentRoleId: null,

        editInfo: {},// 編輯角色信息
        addFormData: {
          name: '',
          agent: null,
          codeName: ""

        },
        formLabelWidth: '120px',
        addVisible: false,
        rolesList: [],
        search: '',
        //分页配置
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4,
        pageSize:10,
        total:0,

        userVisible:false,
        limitVisible: false,
        editVisible: false
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList(i=1){
        let prm = {
          pageNum:i,
          pageSize: this.pageSize
        }
        rolesList(prm).then(res=>{
          let {data} = res;
          let {result} = data;
          this.total = result.total;
          this.rolesList = result.list;
          console.log("res",res);
        }).catch(err=>{
          console.log(err)
        })
      },
      handleNodeClick(data) {
        console.log(data);
      },
      openUserCom(info){
        console.log(info);
        this.$router.push({
          path:'/roleUser',
          query:{
            roleId: info.roleId,
            name: info.name
          }
        })
      },
      openLimitCom(info){

        this.$router.push({
          path:'/roleLimit',
          query:{
            roleId: info.roleId
          }
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.getList(val);
      },

      editRoleInfo(info){
        this.addFormData.agent = info.agentId;
        this.addFormData.name = info.name;
        this.addFormData.codeName = info.roleCode;
        this.editId = info.roleId;
        this.optType = "edit";
        this.optTitle = "修改信息";
        this.addVisible = true;
      },
      addHandle(){
        if (this.optType === "add"){
          let  prm = {
            "agentId": this.addFormData.agent,
            "name": this.addFormData.name,
            "roleCode": this.addFormData.codeName,
          }
          rolesAdd(prm).then(res=>{
            console.log("add",res);
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"添加成功"
              })
              this.getList();
              this.addVisible = false;
            }
          });
        }else if (this.optType === "edit"){
          let  prm = {
            "agentId": this.addFormData.agent,
            "name": this.addFormData.name,
            "roleCode": this.addFormData.codeName,
            roleId: this.editId
          }
          rolesUpdate(prm).then(res=>{
            console.log("add",res);
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"修改成功"
              })
              this.getList();
              this.addVisible = false;
            }
          });
        }

      },
      deleteRoleInfo(info){
        console.log(info)
        let id = info.roleId;
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          rolesDelete({
            ids:[id]
          }).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      addRoleTrue(){
        this.optType = "add";
        this.optTitle = "添加信息";
        this.addVisible = true;
        let prm = {
          pageNum:1,
          pageSize:20
        };
        agentList(prm).then(res=>{
          let {result} = res.data;
          this.agents = result.list;
        })
      },
      searchList(){
        let prm = {
          pageNum:1,
          pageSize: this.pageSize,
          name:this.searchInfo.name,
          roleCode:this.searchInfo.roleCode
        }
        rolesList(prm).then(res=>{
          let {data} = res;
          let {result} = data;
          this.total = result.total;
          this.rolesList = result.list;
          console.log("res",res);
        }).catch(err=>{
          console.log(err)
        })
      },
      resetList(){
        this.getList();
        this.searchInfo.name = ""
        this.searchInfo.roleCode = ""
      }
    }
  };
</script>

<style scoped lang="less">
  .el-pagination{
    padding: 20px 0px;
  }
  .app-container{
    .add-btn{
      margin: 0 0 15px 0;
    }
    .self-padding{
      padding-top: 0;
    }
    .search-wrapper{
      width: 700px;
      margin: 20px 0;
      display: flex;
    }
  }
</style>
