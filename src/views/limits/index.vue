<template>
  <div class="app-container">

    <el-dialog :title="diaTitle" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" :label-width="formLabelWidth">
          <el-input v-model="form.permissionCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="hasChildFlag" label="权限类型" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择权限类型">
            <el-option v-for="item in limitTYPE" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="hasChildFlag" label="权限分类" :label-width="formLabelWidth">
          <el-select v-model="form.categoryId" placeholder="请选择权限分类">
            <el-option v-for="item in limitType" :label="item.name" :value="item.categoryId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="addLimit">确 定</el-button>
      </div>
    </el-dialog>

    <div class="top-wrapper">


      <el-row class="user-top" style="margin-bottom: 20px">
        <el-button @click="addHandle" type="primary" plain>添加权限</el-button>
      </el-row>
      <el-select v-model="currentId" placeholder="请选择">
      <el-option
        v-for="item in categoryData"
        :key="item.categoryId"
        :label="item.name"
        :value="item.categoryId">
      </el-option>
    </el-select>
    </div>

    <div class="content-container">

      <div class="right-container">
<!--        <el-row class="title">{{roleName}}</el-row>-->
        <el-table
          :data="limitData"
          border
          style="width: 100%">
          <el-table-column
            prop="name"
            label="权限名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="permissionCode"
            label="权限编码"
            width="120">
            <template slot-scope="scope">{{scope.row.subPermissions?scope.row.permissionCode:scope.row.subPermissionCode}}</template>
          </el-table-column>
          <!--<el-table-column
            prop="categoryName"
            label="分类名称"
            width="120">
          </el-table-column>-->
          <el-table-column
            label="子权限"
            min-width="120">
            <template slot-scope="scope">
              <el-tag style="margin-left: 5px" v-for="item in scope.row.subPermissions" :key="item.subPermissionId">{{item.name}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="260">
            <template slot-scope="scope">
              <el-button @click="editLimit(scope.row)" size="mini" type="primary">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteChildLimit(scope.row)">删除</el-button>
              <el-button size="mini" type="warning" @click="addChildLimit(scope.row)">管理子权限</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>
  </div>
</template>

<script>
  import {permissionList,permissionAdd,permissionEdit,permissionDelete,permissionChildAdd,permissionChildDelete,permissionChildEdit} from "../../api/permissionManagement";
  import {getList} from "../../api/permissionClassify";

  export default {
    name: 'index',
    data() {
      return {
        categoryData:[],
        roleName:"",
        limitData: [],
        currentId: null,



        searchVal: '',
        subPermissionId: null,
        hasChildFlag: false,
        limitTYPE: [
          {id:0,name:"无"},
          {id:1,name:"区域"},
          {id:2,name:"代理商"}
        ],
        permissionId: null,
        diaTitle: "",
        operateType: "add",
        limitType: [],
        addFlag: false,

        defaultProps: {
          children: 'subPermissions',
          label: 'name'
        },
        limitList: [],
        form: {
          name: '',
          type: [
          ],
          permissionCode: "",
          categoryId: []
        },
        formLabelWidth: '120px'
      };
    },
    watch:{
      currentId(v){
        if (v === "a"){
          let prm = {
            pageSize:10,
            pageNum:0
          };
          permissionList(prm).then(res=>{
            this.limitData = res.data.result.list;
          })
        }else{
          let prm = {
            pageSize:10,
            pageNum:1,
            categoryId:this.currentId
          };
          permissionList(prm).then(res=>{
            this.limitData = res.data.result.list;
          })
        }



      }
    },
    methods: {
      getList(){
        getList().then(res=>{
          this.categoryData = res.data.result;
          this.categoryData.push({name:"所有",categoryId:"a"})
          // this.currentId = this.categoryData[0].categoryId;
          this.getLimitList()
          console.log(11111,this.categoryData)
        })
      },
      getLimitList(id){
        permissionList({
          pageSize:10,
          pageNum:1,
          categoryId:id
        }).then(res=>{
          let {result} = res.data;
          this.limitData = result.list
          console.log("this.limitList",this.limitList)
        }).catch(err=>{
          console.log("err",err)
        })
      },
      getCheckLimit(){
        console.log(this.$refs.limitTree.getCheckedNodes())
      },
      addLimit(){
        if (this.hasChildFlag){
          console.log("一级目录")
          if (this.form.permissionCode.length>0&&this.form.name.length>0&&this.form.type!=null&&this.form.categoryId!=null){
            let prm = {
              "permissionCode": this.form.permissionCode,
              "name": this.form.name,
              "type": this.form.type,
              categoryId: this.form.categoryId
            };
            if (this.operateType === "add"){
              permissionAdd(prm).then(res=>{
                if (res.data.code === 200){
                  this.$message({
                    message: '恭喜你，添加成功',
                    type: 'success'
                  })
                  this.getLimitList(this.currentId);
                  this.addFlag = false;
                }
              })
            }else if (this.operateType === "edit"){
              permissionEdit({
                "permissionCode": this.form.permissionCode,
                "name": this.form.name,
                "type": this.form.type,
                "permissionId": this.permissionId,
                categoryId: this.form.categoryId
              }).then(res=>{
                if (res.data.code === 200){
                  this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success'
                  })
                  this.getLimitList(this.currentId);
                  this.addFlag = false;
                }
              })
            }

          }else{
            this.$message.error("请认真填写信息！")
          }
        }else{
          console.log("子级目录")
          if (this.form.permissionCode.length>0&&this.form.name.length>0){
            let prm = {
              "subPermissionCode": this.form.permissionCode,
              "name": this.form.name,
              permissionId: this.permissionId
            };
            if (this.operateType === "add"){
              permissionChildAdd(prm).then(res=>{
                if (res.data.code === 200){
                  this.$message({
                    message: '恭喜你，添加成功',
                    type: 'success'
                  })
                  this.getLimitList(this.currentId);
                  this.addFlag = false;
                }
              })
            }else if (this.operateType === "edit"){
              permissionChildEdit({
                // permissionId:this.permissionId,
                "subPermissionCode": this.form.permissionCode,
                "name": this.form.name,
                "subPermissionId": this.subPermissionId,
              }).then(res=>{
                if (res.data.code === 200){
                  this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success'
                  })
                  this.getLimitList(this.currentId);
                  this.addFlag = false;
                }
              })
            }

          }else{
            this.$message.error("请认真填写信息！")
          }
        }


      },
      addHandle(){
        this.hasChildFlag = true;
        this.form.name = null;
        this.form.permissionCode = null;
        this.form.type = null;
        this.diaTitle = "添加权限"
        this.operateType = "add";
        getList().then(res=>{
          console.log("res",res)
          this.limitType = res.data.result;
        })
        this.addFlag = true;
      },
      editLimit(info){
        console.log(info)
        this.hasChildFlag = true;
        this.permissionId = info.permissionId;
        this.diaTitle = "修改权限";
        this.operateType = "edit";
        this.form.name = info.name;
        this.form.permissionCode = info.permissionCode;
        this.form.type = info.categoryId;
        this.addFlag = true;
        getList().then(res=>{
          this.limitType = res.data.result;
        })
      },
      deleteChildLimit(info){

        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let prm = {
            ids: [info.permissionId]
          };
          permissionDelete(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                message: '恭喜你，删除成功',
                type: 'success'
              })
              this.getLimitList(this.currentId);
            }
            console.log(res);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });




      },

      // 添加自权限
      addChildLimit(info){
        console.log(info)
        this.$router.push({
          path:"/childLimit",
          query:{
            permissionId:info.permissionId
          }
        })
      },
      searchList(){
        permissionList({
          pageSize:10,
          pageNum:1,
          name:this.searchVal
        }).then(res=>{
          let {result} = res.data;
          this.limitList = result.list
          console.log("this.limitList",this.limitList)
        }).catch(err=>{
          console.log("err",err)
        })
      }
    },
    mounted() {
      this.getList();
    }
  };
</script>

<style scoped lang="less">
  .content-container{
    width: 100%;
    display: flex;

    .right-container{
      flex: 1;
      height: 400px;
      margin-top: 30px;

      .title{
        height: 30px;
        font-size: 18px;
        background: lightyellow;
        font-style: italic;
        font-weight: bold;
        line-height: 30px;
      }
    }

      .user-top{
        margin-bottom: 20px;
      }

  }
</style>
