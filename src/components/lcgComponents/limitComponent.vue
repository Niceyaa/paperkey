<template>
  <div class="role-limit">
    <el-row class="add-btn">
      <el-button type="primary" @click="addLimitHandle" plain>添加权限</el-button>

      <div class="role-name">{{roleName}}</div>

     <!-- <el-row class="search-wrapper">
        <el-input placeholder="请输入角色id" v-model="searchVal">
          <el-button @click="searchList" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-row>-->

      <el-dialog title="添加角色权限" :visible.sync="addFlag">
        <el-row>

          <el-tree
            ref="limitTree"
            :data="allLimit"
            show-checkbox
            node-key="lcgId"
            default-expand-all
            highlight-current
            :default-checked-keys="defaultLcgId"
            :props="defaultProps">
          </el-tree>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addFlag = false">取 消</el-button>
          <el-button type="primary" @click="getCheckLimit">确 定</el-button>
        </div>
      </el-dialog>


    </el-row>
    <el-table
      border
      :data="allFilterData"
      style="width: 100%">
      <el-table-column
        label="权限编码"
        width="100">
        <template slot-scope="scope">{{scope.row.categoryId?scope.row.permissionCode:scope.row.subPermissionCode}}</template>
      </el-table-column>
      <el-table-column
        label="权限名称"
        width="100"
        prop="name">
      </el-table-column>
      <el-table-column
        label="子权限"
        min-width="100"
        prop="name">
        <template slot-scope="scope">
          <span v-if="!scope.row.subPermissions">-</span>
          <el-tag style="cursor: pointer;margin-left: 5px" v-if="scope.row.subPermissions" v-for="item in scope.row.subPermissions" :key="item.subPermissionId" @click="deleteChildItem(item,scope.row.id)">{{item.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
        align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage1"
      :page-size="pageSize"
      layout="total,  prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import {addRolePermission, findRolePermission, deleteRolePermission, rolesDelete} from "../../api/roleManagement";
  import {permissionList} from "../../api/permissionManagement";
  import {getUserPermission} from "../../api/permissionClassify";

  export default {
    name: "rolesUserComponent",
    data(){
      return{
        roleName:"",

        allFilterData: [],
        selectUserItem: {},
        allLimit:[],
        searchVal: "",
        tableData: [],
        search: '',
        //分页配置
        currentPage1: 1,
        pageSize: 10,
        pageNum: 1,
        total: 0,

        addFlag: false,
        defaultProps: {
          children: 'subPermissions',
          label: 'name'
        },
        allCount:0,
        defaultLcgId:[],
        permissionIdArr:[],
        subPermissionIdArr:[]
      }
    },
    props:['roleId'],
    mounted() {
      console.log(this.defaultLcgId)
      this.getRolePermissionList();
    },
    methods:{
      addId(data){
        for (let i = 0;i<data.length;i++){
          data[i].lcgId = this.allCount++;
          if (data[i].subPermissions&&data[i].subPermissions.length>0){
            this.addId(data[i].subPermissions)
          }
        }
      },
      matchLcgId(all,item){
        console.log("hhhhh",all,item)
        for (let i=0;i<item.length;i++){
          for (let j=0;j<all.length;j++){
            if (item[i].permissionId === all[j].permissionId){
              if (item[i].subPermissions&&item[i].subPermissions.length>0&&all[j].subPermissions&&all[j].subPermissions.length>0){
                console.log("aaaaa",item[i].subPermissions,all[j].subPermissions)
                this.matchLcgId(all[j].subPermissions,item[i].subPermissions);
              }else{
                if (item[i].subPermissionId&&all[j].subPermissionId&&item[i].subPermissionId===all[j].subPermissionId){
                  this.defaultLcgId.push(all[j].lcgId);
                }
              }
            }
          }
        }
      },

      deleteChildItem(info,id){
        console.log(info)
        this.$confirm('此操作将永久删除该子自权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let prm = {
            id: id,
            subPermissionIds:`${info.subPermissionId}`
          }
          deleteRolePermission(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"删除成功"
              })
                  let prm = {
                    "pageNum": 1,
                    "pageSize": this.pageSize,
                    "roleId": this.$route.query.roleId,
                  }
                  findRolePermission(prm).then(res=>{

                    this.allFilterData = []
                    let {result} = res.data;
                    this.tableData = result.list
                    this.total = result.total
                    this.roleName = result.list[0].roleVO.name;
                    this.tableData.forEach(item=>{
                      if (!item.permissionVO){
                        console.log("null")
                      }else{
                        item.permissionVO.id = item.id;
                        item.permissionVO.relateId = item.id;
                        this.allFilterData.push(item.permissionVO)
                      }

                    })
                  })
                }
              })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      getRolePermissionList(){
        let prm = {
          "pageNum": 1,
          "pageSize": this.pageSize,
          "roleId": this.$route.query.roleId,
        }
        findRolePermission(prm).then(res=>{

          this.allFilterData = []
          let {result} = res.data;
          this.tableData = result.list
          this.total = result.total
          this.roleName = result.list[0].roleVO.name;
          this.tableData.forEach(item=>{
            if (!item.permissionVO){
              console.log("null")
            }else{
              item.permissionVO.id = item.id;
              item.permissionVO.relateId = item.id;
              this.allFilterData.push(item.permissionVO)
            }
          })
          console.log("改变之后的数据", this.allFilterData)
        })
      },
      changePermissionArr(data) {
        for (let i = 0;i<data.length;i++){
          if (data[i].lcgId){
            this.permissionIdArr.push(data[i].permissionId);
            this.subPermissionIdArr.push(data[i].subPermissionId)
          }

          /*if (data[i].subPermissions&&data[i].subPermissions.length>0){
            for (let j= 0;j<data[i].subPermissions.length;j++){
              this.subPermissionIdArr.push(data[i].subPermissions[j].subPermissionId)
            }

          }*/
        }
      },
      handleSelectChange(v){
        this.selectUserItem = v;
        console.log(this.selectUserItem)
      },
      handleCurrentChange(val) {
        let prm = {
          "pageNum": val,
          "pageSize": this.pageSize,
          "roleId": this.$route.query.roleId,
        }
        findRolePermission(prm).then(res=>{
          this.allFilterData = []

          let {result} = res.data;
          this.tableData = result.list
          this.total = result.total
          this.roleName = result.list[0].roleVO.name;
          this.tableData.forEach(item=>{
            item.permissionVO.id = item.id;
            item.permissionVO.relateId = item.id;
            this.allFilterData.push(item.permissionVO)
          })
        })
      },
      addLimitHandle(){
        this.defaultLcgId = []
        this.allCount = 0
        this.addFlag = true;
        getUserPermission().then(res=>{
          let {result} = res.data;
          result.forEach(item=>{
            if (item.name.length === 0){
              item.name = "其他";
              item.subPermissions = item.permissions
            }else{
              item.subPermissions = item.permissions
            }
          })
          this.allLimit = result;
          this.addId(this.allLimit);
          for (let i=0;i<this.allLimit.length;i++){
            if (this.allLimit[i].subPermissions.length>0){
              this.matchLcgId(this.allLimit[i].subPermissions,this.allFilterData)
            }

          }
          console.log("new",this.allLimit)
          console.log("array",this.defaultLcgId)
        })

      },
      handleDelete(info){
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let prm = {
            id:parseInt(info.id)
          }
          console.log(prm)
          deleteRolePermission(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"删除成功"
              })
              findRolePermission(prm).then(res=>{
                if (res.data.code === 200){
                  let prm = {
                    "pageNum": 1,
                    "pageSize": this.pageSize,
                    "roleId": this.$route.query.roleId,
                  }
                  findRolePermission(prm).then(res=>{

                    this.allFilterData = []
                    let {result} = res.data;
                    this.tableData = result.list
                    this.total = result.total
                    this.roleName = result.list[0].roleVO.name;
                    this.tableData.forEach(item=>{
                      item.permissionVO.id = item.id;
                      item.permissionVO.relateId = item.id;
                      this.allFilterData.push(item.permissionVO)
                    })
                  })
                }
              })
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      getCheckLimit(){
        let checkItems = this.$refs.limitTree.getCheckedNodes();
        this.permissionIdArr = []
        this.subPermissionIdArr = []

        console.log("选中数据",checkItems)
        this.changePermissionArr(checkItems);
        console.log(this.permissionIdArr)
        console.log(this.subPermissionIdArr)
        let tmpPIds = this.permissionIdArr
        let tmpSPIds = this.subPermissionIdArr
        for (let i = 0;i<tmpPIds.length;i++){
          if (!tmpPIds[i]){
            this.permissionIdArr.splice(i,1)
            i--
          }
        }
        for (let j = 0;j<tmpSPIds.length;j++){
          if (!tmpSPIds[j]){
            this.subPermissionIdArr.splice(j,1)
            j--
          }
        }
        console.log(this.subPermissionIdArr)
        let newPerIds = [...new Set(this.permissionIdArr)];
        let prm = {
          permissionIds:newPerIds.join(","),
          roleId:this.$route.query.roleId,
          subPermissionIds:this.subPermissionIdArr.join(",")
        };
        addRolePermission(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({

              type:"success",
              message:"添加成功"
            })
            let prm = {
              "pageNum": this.pageNum,
              "pageSize": this.pageSize,
              "roleId": this.$route.query.roleId,
            }
            findRolePermission(prm).then(res=>{
              this.allFilterData = []
              let {result} = res.data;
              this.tableData = result.list
              this.total = result.total
              this.roleName = result.list[0].roleVO.name;
              this.tableData.forEach(item=>{
                item.permissionVO.id = item.id;
                item.permissionVO.relateId = item.id;
                this.allFilterData.push(item.permissionVO)
              })
            })
            this.addFlag = false;
          }
        })
      },
      searchList() {

        let prm = {
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          "roleId": this.$route.query.roleId,
        }
        findRolePermission(prm).then(res => {
          this.allFilterData = []
          let {result} = res.data;
          this.tableData = result.list
          this.total = result.total
          console.log(res)
        })
      }
    }
  }
</script>

<style scoped lang="less">
.role-limit{
  padding: 20px;
  .add-btn{
    margin: 10px 0 15px 0;
  }
  .search-wrapper{
    width: 300px;
    margin: 20px 0;
  }
  .role-name{
    font-size: 20px;
    color: #2c3e50;
    font-weight: bold;
    margin: 15px 0;
  }
}
</style>
