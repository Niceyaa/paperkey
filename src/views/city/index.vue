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
        <el-button @click="addHandle" type="primary" plain>添加城市</el-button>
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

      <el-row :gutter="20">
        <el-col :span="9">
          <el-divider content-position="left">省</el-divider>
          <div class="grid-content bg-purple">
            <el-table
              :data="allCityList"
              border
              style="width: 100%">
              <el-table-column
                prop="name"
                label="名称"
                width="70">
              </el-table-column>
              <el-table-column
                prop="code"
                label="编码"
                width="80">
              </el-table-column>
              <el-table-column
                label="操作"
                min-width="300"
                fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="success" @click="changeProId(scope.row)">市管理</el-button>
                  <el-button @click="editProHandle(scope.row,'pro')" size="mini" type="primary">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteCity(scope.row,'pro')">删除</el-button>
                  <el-button size="mini" type="warning" @click="addProvince(scope.row)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleCurrentChangePro"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="total,prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </el-col>

        <el-col :span="9">
          <el-divider content-position="left">市</el-divider>
          <div class="grid-content bg-purple-light">
            <el-table
              :data="cityList"
              border
              style="width: 100%">
              <el-table-column
                prop="name"
                label="名称"
                width="70">
              </el-table-column>
              <el-table-column
                prop="code"
                label="城市编码"
                width="80">
              </el-table-column>
              <el-table-column
                label="操作"
                fixed="right"
                min-width="300">
                <template slot-scope="scope">

                  <el-button size="mini" type="success" @click="changeCityId(scope.row)">县管理</el-button>
                  <el-button @click="editCityHandle(scope.row,'city')" size="mini" type="primary">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteCity(scope.row,'city')">删除</el-button>
                  <el-button size="mini" type="warning" @click="addCity(scope.row)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleCurrentChangeCity"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="total,prev, pager, next, jumper"
              :total="totalCity">
            </el-pagination>
          </div>
        </el-col>

        <el-col :span="6">
          <el-divider content-position="left">县</el-divider>
          <div class="grid-content bg-purple">
            <el-table
              :data="countyList"
              border
              style="width: 100%">
              <el-table-column
                prop="name"
                label="名称"
                width="70">
              </el-table-column>
              <el-table-column
                prop="code"
                label="城市编码"
                width="80">
              </el-table-column>
              <el-table-column
                label="操作"
                fixed="right"
                min-width="150">
                <template slot-scope="scope">
                  <el-button @click="editHandle(scope.row,'county')" size="mini" type="primary">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteCity(scope.row,'county')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleCurrentChangeCounty"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="total,prev, pager, next, jumper"
              :total="totalCounty">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
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
        proParentId:null,
        cityParentId:null,
        countyParentId:null,

        totalCity:null,
        totalCounty:null,

        addType:null,
        provinceId:null,
        townId:null,

        cityList:[],
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

        pageSize:10,
        currentPage:1,
        total:0
      };
    },
    watch:{
    },
    methods: {
      getList(i=1,type){
        let prm = {
          "pageNum": i,
          "pageSize": this.pageSize,
          parentCityId:this.parentId
        }
        cityList(prm).then(res=>{
          this.allCityList = res.data.result.list
          this.total = res.data.result.total
        })
      },
      handleCurrentChangePro(v){
        this.parentId = 0
        this.getList(v)
      },
      handleCurrentChangeCity(v){
        let prm = {
          "pageNum": v,
          "pageSize": this.pageSize,
          parentCityId:this.proParentId
        }
        cityList(prm).then(res=>{
          this.cityList = res.data.result.list
          this.totalCity = res.data.result.total
        })
      },
      handleCurrentChangeCounty(v){
        let prm = {
          "pageNum": v,
          "pageSize": this.pageSize,
          parentCityId:this.cityParentId
        }
        cityList(prm).then(res=>{
          this.countyList = res.data.result.list
          this.totalCounty = res.data.result.total
        })
      },
      editProHandle(info){
        this.cityId = info.cityId;
        this.addFlag = true;
        this.permissionId = info.permissionId;
        this.diaTitle = "修改城市";
        this.type = 'pro'
        this.form.name = info.name;
        this.form.code = info.code;
        this.form.pinyin = info.pinyin;
        this.parentId = info.parentCityId;
        this.proParentId = info.parentCityId;
      },
      editCityHandle(info){
        this.cityId = info.cityId;
        this.addFlag = true;
        this.permissionId = info.permissionId;
        this.diaTitle = "修改城市";
        this.form.name = info.name;
        this.form.code = info.code;
        this.form.pinyin = info.pinyin;
        this.parentId = info.parentCityId;
        this.CityParentId = info.parentCityId;
        this.type = 'city'
      },

      editHandle(info){
        this.cityId = info.cityId;
        this.addFlag = true;
        this.permissionId = info.permissionId;
        this.diaTitle = "修改城市";
        this.form.name = info.name;
        this.form.code = info.code;
        this.form.pinyin = info.pinyin;
        this.parentId = info.parentCityId;
        this.countyParentId = info.parentCityId;
        this.type = 'county'
      },
      saveHandle(){
        if (this.diaTitle === "修改城市"){
          let prm = {
            cityId:this.cityId,
            "code": this.form.code,
            "name": this.form.name,
            "pinyin": this.form.pinyin,
            parentCityId:this.parentId
          }
          cityUpdate(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"修改成功"
              })
              if (this.type === 'pro'){
                this.handleCurrentChangePro(1)
              }else if (this.type === 'city'){
                this.handleCurrentChangeCity(1)
              }else if (this.type === 'county'){
                this.handleCurrentChangeCounty(1)
              }
              this.addFlag = false
            }
          })
        }else if (this.addType === "province"){
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
              /* this.parentId = 0
               this.getList();*/
              this.handleCurrentChangeCity(1);
              this.addFlag = false
            }
          })
        }else if (this.addType === "city"){
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
              /*this.parentId = 0
              this.getList();*/
              this.handleCurrentChangeCounty(1);

              this.addFlag = false
            }
          })
        }else if (this.addType === "top"){
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
      deleteCity(info,type){
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
              if (type === 'pro'){
                this.parentId = 0;
                this.cityList = null;
                this.countyList = null;
                this.getList()
              }else if (type === 'city'){
                this.countyList = null
                let prm = {
                  "pageNum": 1,
                  "pageSize": this.pageSize,
                  parentCityId:this.proParentId
                }
                cityList(prm).then(res=>{
                  this.cityList = res.data.result.list
                  this.totalCity = res.data.result.total
                })
              }else if (type === 'county'){
                let prm = {
                  "pageNum": 1,
                  "pageSize": this.pageSize,
                  parentCityId:this.cityParentId
                }
                cityList(prm).then(res=>{
                  this.countyList = res.data.result.list
                  this.totalCounty = res.data.result.total
                })
              }
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      addProvince(info){
        this.diaTitle = "添加城市"
        this.addType = "province"
        this.parentId = info.cityId;
        this.proParentId = info.cityId;
        this.form.name = null
        this.form.code = null
        this.form.pinyin = null
        this.addFlag = true
      },
      addCity(info){
        this.diaTitle = "添加城市"
        this.addType = "city"
        this.parentId = info.cityId;
        this.cityParentId = info.cityId;
        this.form.name = null
        this.form.code = null
        this.form.pinyin = null
        this.addFlag = true
      },

      addHandle(){
        this.diaTitle = "添加城市";
        this.addType = "top"
        this.addFlag = true;
        this.form.name = null;
        this.form.code = null;
        this.form.pinyin = null;
        this.parentId = 0
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
        this.parentId = info.cityId
        this.proParentId = info.cityId
        this.cityList = null;
        this.countyList = null;
        let prm = {
          "pageNum": 1,
          "pageSize": this.pageSize,
          parentCityId:this.parentId
        }
        cityList(prm).then(res=>{
          this.cityList = res.data.result.list
          this.totalCity = res.data.result.total
        })
      },
      changeCityId(info){
        this.parentId = info.cityId
        this.cityParentId = info.cityId
        let prm = {
          "pageNum": 1,
          "pageSize": this.pageSize,
          parentCityId:this.parentId
        }
        cityList(prm).then(res=>{
          this.countyList = res.data.result.list
          this.totalCounty = res.data.result.total
        })
      }
    },
    mounted() {
      this.parentId = 0
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
