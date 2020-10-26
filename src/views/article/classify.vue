<template>
  <div class="app-container">
    <el-row class="user-top">
      <el-button type="primary" plain @click="addOpen">添加分类</el-button>
    </el-row>

    <el-row class="search-wrapper">
      <el-input placeholder="/分类名" v-model="searchVal">


      </el-input>
      <el-button plain style="margin-left: 15px" @click="searchList" type="primary">搜索</el-button>
      <el-button plain type="warning" @click="resetList">重置</el-button>
    </el-row>

    <el-dialog :title="diaTitle" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="分类名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio v-model="form.status" :label="true">启用</el-radio>
          <el-radio v-model="form.status" :label="false">禁用</el-radio>
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
      <!--<el-table-column
        prop="categoryId"
        label="分类Id"
        width="120">
      </el-table-column>-->
      <el-table-column
        prop="categoryName"
        label="名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="isUse"
        label="状态"
        align="center"
        sortable
        width="120">
        <template slot-scope="scope">
          <el-tag v-if="!scope.row.isUse" type="danger">禁用</el-tag>
          <el-tag v-else type="primary">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="140">
        <template slot-scope="scope">
          <el-button @click="editOpen(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteHandle(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import {getList,updateCategory,addCategory,deleteCategory,sortCategory} from "../../api/permissionClassify";
  import {addArticleCategory,updateArticleCategory,deleteArticleCategory,articleCategoryList} from "../../api/articleManagement";
  import qs from 'qs'

  export default {
    name: 'limit',
    data() {
      return {
        searchVal:"",
        //分页配置
        pageSize:10,
        total:0,

        currentCategoryInfo: {},
        currentId: null,
        form: {
          name:'',
          status: null,
          sort:null
        },
        formLabelWidth: '120px',
        diaTitle: '',
        addFlag: false,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        tableData: []
      };
    },
    methods: {
      searchList(){
        let prm = {
          pageNum:1,
          pageSize:this.pageSize,
          categoryName:this.searchVal
        }
        articleCategoryList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
          console.log(res)
        })
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      getList(v=1){
        let prm = {
          pageNum:v,
          pageSize:this.pageSize
        }
        articleCategoryList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
          console.log(res)
        })
      },
      addOpen(){
        this.addFlag = true;
        this.diaTitle = "添加分类";
        this.form.name = ""
        this.form.sort = null
      },
      editOpen(info){
        this.currentCategoryInfo = info;
        this.addFlag = true;
        this.diaTitle = "修改分类"
        this.form.name = info.categoryName
        this.form.sort = info.sort
        this.form.status = info.isUse
        this.currentId = info.categoryId
      },
      addLimit(){
        if (this.diaTitle === "添加分类"){
          let prm = qs.stringify({
            "categoryName": this.form.name,
            "isUse": this.form.status,
            parentCategoryId:0
          })
          addArticleCategory(prm).then(res=>{
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
        }else if(this.diaTitle === "修改分类"){
          console.log(this.form.status,typeof this.form.status)
          let prm = {
            categoryId: this.currentId,
            "categoryName": this.form.name,
            "sort": parseInt(this.form.sort),
            // isUse:this.form.status==="0"?true:false
            isUse:parseInt(this.form.status)
          }
          updateArticleCategory(prm).then(res=>{
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
            cid: info.categoryId
          });
          deleteArticleCategory(prm).then(res=>{
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
      },
      resetList(){
        this.searchVal = ''
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
    width: 450px;
    margin: 20px 0;
    display: flex;
  }
</style>
