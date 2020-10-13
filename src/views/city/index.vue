<template>
  <div class="app-container">

    <el-dialog :title="diaTitle" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" :label-width="formLabelWidth">
          <el-input v-model="form.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="拼音" :label-width="formLabelWidth">
          <el-input v-model="form.pinyin" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveHandle">确 定</el-button>
      </div>
    </el-dialog>

    <div class="top-wrapper">


      <el-row class="user-top" style="margin-bottom: 20px">
        <el-button @click="changeFlag" type="primary" plain>添加城市</el-button>
      </el-row>
      <el-row>
        <el-input clearable class="search-container" v-model="searchInfo.name" placeholder="/城市名称"></el-input>
        <el-input clearable class="search-container" v-model="searchInfo.code" placeholder="/城市编码"></el-input>
        <el-input clearable class="search-container" v-model="searchInfo.pinyin" placeholder="/拼音"></el-input>
        <el-button plain type="primary" @click="searchList">搜索</el-button>
        <el-button plain type="warning" @click="resetList">重置</el-button>
      </el-row>
    </div>

    <div class="content-container">

      <!--<el-row :gutter="20">
        <el-col :span="8">
          <el-divider content-position="left">省</el-divider>
          <div class="grid-content bg-purple">
            <el-table
              :data="allCityList"
              border
              style="width: 100%">
              <el-table-column
                label="名称"
                width="90">
                <template slot-scope="scope">
                  <span @click="changeProId(scope.row)">{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="code"
                label="编码"
                width="80">
              </el-table-column>
              <el-table-column
                label="操作"
                min-width="240"
                fixed="right">
                <template slot-scope="scope">
                  <el-button @click="editHandle(scope.row)" size="mini" type="primary">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteCity(scope.row)">删除</el-button>
                  <el-button size="mini" type="warning" @click="addCity(scope.row)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="total,prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </el-col>

        <el-col :span="8">
          <el-divider content-position="left">市</el-divider>
          <div class="grid-content bg-purple-light">
            <el-table
              :data="townList"
              border
              style="width: 100%">
              <el-table-column
                prop="name"
                label="名称"
                width="90">
              </el-table-column>
              <el-table-column
                prop="code"
                label="城市编码"
                width="80">
              </el-table-column>
              <el-table-column
                label="操作"
                fixed="right"
                min-width="240">
                <template slot-scope="scope">
                  <el-button @click="editHandle(scope.row)" size="mini" type="primary">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteCity(scope.row)">删除</el-button>
                  <el-button size="mini" type="warning" @click="addCity(scope.row)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="total,prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </el-col>

        <el-col :span="8">
          <el-divider content-position="left">县</el-divider>
          <div class="grid-content bg-purple">
            <el-table
              :data="countyList"
              border
              style="width: 100%">
              <el-table-column
                prop="name"
                label="名称"
                width="90">
              </el-table-column>
              <el-table-column
                prop="code"
                label="城市编码"
                width="80">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                min-width="240">
                <template slot-scope="scope">
                  <el-button @click="editHandle(scope.row)" size="mini" type="primary">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteCity(scope.row)">删除</el-button>
                  <el-button size="mini" type="warning" @click="addCity(scope.row)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="total,prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </el-col>
      </el-row>-->
      <div class="right-container">
        <el-table
          :data="allCityList"
          border
          style="width: 100%">
          <el-table-column
            prop="name"
            label="名称"
            width="90">
          </el-table-column>
          <el-table-column
            prop="code"
            label="城市编码"
            width="80">
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="210">
            <template slot-scope="scope">
              <el-button @click="editHandle(scope.row)" size="mini" type="primary">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteCity(scope.row)">删除</el-button>
              <el-button size="mini" type="warning" @click="addCity(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total,prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {cityList,cityAdd,cityDelete,cityUpdate,cityTreeList} from "../../api/cityManagement";
import qs from "qs"
  export default {
    name: 'index',
    data() {
      return {
        provinceId:null,
        townId:null,

        townList:[],
        countyList:[],


        allCityList: [],
        parentId: null,
        diaTitle: "",
        addFlag: false,
        form: {
          name: '',
          code:"",
          pinyin:""
        },
        formLabelWidth: '120px',
        searchInfo:{
          name:null,
          code:null,
          pinyin:null
        },
        cityId:null,

        pageSize:15,
        currentPage:1,
        total:0
      };
    },
    watch:{
      provinceId(v){
        console.log(1111)
          let prm = {
            "pageNum": 1,
            "pageSize": 15,
            parentCityId:v
          }
        cityTreeList(prm).then(res=>{
            this.allCityList = res.data.result.list
            this.total = res.data.result.total
          })
      }
    },
    methods: {
      getList(i=1){
        let prm = {
          "pageNum": i,
          "pageSize": 15
        }
        cityList(prm).then(res=>{
          this.allCityList = res.data.result.list
          this.total = res.data.result.total
        })
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      changeFlag(){
        this.addFlag = true;
        this.diaTitle = "添加城市"
        this.form.name = null;
        this.form.code = null;
        this.form.pinyin = null;
        this.parentId = 0;
      },
      addHandle(info){
        this.addFlag = true;
        this.form.name = null;
        this.form.code = null;
        this.form.pinyin = null;
        this.diaTitle = "添加城市";
        this.parentId = info.parentCityId
      },
      editHandle(info){
        this.cityId = info.cityId;
        console.log(info)
        this.addFlag = true;
        this.permissionId = info.permissionId;
        this.diaTitle = "修改城市";
        this.form.name = info.name;
        this.form.code = info.code;
        this.form.pinyin = info.pinyin;
        this.parentId = info.parentCityId;
      },
      saveHandle(){
        if (this.diaTitle === "修改城市"){
          let prm = {
            cityId:this.cityId,
            "code": this.form.code,
            "name": this.form.name,
            "parentCityId": this.parentId,
            "pinyin": this.form.pinyin
          }
          cityUpdate(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"修改成功"
              })
              this.getList();
              this.addFlag = false
            }
          })
        }else if (this.diaTitle === "添加城市"){
          let prm = {
            "code": this.form.code,
            "name": this.form.name,
            "parentCityId": this.parentId,
            "pinyin": this.form.pinyin
          }
          cityAdd(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"添加成功"
              })
              this.getList();
              this.addFlag = false
            }
          })
        }
      },
      deleteCity(info){
        this.$confirm('此操作将永久删除该城市, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let prm = qs.stringify({
            cityId: info.cityId
          });
          cityDelete(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                message: '恭喜你，删除成功',
                type: 'success'
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
      addCity(info){
        this.diaTitle = "添加城市"
        this.parentId = info.parentCityId;
        this.form.name = null
        this.form.code = null
        this.form.pinyin = null
        this.addFlag = true
      },
      searchList(){
        let prm = {
          "code": this.searchInfo.code,
          "name": this.searchInfo.name,
          "pageNum": 1,
          "pageSize": this.pageSize,
          "pinyin": this.searchInfo.pinyin
        };
        console.log(prm)
        cityList(prm).then(res=>{
          this.allCityList = res.data.result.list
          this.total = res.data.result.total
        })
      },
      resetList(){
        this.searchInfo.name = null
        this.searchInfo.code = null
        this.searchInfo.pinyin = null
        this.getList()
      },
      changeProId(info){
        console.log(1111,info)
        this.provinceId = info.cityId;
      }
    },
    mounted() {
      this.getList();
    }
  };
</script>

<style scoped lang="less">
  .app-container{
    width: 100%;

    .user-top{
      margin-bottom: 20px;
    }
    .search-container{
      width: 200px;
      margin: 15px 0;
    }
  }
</style>
