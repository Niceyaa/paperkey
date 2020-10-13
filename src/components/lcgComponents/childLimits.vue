<template>
    <div class="user-container">
      <el-row class="user-top" style="margin: 10px 0 15px 0">
        <el-button @click="addHandle" type="primary" plain>添加子权限</el-button>
      </el-row>
      <el-row class="role-title"></el-row>
        <el-table
          border
          :data="tableData"
          style="width: 100%">
          <el-table-column
            label="名称"
            width="100"
            prop="name">
          </el-table-column>
          <el-table-column
            label="编码"
            width="120"
            prop="subPermissionCode">
          </el-table-column>
          <el-table-column
            min-width="130"
            align="center"
          label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="editHandle(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteHandle(scope.row)">刪除</el-button>
            </template>
          </el-table-column>
        </el-table>


      <el-dialog :title="optTitle" :visible.sync="addFlag">
        <el-form :model="form">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="编码" :label-width="formLabelWidth">
            <el-input v-model="form.permissionCode" autocomplete="off"></el-input>
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
  import {
    rolesUserList,
    rolesUserAdd,
    rolesUserDelete,
    deleteRolePermission,
    findRolePermission
  } from "../../api/roleManagement";
    import {permissionChildList,permissionChildAdd,permissionChildDelete,permissionChildEdit} from '../../api/permissionManagement'

    export default {
      name: "childLimits",
      data(){
          return{
            formLabelWidth: "120px",
            form: {name:"",permissionCode:""},
            optTitle: "",
            addFlag: false,
            tableData: [],
            permissionInfo: {},
            currentSubId: null
          }
      },
      mounted() {
        this.permissionId = this.$route.query.permissionId;
        console.log(111,this.permissionId)
        this.getList()
      },
      methods: {
        getList(){
          let prm = {
            pageSize:15,
            pageNum:1,
            permissionId:this.permissionId
          };
          permissionChildList(prm).then(res=>{
            this.tableData = res.data.result.list;
          })
        },
        addHandle() {
          this.optTitle = "添加子权限"
          this.addFlag = true;
          this.form.name = "";
          this.form.permissionCode = "";
        },
        saveHandle() {
          console.log(this.optTitle)
          if (this.optTitle === "修改子权限"){
            let prm = {
              "name": this.form.name,
              "subPermissionId": this.currentSubId,
              "subPermissionCode": this.form.permissionCode
            }
            permissionChildEdit(prm).then(res=>{
              if (res.data.code === 200){
                this.$message({
                  type:"success",
                  message: "修改成功"
                })
                this.addFlag = false
                this.getList()
              }else{
                this.$message({
                  type:"warning",
                  message: res.data.msg
                })
              }
            })
          }else if (this.optTitle === "添加子权限"){
            let prm = {
              "name": this.form.name,
              "permissionId": this.permissionId,
              "subPermissionCode": this.form.permissionCode
            }
            permissionChildAdd(prm).then(res=>{
              if (res.data.code === 200){
                this.$message({
                  type:"success",
                  message: "添加成功"
                })
                this.addFlag = false
                this.getList()
              }else{
                this.$message({
                  type:"warning",
                  message: res.data.msg
                })
              }
            })
          }

        },
        editHandle(info){
          this.currentSubId = info.subPermissionId
          this.optTitle = "修改子权限"
          this.addFlag = true;
          this.form.name = info.name;
          this.form.permissionCode = info.subPermissionCode;
        },
        deleteHandle(info){
          this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let prm = {
              ids: [info.subPermissionId]
            }
            permissionChildDelete(prm).then(res=>{
              if (res.data.code === 200){
                this.$message({
                  type:"success",
                  message:"删除成功"
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
