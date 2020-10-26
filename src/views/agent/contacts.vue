<template>
  <div class="app-container">
    <!--<svg style="width: 20px;height: 20px" class="svg-icon" aria-hidden="true" >
      <use xlink:href="#icon-documentation" />
    </svg>-->
    <el-row class="user-top">
      <el-button type="primary" plain @click="addOpen">添加联系人</el-button>
    </el-row>


    <el-row>
      <el-input class="search-container"  placeholder="/姓名" v-model="searchInfo.name"></el-input>
      <el-input class="search-container"  placeholder="/电话号码" v-model="searchInfo.phoneNum"></el-input>
      <el-input class="search-container"  placeholder="/职务" v-model="searchInfo.phoneNum"></el-input>
      <el-select class="search-container" v-model="searchInfo.contactType" placeholder="请选择联系人类型">
        <el-option v-for="item in contactTypes" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button style="margin: 0 10px 20px 0" plain type="primary" @click="searchList">搜索</el-button>
      <el-button style="margin: 0 10px 20px 0" plain type="warning" @click="resetData">重置</el-button>
    </el-row>



    <el-dialog :title="diaTitle" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="号码" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.phoneNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="职务" :label-width="formLabelWidth">
          <el-input v-model="form.post" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人类型" :label-width="formLabelWidth">
          <el-select v-model="form.contactType" placeholder="请选择联系人类型">
            <el-option v-for="item in contactTypes" :label="item.name" :value="item.id"></el-option>
          </el-select>
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
        label="姓名"
        width="80">
      </el-table-column>
      <el-table-column
        prop="phoneNumber"
        label="电话"
        width="120">
      </el-table-column>
      <el-table-column
        prop="post"
        label="职务"
        width="100">
      </el-table-column>
      <el-table-column
        prop="createUser"
        label="创建人"
        width="80">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="140">
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
  import {contactList,contactAdd,contactDelete,contactEdit} from "../../api/angenManagement";

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
        contactTypes:[{id:1,name:'代理商'}],
        idTypes: [{id:1,name:"身份证"},{id:2,name:'营业执照'}],
        searchVal:null,
        currentContactId:null,
        currentId: null,
        searchInfo: {
          name:null,
          phoneNum:null,
          relateId:null,
          post:null,
          contactType:null,
        },
        form: {
          name:null,
          phoneNum:null,
          relateId:null,
          post:null,
          contactType:null,
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
      handleCurrentChange(v){
        this.getList(v)
      },

      getList(v=1){
        let prm = {
          "pageNum": v,
          "pageSize":this.pageSize,
          "contactType": this.searchInfo.contactType,
          "name": this.searchInfo.name,
          "phoneNumber": this.searchInfo.phoneNumber,
          "post": this.searchInfo.post,
          "relateId": this.form.relateId,
        }
        contactList(prm).then(res=>{
          let {list} = res.data.result
          this.tableData = list
          this.totalList = res.data.result.total
        })
      },
      addOpen(){
        this.addFlag = true;
        this.diaTitle = "添加联系人";
        this.form.name = null
        this.form.phoneNum = null
        this.form.post = null
        this.form.contactType = null
        this.currentContactId = null;
      },
      editOpen(info){
        this.currentContactId = info.contactId;
        this.addFlag = true;
        this.diaTitle = "编辑联系人"
        this.form.name = info.name
        this.form.contactType = info.contactType
        this.form.post = info.post
        this.form.phoneNum = info.phoneNumber
      },
      saveHandle(){
        if (this.diaTitle === "添加联系人"){
          let prm = {
            "contactType": this.form.contactType,
            "name": this.form.name,
            "phoneNumber": this.form.phoneNum,
            "post": this.form.post,
            relateId:this.form.relateId
          }

          contactAdd(prm).then(res=>{
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
        }else if(this.diaTitle === "编辑联系人"){
          let prm = {
            "contactId": this.currentContactId,
            "contactType": this.form.contactType,
            "name": this.form.name,
            "phoneNumber": this.form.phoneNum,
            "post": this.form.post,
            "relateId": this.form.relateId,
          }
          contactEdit(prm).then(res=>{
            this.$message({
              type:"success",
              message: "修改成功"
            })
            this.getList();
            this.addFlag = false
          })
        }
      },
      deleteHandle(info){

        this.$confirm('此操作将永久删除该联系人, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let prm = qs.stringify({
            contactId: info.contactId
          });
          contactDelete(prm).then(res=>{
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
        this.getList()
      },
      resetData(){
        this.getList()
      }
    },
    mounted() {
      if (this.$route.query.ID){
        console.log(this.$route.query.ID)
        this.form.relateId = parseInt(this.$route.query.ID)
      }
      this.getList();
    }
  };
</script>
<style scoped lang="less">
  .user-top{
    margin: 10px 0 10px 0;
  }
  .search-wrapper{
    margin: 20px 0;
  }
  .center-page{
    min-width: 700px;
    display: flex;
    justify-content: center;
  }
  .search-container{
    width: 226px;
    margin: 15px 0;
  }
</style>
