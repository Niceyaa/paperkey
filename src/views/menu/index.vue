<template>
  <div class="app-container">
    <el-row class="top-btn">
      <el-button plain type="success" @click="addHandle">添加菜单</el-button>
    </el-row>
    <el-row class="search-wrapper">
      <el-input placeholder="/名称" v-model="searchInfo.name"></el-input>
      <el-button plain style="margin-left: 15px" @click="searchList" type="primary">搜索</el-button>
      <el-button plain type="warning" @click="resetList">重置</el-button>
    </el-row>
    <el-row style="height: 1px;background: #8c939d"></el-row>

<!--addMenu-->
    <el-dialog :title="optTitle" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item v-if="!rootMenu" label="上级菜单" :label-width="formLabelWidth">
          <el-input @focus="innerMenuList" v-model="form.lastMenu" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" :label-width="formLabelWidth">
          <el-radio v-model="formType" :label="0">菜单</el-radio>
          <el-radio v-model="formType" :label="1">目录</el-radio>
        </el-form-item>
        <el-form-item v-if="MFlag" label="请求地址" :label-width="formLabelWidth">
          <el-input v-model="form.route" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="!FFlag" label="图标选择" :label-width="formLabelWidth">
          <el-input v-model="form.ico" autocomplete="off"></el-input>
        </el-form-item>
       <!-- <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort" autocomplete="off"></el-input>
        </el-form-item>-->
        <el-form-item v-if="!CFlag||FFlag" label="菜单权限" :label-width="formLabelWidth">
          <el-input @focus="getLimitList" v-model="form.permissionCode" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveHandle">确 定</el-button>
      </div>
    </el-dialog>

<!--lastMenu-->
    <el-dialog class="inner-dialog" title="上级目录" :visible.sync="innerFlag">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>

      <el-tree
        class="filter-tree"
        node-key="menuId"
        :data="tableData"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        highlight-current
        @node-click="handleNodeClick"
        ref="menuTree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerFlag = false">取 消</el-button>
        <el-button type="primary" @click="getLastMenu">确 定</el-button>
      </div>
    </el-dialog>

<!--    limit -->
    <el-dialog title="选择权限" :visible.sync="limitFlag">
      <el-tree
        ref="limitTree"
        :data="allLimit"
        node-key="lcgId"
        default-expand-all
        highlight-current
        @node-click="handleSelectChange"
        :default-checked-keys="defaultLcgId"
        :props="defaultLimitProps">
      </el-tree>
      <!--<el-table
        :data="allLimit"
        style="width: 100%"
        highlight-current-row
        @current-change="handleSelectChange">
        <el-table-column
          prop="name"
          label="权限名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="permissionCode"
          label="权限编码"
          width="120">
        </el-table-column>
        <el-table-column
          prop="categoryId"
          label="权限分类">
        </el-table-column>
      </el-table>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="limitFlag = false">取 消</el-button>
        <el-button type="primary" @click="getCheckLimit">确 定</el-button>
      </div>
    </el-dialog>

    <el-table
      class="menu-table"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="menuId"
      :tree-props="{children: 'subMenus', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        label="菜单名称"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="sort"
        label="排序"
        width="100">
      </el-table-column>
      <el-table-column
        align="center"
        prop="type"
        label="类型"
        width="120">
        <template slot-scope="scope">

          <el-tag v-if="scope.row.type===0">菜单</el-tag>
          <el-tag v-if="scope.row.type===1" type="success">目录</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        prop="pid"
        label="权限标识">
      </el-table-column>
      <el-table-column
        prop="route"
        label="页面地址">
      </el-table-column>
      <el-table-column
         width="460px"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="itemAdd(scope.row)" size="mini" type="success" icon="el-icon-circle-plus-outline" plain>新增</el-button>
          <el-button @click="itemEdit(scope.row)" size="mini" type="primary" icon="el-icon-edit" plain>编辑</el-button>
          <el-button @click="itemDelete(scope.row)" size="mini" type="danger" icon="el-icon-delete" plain>删除</el-button>
          <el-button @click="moveUp(scope.row,1)" size="mini" plain type="warning" icon="el-icon-caret-top">上移</el-button>
          <el-button @click="moveUp(scope.row,2)" size="mini" plain type="danger" icon="el-icon-caret-bottom">下移</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>/*
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'*/
import qs from 'qs'
import {menuAdd,menuDelete,menuList,menuUpdate,menuSort} from "../../api/menuManagement";
import {permissionList} from "../../api/permissionManagement";
import {deleteRolePermission, findRolePermission} from "../../api/roleManagement";
import {getUserPermission} from "../../api/permissionClassify";

