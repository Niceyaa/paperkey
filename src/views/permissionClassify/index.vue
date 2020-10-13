<template>
  <div class="app-container">
    <el-row class="user-top">
      <el-button type="primary" plain @click="addOpen">添加分类</el-button>
    </el-row>



    <el-dialog :title="diaTitle" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
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
          <el-table-column
            prop="categoryId"
            label="分类Id"
            width="120">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            width="120">
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


  </div>
</template>

<script>
  import {getList,updateCategory,addCategory,deleteCategory,sortCategory} from "../../api/permissionClassify";
  import {menuDelete} from "../../api/menuManagement";

  export default {
    name: 'limit',
    data() {
      return {
        currentId: null,
        form: {
          name:'',
          sort: null
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
      getList(){
        getList().then(res=>{
          this.tableData = res.data.result
          console.log(res)
        })
      },
      addOpen(){
        this.addFlag = true;
        this.diaTitle = "添加信息";
        this.form.name = ""
        this.form.sort = null
      },
      editOpen(info){
        this.addFlag = true;
        this.diaTitle = "修改信息"
        this.form.name = info.name
        this.form.sort = info.sort
        this.currentId = info.categoryId
      },
      addLimit(){
        if (this.diaTitle === "添加信息"){
          let prm = {
            "name": this.form.name,
            "sort": parseInt(this.form.sort)
          }
          addCategory(prm).then(res=>{
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
        }else if(this.diaTitle === "修改信息"){
          let prm = {
            categoryId: this.currentId,
            "name": this.form.name,
            "sort": parseInt(this.form.sort)
          }
          updateCategory(prm).then(res=>{
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

          let prm = {
            ids: [info.categoryId]
          };
          deleteCategory(prm).then(res=>{
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
</style>
