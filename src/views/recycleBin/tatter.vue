<template>
  <div class="app-container">
    <el-row class="user-top">
      <el-button type="primary" plain @click="addOpen">添加碎纸</el-button>
    </el-row>

    <el-row>
      <el-input clearable class="search-container" v-model="searchInfo.packageNum" placeholder="/包裹编号"></el-input>
      <el-input clearable class="search-container" v-model="searchInfo.packageSort" placeholder="/包裹序号"></el-input>
      <el-input clearable class="search-container" v-model="searchInfo.name" placeholder="/碎纸人"></el-input>
      <el-row style="margin-bottom: 15px">
        <el-date-picker
          v-model="searchInfo.startTime"
          type="datetime"
          placeholder="选择开始时间"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-date-picker
          v-model="searchInfo.endTime"
          type="datetime"
          placeholder="选择结束时间"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-button style="margin-left: 10px" plain type="primary" @click="searchList">搜索</el-button>
        <el-button style="margin-left: 10px" plain type="warning" @click="resetList">重置</el-button>
      </el-row>

    </el-row>


    <el-row style="height: 1px;background: #8c939d"></el-row>
    <el-table
      :data="tableData"
      type="expand"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="碎纸名称">
              <span>{{scope.row.shredderName }}</span>
            </el-form-item>
            <el-form-item label="碎纸人">
              <span>{{ scope.row.shredderUser }}</span>
            </el-form-item>
            <el-form-item label="碎纸重量">
              <span>{{ scope.row.shredderWeight }}</span>
            </el-form-item>
            <el-form-item label="碎纸开始时间">
              <span>{{ scope.row.startTime }}</span>
            </el-form-item>
            <el-form-item label="碎纸结束时间">
              <span>{{ scope.row.endTime }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{ scope.row.isEnd?"完成":"处理中" }}</span>
            </el-form-item>
            <el-form-item label="包装袋编号">
              <span>{{ scope.row.packageNum }}</span>
            </el-form-item>
            <el-form-item label="包裹序号">
              <span>{{ scope.row. packageSort }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="shredderName"
        label="碎纸名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="shredderUser"
        label="碎纸人"
        width="140">
      </el-table-column>
      <el-table-column
        prop="shredderWeight"
        label="碎纸重量"
        width="140">
      </el-table-column>
      <el-table-column
        prop="isEnd"
        label="碎紙状态"
        min-width="140">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnd" type="success">完成</el-tag>
          <el-tag v-else type="warning">处理中</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column
        fixed="right"
        label="操作"
        min-width="100">
        <template slot-scope="scope">
          <el-button @click="editOpen(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteHandle(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>-->
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
  import {tatterList,tatterAdd} from "../../api/recycleManagement";

  export default {
    name: 'limit',
    data() {
      return {
        searchInfo:{name:null,packageNum:null,packageSort:null,startTime:null,endTime:null},
        tableData: [],
        // 分页配置
        pageSize: 10,
        total:0,
        currentPage:1,
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      };
    },
    watch:{
    },
    methods: {
      addOpen(){
        tatterAdd().then(res=>{
          if (res.data.code === 200){
            this.$router.push({
              path:"/lcgComponent/tatterComponent",
              query:{
                tatterInfo:res.data.result.paperShredderId
              }
            })
          }
        })

      },
      formatDate(date){
        let tt = new Date(date);
        let y = tt.getFullYear();
        let mon = tt.getMonth()+1;
        let d = tt.getDate();
        return `${y}-${mon}-${d}`
      },
      getList(v=1){
        let prm = {
          "pageNum": v,
          "pageSize": this.pageSize,
          packageSort:parseInt(this.searchInfo.packageSort),
          packageNum:parseInt(this.searchInfo.packageNum),
          shredderUser:this.searchInfo.name,
          endTime:this.searchInfo.endTime,
          startTime:this.searchInfo.startTime,
        }
        tatterList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      searchList(){
        this.getList()
      },
      resetList(){
        this.searchInfo.name = null;
        this.searchInfo.packageNum = null;
        this.searchInfo.packageSort = null;
        this.searchInfo.endTime = null;
        this.searchInfo.startTime = null;
        this.getList()
      },

    },
    mounted() {
      this.getList();
    }
  };
</script>
<style scoped lang="less">
  .user-top{
    margin: 10px 0 10px 0;
  }
  .search-container{
    width: 226px;
    margin: 15px 0;
  }

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 130px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
