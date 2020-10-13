<template>
    <div class="user-container">
      <el-row class="user-btn">
        <el-button
          type="primary"
          plain
          @click="addHandle">添加用户</el-button>

      </el-row>

      <div class="role-name">{{roleName}}</div>

      <!--<el-row class="search-wrapper">
        <el-input placeholder="请输入内容" v-model="searchVal">
          <el-button @click="searchList" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-row>
-->
      <el-row class="role-title"></el-row>
        <el-table
          border
          :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%">
          <el-table-column
            label="用户ID"
            width="80"
            prop="sysUserVo.sysUserId">
          </el-table-column>
          <el-table-column
            label="用户名"
            width="100"
            prop="sysUserVo.userName">
          </el-table-column>
          <el-table-column
            label="代理商"
            width="120"
            prop="sysUserVo.agentId">
          </el-table-column>
          <el-table-column
            label="帐号"
            width="150"
            prop="sysUserVo.userAccount">
          </el-table-column>
          <el-table-column
            align="center"
            label="状态"
            width="200"
            prop="sysUserVo.state">
            <template slot-scope="scope">
              <el-switch style="display: block" disabled v-model="scope.row.state===0" active-color="#13ce66" inactive-color="#ff4949" active-text="on" inactive-text="off">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            min-width="130"
            align="center"
          label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="deleteUser(scope.row)">刪除</el-button>
            </template>
          </el-table-column>
        </el-table>
      <el-row class="center-page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage1"
          :page-size="pageSize"
          layout="prev, pager, next, total"
          :total="total">
        </el-pagination>
      </el-row>

      <el-dialog title="添加角色用户" :visible.sync="addFlag">
        <el-table
          ref="multipleTable"
          :data="allUser"
          style="width: 100%"
          highlight-current-row
          @current-change="handleCurrentChange">
          <el-table-column
            prop="userName"
            label="用户名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="agentId"
            label="代理商"
            width="120">
          </el-table-column>
          <el-table-column
            prop="userAccount"
            label="账号"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>

        <el-row class="center-page">
          <el-pagination
            @current-change="innerPageChange"
            :current-page.sync="innerCurrentPage1"
            :page-size="innerPageSize"
            layout="prev, pager, next, total"
            :total="innerTotalList">
          </el-pagination>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addFlag = false">取 消</el-button>
          <el-button type="primary" @click="saveHandle">确 定</el-button>
        </div>
      </el-dialog>



    </div>
</template>

<script>
    import {rolesUserList,rolesUserAdd,rolesUserDelete} from "../../api/roleManagement";
    import {userList} from "../../api/userManagement";
    import qs from "qs";
    import {agentDelete} from "../../api/angenManagement";

    export default {
      name: "rolesUserComponent",
      data(){
          return{
            searchVal: '',
            addFlag: false,


            roleId:this.$route.query.roleId,
            roleName:this.$route.query.name,
            tableData: [],
            search: '',
            //分页配置
            currentPage1: 1,
            pageSize: 10,
            pageNum: 1,
            total: 0,


            allUser: [],
            multipleSelection: [],
            innerCurrentPage1: 1,
            innerPageSize: 10,
            innerTotalList: 10,

            selectUserItem: {}
          }
      },
      mounted() {
       this.getList();
      },
      methods:{
        getList(idx=1){
          let prm = {
            "pageNum": idx,
            "pageSize": this.pageSize,
            "roleId": parseInt(this.roleId)
          }
          rolesUserList(prm).then(res=>{
            let {result} = res.data;
            this.total = result.total;
            this.tableData = result.list;
            console.log("user",result)
          })
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.getList(val)
        },
        addHandle(){
          this.addFlag = true;
          let prm = {
            "currentPage": 1,
            "pageSize": this.innerPageSize,
          };
          userList(prm).then(res=>{
            let {result} = res.data;
            this.allUser = result.list
            this.innerTotalList = result.total;
          })
        },
        handleCurrentChange(v){
          this.selectUserItem = v;
          console.log(this.selectUserItem)
        },
        innerPageChange(v){
          let prm = {
            "currentPage": v,
            "pageSize": this.innerPageSize,
          };
          userList(prm).then(res=>{
            let {result} = res.data;
            this.allUser = result.list
            this.innerTotalList = result.total;
          })
        },
        saveHandle(){
          let prm = {
            userId: this.selectUserItem.sysUserId,
            roleId: parseInt(this.roleId)
          };
          rolesUserAdd(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"添加成功"
              })
              this.getList();
              this.addFlag = false;
            }
          })
        },
        deleteUser(info){



          this.$confirm('此操作将永久删除当前角色下的该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {


            let prm = {
              ids: [info.id]
            };
            rolesUserDelete(prm).then(res=>{
              if (res.data.code === 200){
                this.$message({
                  type:"success",
                  message: "删除成功"
                })
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
        searchList(){
          let prm = {
            "pageNum": 1,
            "pageSize": this.innerPageSize,
            userId: parseInt(this.searchVal),
            "roleId": parseInt(this.roleId)
          };
          rolesUserList(prm).then(res=>{
            let {result} = res.data;
            this.tableData = result.list
            this.innerTotalList = result.total;
          })
        }
      }
    }
</script>

<style scoped lang="less">
.user-container{
  padding: 20px;
  .user-btn{
    margin: 10px 0 20px 0;
  }
  .role-name{
    font-size: 20px;
    color: #2c3e50;
    font-weight: bold;
    margin: 15px 0;
  }
  .search-wrapper{
    width: 300px;
    margin: 20px 0;
  }
  .center-page{
    display: flex;
    justify-content: center;
  }
  .el-table [class*=el-table__row--level] .el-table__expand-icon{
    margin-left: -8px!important;
  }
}
</style>