export default {
  name: 'index',
  data() {
    return {
      defaultLimitProps: {
        children: 'subPermissions',
        label: 'name'
      },
      defaultLcgId:[],

      searchInfo:{name:"",count:""},
      rootMenu: false,
      lastMenuInfo:{},

      optType: '',
      limitFlag: false,
      allLimit: [],
      selectLimit: {},


      formType: 0,
      currentMenuItem: {},
      form:{
        name:null,
        lastMenu:null,
        route:null,
        ico:null,
        type:0,
        sort: null,
        permissionCode: null
      },
      addFlag: false,
      tableData: [],
      pageSize:10,
      optTitle: "添加菜单",
      formLabelWidth: '120px',
      innerFlag: false,

      CFlag:false,
      FFlag:false,
      MFlag:true,

      //上级目录
      filterText: '',
      defaultProps: {
        children: 'subMenus',
        label: 'name'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    },
    formType(val){if(val === 1){
        this.CFlag = true;
        this.MFlag = false;
      }else{
        this.MFlag = true;
        this.CFlag = false;
      }
    }
  },
  methods: {
    addId(data){
      for (let i = 0;i<data.length;i++){
        data[i].lcgId = this.allCount++;
        if (data[i].subPermissions&&data[i].subPermissions.length>0){
          this.addId(data[i].subPermissions)
        }
      }
    },
    matchLcgId(all,item){
      for (let i=0;i<item.length;i++){
        for (let j=0;j<all.length;j++){
          if (item[i].permissionId === all[j].permissionId){
            if (item[i].subPermissions&&item[i].length>0&&all[j].subPermissions&&all[j].subPermissions.length>0){
              this.matchLcgId(all[j].subPermissions,item[i].subPermissions);
            }else{
              if (item[i].subPermissionId===all[j].subPermissionId){
                this.defaultLcgId.push(all[j].lcgId);
              }
            }
          }
        }
      }
    },
    getRolePermissionList(){
      let prm = {
        "pageNum": 1,
        "pageSize": this.pageSize,
      }
      findRolePermission(prm).then(res=>{

        this.allFilterData = []
        let {result} = res.data;
        this.tableData = result.list
        this.total = result.total
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
        this.permissionIdArr.push(data[i].permissionId);
        if (data[i].subPermissions&&data[i].subPermissions.length>0){
          for (let j= 0;j<data[i].subPermissions.length;j++){
            this.subPermissionIdArr.push(data[i].subPermissions[j].subPermissionId)
          }

        }
      }
    },



    moveUp(info,a){
      console.log(info)
      let prm = qs.stringify({
        menuId:info.menuId,
        sort:a===1?(info.sort-1):(info.sort+1)
      })
      menuSort(prm).then(res=>{
        if (res.data.code === 200){
          this.$message({
            type:"success",
            message:"操作成功"
          })
          this.getMenuList()
        }
      })
    },
    sortBySort(obj1,obj2){
      let key1 = obj1.sort;
      let key2 = obj2.sort;
      return key1-key2;
    },
    sortRecursion(arr){
      arr.sort(this.sortBySort());
      for (let i = 0;i<arr.length;i++){
        if (arr[i].subMenus.length>0){
          this.sortRecursion(arr[i])
        }
      }
      return arr
    },
    resetList(){
      this.searchInfo.name = ""
      this.getMenuList();
    },
    searchList(){
        let prm = {
          pageSize:this.pageSize,
          pageNum:1,
          name:this.searchInfo.name
        }
        menuList(prm).then(res=>{
          let {result} = res.data;
          this.tableData = result.list
          console.log(this.tableData)
        })

    },
    lastMenuMatch(all,item){
      for (let i = 0;i<all.length;i++){
        console.log(item.pid,all[i].menuId)
        if (item.pid == all[i].menuId){
          return all[i];
        }else if (all[i].subMenus.length>0){
          this.lastMenuMatch(all[i],item);
        }
      }
    },
    itemAdd(info){
      this.rootMenu = false;
      this.currentMenuItem = info;
      this.form.lastMenu = info.name;
      this.formType = 0
      this.optType = "add";
      this.addFlag = true;
      this.form.name = null;
      this.form.ico = null;
      this.form.route = null;
      this.form.sort = null;
      this.form.permissionCode = null;
      this.optTitle = "添加菜单"
      console.log(info)
    },
    itemEdit(info){
      this.rootMenu = false;
      this.lastMenuInfo = this.lastMenuMatch(this.tableData,info);
      this.currentMenuItem = info;
      this.form.name = info.name;
      this.form.ico = info.ico;
      this.form.route = info.route;
      this.form.sort = info.sort;
      this.form.lastMenu = info.name;
      this.form.permissionCode = null;
      this.formType = info.type;
      this.addFlag = true;
      this.optType = "edit";
      this.optTitle = "修改信息"
      console.log(info)
    },
    itemDelete(info){

      this.$confirm('此操作将永久删除该menu, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let prm = {
          ids:[info.menuId]
        }
        menuDelete(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:"success",
              message:"刪除成功"
            })
            this.getMenuList();
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


      console.log(info)
    },

    getCheckLimit() {
      /*let checkItems = this.$refs.limitTree.getCheckedNodes();
      console.log(checkItems)*/
      this.form.permissionCode = this.selectLimit.name;
      this.limitFlag = false
    },
    handleSelectChange(v){
      this.selectLimit = v;
      console.log(this.selectLimit);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getMenuList(){
      let prm = {
        pageSize:this.pageSize,
        pageNum:1
      }
      menuList(prm).then(res=>{
        let {result} = res.data;
        this.tableData = result.list
        this.tableData = this.sortRecursion(this.tableData)
        console.log(this.tableData)
      })
    },
    addHandle(){
      this.rootMenu = true;
      this.optType = "add"
      this.addFlag = true;
      this.form.name = null;
      this.form.ico = null;
      this.form.route = null;
      this.form.sort = null;
      this.form.lastMenu = null;
      this.form.permissionCode = null;
      this.formType = 0
    },
    innerMenuList(){
      this.innerFlag = true
    },
    //lastMenu
    getLastMenu(){
      this.innerFlag = false;
      this.form.lastMenu = this.currentMenuItem.name
    },
    // limit
    getLimitList(){
      this.limitFlag = true
      getUserPermission().then(res=>{
        let {result} = res.data;
        result.forEach(item=>{
          if (item.categoryId === 0){
            item.name = "其他";
            item.subPermissions = item.permissions
          }else{
            item.subPermissions = item.permissions
          }
        })
        this.allLimit = result;
        for (let i=0;i<this.allLimit.length;i++){
          if (this.allLimit[i].subPermissions.length>0){
            this.matchLcgId(this.allLimit[i].subPermissions,this.allFilterData)
          }
        }
      })
    },
    limitSelect(v){
      console.log(v)
    },
    handleNodeClick(v){
      this.currentMenuItem = v;
    },
    saveHandle(){
      if (this.optType === "add"){
        let tt = null
        if (this.formType === 0){
          tt = [
            {
              "permissionId": this.selectLimit.permissionId,
              subPermissionIds:[this.selectLimit.subPermissionId]
            }
          ]
        }
        let prm = {
          "ico": this.form.ico,
          // "menuId": this.currentMenuItem.menuId,
          "menuPermissions": tt,
          "name": this.form.name,
          "pid": this.rootMenu?this.currentMenuItem.pid:this.currentMenuItem.menuId,
          "route": this.form.route,
          // "sort": parseInt(this.form.sort),
          type:this.formType
        };
        menuAdd(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:"success",
              message:"添加成功"
            })
            this.getMenuList()
          }
          console.log("menu",res)
        })
      }else if (this.optType === "edit"){
        let prm = {
          "ico": this.form.ico,
          "menuId": this.currentMenuItem.menuId,
          "menuPermissions": [
            {
              "permissionId": this.selectLimit.permissionId,
              subPermissionIds:[this.selectLimit.subPermissionId]
            }
          ],
          "name": this.form.name,
          // "pid": this.currentMenuItem.pid,
          "route": this.form.route,
          "sort": parseInt(this.form.sort),
          type:this.formType

        };
        menuUpdate(prm).then(res=>{
          if (res.data.code === 200){
            this.$message({
              type:"success",
              message:"修改成功"
            })
            this.getMenuList()
          }
          console.log("menu",res)
        })
      }

      this.addFlag = false;
    }
  },
  mounted() {
    this.getMenuList()
  }
}
</script>
<style scoped lang="less">
  .app-container{
    .search-wrapper{
      width: 400px;
      margin: 20px 0;
      display: flex;
    }
    .top-btn{
      margin: 10px 0 20px 0;
    }
      /*.el-table .el-table__header-wrapper .el-table__header*/
    .has-gutter{

      tr{
        th{
          background-color: lightgray!important;
        }
      }
    }
    .inner-dialog{
      -width:5%;
    }
  }
</style>
