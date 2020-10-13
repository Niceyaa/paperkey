<template>
  <div class="app-container">
    <el-row class="user-top">
      <el-button type="primary" plain @click="addOpen">添加分类</el-button>
    </el-row>

    <el-row>
      <el-input clearable class="search-container" v-model="searchInfo.name" placeholder="/名称"></el-input>
      <el-button plain type="primary" @click="searchList">搜索</el-button>
      <el-button plain type="warning" @click="resetList">重置</el-button>
    </el-row>


    <el-dialog :title="diaTitle" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveHandle">确 定</el-button>
      </div>
    </el-dialog>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160">
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        min-width="100">
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
  import {getList,updateCategory,addCategory,deleteCategory,sortCategory} from "../../api/permissionClassify";
  import {
    paperClassifyList,
    paperClassifyAdd,
    paperClassifyDelete,
    paperClassifyUpdate
  } from "../../api/recycleManagement";

  export default {
    name: 'limit',
    data() {
      return {
        searchInfo:{name:null},
        categoryId: null,
        form: {
          name:''
        },
        formLabelWidth: '120px',
        diaTitle: '',
        addFlag: false,
        tableData: [],
        // 分页配置
        pageSize: 15,
        total:0,
        currentPage:1
      };
    },
    methods: {
      getList(v=1){
        let prm = {
          "pageNum": v,
          "pageSize": this.pageSize,
        }
        paperClassifyList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
          console.log(res)
        })
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      addOpen(){
        this.addFlag = true;
        this.diaTitle = "添加分类";
        this.form.name = null
      },
      editOpen(info){
        this.addFlag = true;
        this.diaTitle = "修改分类"
        this.form.name = info.name
        this.categoryId = info.paperClassifyId
      },
      saveHandle(){
        if (this.diaTitle === "添加分类"){
          let prm = {
            "name": this.form.name
          }

          paperClassifyAdd(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message: "添加成功"
              })
              this.getList();
              this.addFlag = false
            }
          })
        }else if(this.diaTitle === "修改分类"){
          let prm = {
            paperClassifyId: this.categoryId,
            "name": this.form.name,
          }
          paperClassifyUpdate(prm).then(res=>{
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
        console.log(info)
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let prm = {
            ids: [info.paperClassifyId]
          };
          paperClassifyDelete(prm).then(res=>{
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
      searchList(){
        let prm = {
          "pageNum": 1,
          "pageSize": this.pageSize,
          name: this.searchInfo.name
        }
        paperClassifyList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
          console.log(res)
        })
      },
      resetList(){
        this.searchInfo.name = null;
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
  .search-container{
    width: 300px;
    margin: 15px 0;
  }
</style>
