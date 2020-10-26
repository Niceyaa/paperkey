<template>
  <div class="app-container">
    <el-row class="user-top">
      <el-button type="primary" plain @click="addOpen">添加商品</el-button>
    </el-row>



    <el-row class="process-wrapper">
      <el-row>
        <el-input clearable class="search-container" v-model="searchInfo.name" placeholder="/商品名"></el-input>
        <el-input clearable class="search-container" v-model="searchInfo.code" placeholder="/商品编码"></el-input>
        <el-cascader
          placeholder="请选择商品分类"
          v-model="searchInfo.goodsClassifyId"
          :options="allGoodsClassify"
          :props="cascaderProp"
          @change="handleClassifyChange">
        </el-cascader>
        <el-button style="margin-left: 10px" plain type="primary" @click="searchList">搜索</el-button>
        <el-button style="margin-left: 10px" plain type="warning" @click="resetList">重置</el-button>
      </el-row>
    </el-row>

    <el-dialog :title="optTitle" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" :label-width="formLabelWidth">
          <el-input v-model="form.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="最低积分" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.minIntegral" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="最高积分" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.maxIntegral" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="原价" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.oldPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="现价" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品简介" :label-width="formLabelWidth">
          <el-input v-model="form.introduce" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="是否上架" :label-width="formLabelWidth">
          <el-radio v-model="form.isOnShelf" :label="true">上架</el-radio>
          <el-radio v-model="form.isOnShelf" :label="false">不上架</el-radio>
        </el-form-item>
        <el-form-item label="是否置顶" :label-width="formLabelWidth">
          <el-radio v-model="form.isTop" :label="true">置顶</el-radio>
          <el-radio v-model="form.isTop" :label="false">不置顶</el-radio>
        </el-form-item>

        <el-form-item label="商品类型" :label-width="formLabelWidth">
          <el-input placeholder="请选择商品类型" @focus="innerFlag = true" v-model="form.classify" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveHandle">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="inner-dialog" title="商品分类" :visible.sync="innerFlag">
      <el-tree
        class="filter-tree"
        node-key="menuId"
        :data="allGoodsClassify"
        :props="defaultProps"
        :default-expand-all="defaultExpandAll"
        highlight-current
        @node-click="handleNodeClick"
        ref="menuTree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerFlag = false">取 消</el-button>
        <el-button type="primary" @click="getClassifyInfo">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="warehouseTitle" :visible.sync="warehouseFlag">
      <el-form :model="warehouseForm">
        <el-form-item label="商品数量" :label-width="formLabelWidth">
          <el-input type="number" v-model="warehouseForm.num" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="warehouseFlag = false">取 消</el-button>
        <el-button type="primary" @click="warehouseHandle">确 定</el-button>
      </div>
    </el-dialog>

    <el-row style="height: 1px;background: #8c939d"></el-row>
    <el-table
      :data="tableData"
      type="expand"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{scope.row.commodityName }}</span>
            </el-form-item>
            <el-form-item label="商品编码">
              <span>{{ scope.row.commodityCode }}</span>
            </el-form-item>
            <el-form-item label="商品类型">
              <span>{{ scope.row.commodityClassify.commodityClassifyName }}</span>
            </el-form-item>
            <el-form-item label="原价">
              <span>{{ scope.row.oldPrice }}</span>
            </el-form-item>
            <el-form-item label="价格">
              <span>{{ scope.row.price }}</span>
            </el-form-item>
            <el-form-item label="购买量">
              <span>{{ scope.row.purchaseCount }}</span>
            </el-form-item>
            <el-form-item label="点击量">
              <span>{{ scope.row.clickCount }}</span>
            </el-form-item>
            <el-form-item label="上架信息">
              <span>{{ scope.row.isOnShelf?"已上架":"未上架" }}</span>
            </el-form-item>
            <el-form-item label="置顶信息">
              <span>{{ scope.row.isTop?"已置顶":"未置顶" }}</span>
            </el-form-item>
            <el-form-item label="最高积分">
              <span>{{ scope.row.maxIntegral }}</span>
            </el-form-item>
            <el-form-item label="最低积分">
              <span>{{ scope.row.minIntegral }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ scope.row.remark }}</span>
            </el-form-item>
            <el-form-item label="简介">
              <span>{{ scope.row.commodityIntroduction }}</span>
            </el-form-item>
            <el-form-item label="有效期开始时间">
              <span>{{ scope.row.validityStartTime }}</span>
            </el-form-item>
            <el-form-item label="有效期结束时间">
              <span>{{ scope.row.validityEndTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="commodityName"
        label="商品名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="commodityClassify.commodityClassifyName"
        label="商品类型"
        width="120">
      </el-table-column>
      <el-table-column
        prop="oldPrice"
        label="原价"
        width="100">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        width="100">
      </el-table-column>
      <el-table-column
        prop="isOnShelf"
        label="上架"
        width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isOnShelf">已上架</el-tag>
          <el-tag type="info" v-else>未上架</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isTop"
        label="置顶"
        width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isTop">已置顶</el-tag>
          <el-tag type="info" v-else>未置顶</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="purchaseCount"
        label="购买量"
        width="100">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="400">
        <template slot-scope="scope">
          <el-button @click="goodsIn(scope.row)" type="success" size="small">入库</el-button>
          <el-button @click="goodsOut(scope.row)" type="warning" size="small">出库</el-button>
          <el-button @click="goToPics(scope.row)" type="info" size="small">商品图片</el-button>
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
  import qs from 'qs'
  import {goodsAdd,goodsDelete,goodsList,goodsEdit,goodsClassifyTreeList,goodsInWarehouse,goodsOutWarehouse} from "../../api/goods";

  export default {
    data() {
      return {
        classifyFlag:false,
        allGoodsClassify:[],
        cascaderProp:{
          children:'subMenus',
          label:'commodityClassifyName',
          value:'commodityClassifyId',
          expandTrigger:'hover',
          checkStrictly: true
        },


        warehouseTitle:null,
        warehouseFlag:false,
        warehouseForm:{
          num:null
        },

        defaultProps: {
          children: 'subMenus',
          label: 'commodityClassifyName'
        },
        defaultExpandAll:false,
        classifyList:null,
        innerFlag:false,
        optTitle:null,
        currentClassifyInfo:null,
        currentGoodId:null,

        searchInfo:{
          name:null,
          code:null,
          goodsClassifyId:null
        },
        form: {
          name:null,
          code:null,
          isTop:false,
          isOnShelf:true,
          price:null,
          oldPrice:null,
          remark:null,
          introduce:null,
          maxIntegral:null,
          minIntegral:null,
          classify:null,
        },
        formLabelWidth: '120px',
        addFlag: false,
        tableData: [],
        // 分页配置
        pageSize: 10,
        total:0,
        currentPage:1
      };
    },
    watch:{

    },
    methods: {
      handleClassifyChange(v){
        this.searchInfo.goodsClassifyId = v[v.length-1]
        console.log(v)
      },
      changeSubMenus(data){
        for (let i = 0;i<data.length;i++){
          if (data[i].subMenus.length>0){
            this.changeSubMenus(data[i].subMenus);
          } else {
            data[i].subMenus = null
          }
        }
      },
      getGoodsClassify(){
        let prm = {
          pageSize:30,
          pageNum:1
        };
        goodsClassifyTreeList(prm).then(res=>{
          this.allGoodsClassify = res.data.result.list;
          this.changeSubMenus(this.allGoodsClassify)
          console.log(111,this.allGoodsClassify)
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
          "commodityClassifyId": this.searchInfo.goodsClassifyId,
          "commodityCode": this.searchInfo.code,
          // "commodityId": 0,
          "commodityName": this.searchInfo.name,
          "pageNum": v,
          "pageSize": this.pageSize
        }
        goodsList(prm).then(res=>{
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
      },
      handleCurrentChange(v){
        this.getList(v)
      },
      handleNodeClick(info){
        this.currentClassifyInfo = info
      },
      addOpen(){
        this.addFlag = true;
        this.optTitle = "添加商品"
        this.form.code = null
        this.form.name = null
        this.form.introduce = null
        this.form.isOnShelf = true
        this.form.isTop = false
        this.form.maxIntegral = null
        this.form.minIntegral = null
        this.form.oldPrice = null
        this.form.price = null
        this.form.remark = null
        this.form.classify = null
        this.currentClassifyInfo = null
      },
      editOpen(info){
        this.addFlag = true;
        this.optTitle = "修改信息"
        this.form.code = info.commodityCode
        this.form.name = info.commodityName
        this.form.introduce = info.commodityIntroduction
        this.form.isOnShelf = info.isOnShelf
        this.form.isTop = info.isTop
        this.form.maxIntegral = info.maxIntegral
        this.form.minIntegral = info.minIntegral
        this.form.oldPrice = info.oldPrice
        this.form.price = info.price
        this.form.remark = info.remark
        this.form.classify = info.commodityClassify.commodityClassifyName
        this.currentClassifyInfo = info.commodityClassify
        this.currentGoodId = info.commodityId
      },
      saveHandle(){
        if (this.optTitle === "添加商品"){
          let prm = {
            "commodityClassifyId": this.currentClassifyInfo.commodityClassifyId,
            "commodityCode": this.form.code,
            "commodityIntroduction": this.form.introduce,
            "commodityName": this.form.name,
            "isOnShelf": this.form.isOnShelf,
            "isTop": this.form.isTop,
            "maxIntegral": parseInt(this.form.maxIntegral),
            "minIntegral": parseInt(this.form.minIntegral),
            "oldPrice": parseInt(this.form.oldPrice),
            "price": parseInt(this.form.price),
            "remark": this.form.remark
          }
          goodsAdd(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message: "添加成功"
              })
              this.getList();
              this.addFlag = false
            }
          })
        }else if (this.optTitle === "修改信息"){
          let prm = {
            commodityId:this.currentGoodId,
            "commodityClassifyId": this.currentClassifyInfo.commodityClassifyId,
            "commodityCode": this.form.code,
            "commodityIntroduction": this.form.introduce,
            "commodityName": this.form.name,
            "isOnShelf": this.form.isOnShelf,
            "isTop": this.form.isTop,
            "maxIntegral": parseInt(this.form.maxIntegral),
            "minIntegral": parseInt(this.form.minIntegral),
            "oldPrice": parseInt(this.form.oldPrice),
            "price": parseInt(this.form.price),
            "remark": this.form.remark
          }
          goodsEdit(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message: "修改成功"
              })
              this.getList();
              this.addFlag = false
            }
          })
        }
      },
      deleteHandle(info){

        this.$confirm('确认删除该商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let prm = {
            commodityIds:[info.commodityId]
          };
          goodsDelete(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message: "删除成功"
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
      searchList(){
        this.getList()
      },
      resetList(){
        this.searchInfo.optName = null;
        this.searchInfo.createName = null;
        this.searchInfo.goodsClassifyId = null
        this.getList()
      },
      showAll(){
        this.currentCompressType = null
      },
      goToPics(info){
        this.$router.push({
          path:'/integration/goodsPic',
          query:{
            goodsId:info.commodityId
          }
        })
      },
      getClassifyInfo(){
        if (!this.currentClassifyInfo){
          this.$confirm('还未选取商品分类信息，确认退出吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.innerFlag = false
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消退出'
            });
          });
        }else{
          this.form.classify = this.currentClassifyInfo.commodityClassifyName
          this.innerFlag = false
        }
      },
      warehouseHandle(){
        if (this.warehouseForm.num.length>0){
          if (this.warehouseTitle === '商品入库'){
            let prm = qs.stringify({
              commodityId:this.currentGoodId,
              stockInNum:parseInt(this.warehouseForm.num)
            });
            goodsInWarehouse(prm).then(res=>{
              if (res.data.code === 200){
                this.$message({
                  type:"success",
                  message:"入库成功"
                })
                this.warehouseFlag = false
              }
            })
          }else if (this.warehouseTitle === '商品出库'){
            let prm = qs.stringify({
              commodityId:this.currentGoodId,
              stockOutNum:parseInt(this.warehouseForm.num)
            });
            goodsOutWarehouse(prm).then(res=>{
              if (res.data.code === 200){
                this.$message({
                  type:"success",
                  message:"出库成功"
                })
                this.warehouseFlag = false
              }
            })
          }
        }else{
          this.$message({
            type:"danger",
            message:'商品数量不能为空哦'
          })
        }

      },
      goodsIn(info){
        this.currentGoodId = info.commodityId;
        this.warehouseFlag = true;
        this.warehouseForm.num = null
        this.warehouseTitle = "商品入库"
      },
      goodsOut(info){
        this.currentGoodId = info.commodityId;
        this.warehouseFlag = true;
        this.warehouseForm.num = null
        this.warehouseTitle = "商品出库"
      },
    },
    mounted() {
      this.getList();
      this.getGoodsClassify();
    }
  };
</script>
<style scoped lang="less">
  /deep/.classifyMenu{
    width: 130px;
    padding: 0;
    margin: 0;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    .el-submenu{
      width: 100%;
    }
    .is-active{
      .el-submenu__title{
        border: none;
      }
    }
    .el-submenu__title{
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
    }
  }
  .user-top{
    margin: 10px 0 10px 0;
  }
  .search-container{
    width: 226px;
    margin: 15px 0;
  }
  .process-wrapper{
    margin: 0 0 15px 0;
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
