<template>
<div class="app-container">
    <el-row class="user-top">
        <el-button type="primary" plain @click="handleAdd">添加用户</el-button>
    </el-row>


  <el-row class="search-wrapper">
    <el-input placeholder="/名称" v-model="searchInfo.name"></el-input>
    <el-input style="margin-left: 15px" placeholder="/账号" v-model="searchInfo.count"></el-input>
    <el-button plain style="margin-left: 15px" @click="searchList" type="primary">搜索</el-button>
    <el-button plain type="warning" @click="resetList">重置</el-button>
  </el-row>

    <el-table border :data="usersList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" style="width: 100%">
        <el-table-column align="center" label="用户ID" width="100" prop="sysUserId">
        </el-table-column>
        <el-table-column align="center" label="用户名" width="100" prop="userName">
        </el-table-column>
        <el-table-column align="center" label="帐号" width="140" prop="userAccount">
        </el-table-column>
        <el-table-column align="center" label="状态" width="200">
            <template slot-scope="scope">
                <el-switch @change="changeUserState(scope.row)" style="display: block" v-model="scope.row.state===0" active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用">
                </el-switch>
            </template>

        </el-table-column>
        <!--<el-table-column align="center" label="代理商" width="100" prop="agentId">
        </el-table-column>-->
        <el-table-column align="center" label="密码" width="100">
            <template slot-scope="scope">
                <el-button @click="resetPassword(scope.row)" size="mini" type="warning">重置</el-button>
            </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200" align="center">
            <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleEdit(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
  <el-row class="center-page">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage1"
      :page-size="pageSize"
      layout="prev, pager, next, total"
      :total="totalList">
    </el-pagination>
  </el-row>


    <el-dialog :title="optTitle" :visible.sync="addFlag">
        <el-form :model="form">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="form.userName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="帐号" :label-width="formLabelWidth">
                <el-input v-model="form.userAccount" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="optTitle==='添加用户'" label="密碼" :label-width="formLabelWidth">
                <el-input v-model="form.password" autocomplete="off" type="password"></el-input>
            </el-form-item>
            <el-form-item label="代理商" :label-width="formLabelWidth">
                <el-select v-model="form.agentId" placeholder="请选择代理商">
                    <el-option v-for="item in agents" :label="item.name" :value="item.agentId"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addFlag = false">取 消</el-button>
            <el-button type="primary" @click="saveHandle">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import qs from "qs"
import {
    userList,
    addUser,
    resetPwd,
    changeInfo,
    updateState
} from '@/api/userManagement'
import {agentList} from "../../api/angenManagement";

export default {
    name: 'index',
    data() {
        return {
          searchInfo: {name:"",count:""},
            agents: [],
            optTitle: "",
            addFlag: false,
            // 編輯信息配置
            form: {
                userName: '',
                userAccount: '',
                agentId: [],
                password: ''
            },
            formLabelWidth: '120px',
            usersList: [],
            search: '',
            //分页配置
            currentPage1: 1,
            pageSize: 10,
            totalList: 10
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        async getList(i=1) {
            this.listLoading = true;
            let prm = {
                "pageNum": i,
                "pageSize": this.pageSize,
            }
            const {
                data
            } = await userList(prm);
            const {
                result
            } = data;
            this.totalList = result.total;
            this.usersList = result.list;
            console.log("result:", data);
            this.listLoading = false
        },
        handleNodeClick(data) {
            console.log(data);
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          this.getList(val)
        },
        handleEdit(info) {
          console.log(info)
          this.addFlag = true;
          this.optTitle = "修改信息";
          this.form.userName = info.userName;
          this.form.agentId = info.agentId;
          this.form.userAccount = info.userAccount;
        },
        changeUserState(info) {
            let prm = qs.stringify({
                state: info.state ? 0 : 1,
                userId: parseInt(info.sysUserId)
            })
            updateState(prm).then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.getList(1);
                }
            })
        },
        resetPassword(info) {
            let prm = qs.stringify({
                userId: info.sysUserId
            })
            resetPwd(prm).then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    message: '恭喜你，重置成功',
                    type: 'success'
                  })
                }
                console.log(res);
            }).catch(err => {
                console.log(err)
            })
        },
        handleAdd() {
            this.addFlag = true;
            this.optTitle = "添加用户";
          this.form.userName = null;
          this.form.agentId = null;
          this.form.userAccount = null;
            let prm = {
              pageNum:1,
              pageSize:20
            };
            agentList(prm).then(res=>{
              let {result} = res.data;
              this.agents = result.list;
            })
        },
      saveHandle(){
          if (this.optTitle === "添加用户"){
            if (this.form.userName.length>0&&this.form.userAccount.length>0&&this.form.password.length>5&&this.form.password.length<12&&this.form.agentId!==null){
              let prm = {
                userName: this.form.userName,
                userAccount: this.form.userAccount,
                password: this.form.password,
                agentId: this.form.agentId
              };
              addUser(prm).then(res=>{
                if (res.data.code === 200){
                  this.$message({
                    type:"success",
                    message:"添加成功"
                  });
                  this.getList(1);
                  this.addFlag = false
                }
                console.log("adduser",res)
              })
            }else{
              this.$message.error("请将信息填写完整")
            }
          }else if (this.optTitle === "修改信息"){
            if (this.form.userName.length>0&&this.form.userAccount.length>0&&this.form.agentId!==null){
              let prm = {
                userName: this.form.userName,
                userAccount: this.form.userAccount,
                userId: localStorage.getItem('userId'),
                agentId: this.form.agentId
              };
              changeInfo(prm).then(res=>{
                if (res.data.code === 200){
                  this.$message({
                    type:"success",
                    message:"修改成功"
                  });
                  this.getList(1);
                  this.addFlag = false
                }
              })
            }else{
              this.$message.error("请将信息填写完整")
            }
          }
      },
      async searchList(){

          this.listLoading = true;
          let prm = {
            "pageNum": 1,
            "pageSize": this.pageSize,
            userName: this.searchInfo.name,
            userAccount: this.searchInfo.count,
          }
          const {
            data
          } = await userList(prm);
          const {
            result
          } = data;
          this.totalList = result.total;
          this.usersList = result.list;
          console.log("result:", data);
          this.listLoading = false
        },
      resetList(){
          this.getList()
      }
      }

}
</script>

<style lang="less" scoped>
.edit-input {
    padding-right: 100px;
}

.cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
}

.user-top {
    margin: 20px 0;
}

  .search-wrapper{
    width: 700px;
    margin: 20px 0;
    display: flex;
  }
  .center-page{
    display: flex;
    justify-content: center;
  }
</style>
