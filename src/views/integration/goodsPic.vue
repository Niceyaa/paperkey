<template>
  <div class="app-container">
    <el-row class="top-btn">
      <el-button plain type="success" @click="addHandle">新增图片</el-button>
    </el-row>
    <el-row style="height: 1px;background: #8c939d"></el-row>

    <!--addMenu-->
    <el-dialog class="img-dialog" :title="optTitle" :visible.sync="addFlag">
      <el-form :model="form">
        <el-form-item label="图片" :label-width="formLabelWidth">
          <!--          <upload-com></upload-com>-->

          <el-upload
            ref="uploadNode"
            action=""
            list-type="picture-card"
            :on-remove="removeImg"
            :multiple="true"
            :limit="picLimit"
            :on-exceed="exceedFunc"
            :http-request="httpRequest">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="imgUrl" alt="">
          </el-dialog>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveHandle">确 定</el-button>
      </div>
    </el-dialog>


    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;">
      <el-table-column
        label="图片"
        width="300">
        <template slot-scope="scope">
          <img width="100" :src="scope.row.commodityPhotoUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="是否封面"
        width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isCover" type="success">封面</el-tag>
          <el-tag v-else type="warning">否</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
         align="center"
         prop="sort"
         label="排序"
         width="120">
       </el-table-column>-->
      <el-table-column
        width="460px"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="itemEdit(scope.row)" size="mini" type="primary" icon="el-icon-edit" plain>修改</el-button>
          <el-button @click="itemDelete(scope.row)" size="mini" type="danger" icon="el-icon-delete" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>


  </div>
</template>

<script>
  import uploadCom from '../../components/lcgComponents/uploadCom'
  import axios from 'axios'
  import qs from 'qs'
  import {goodsPicList, goodsPicOpt,goodsPicDelete} from "../../api/goods";
  import {policy} from "../../api/file";

  export default {
    name: 'index',
    components:{uploadCom},
    data() {
      return {
        picLimit:4,

        photoPrm:[],
        fileArr:[],
        coverArr:[],

        currentPicId:null,
        tempFILE:null,

        showFileList:false,
        imgUrl:null,
        fileList:[{
          name:null,
          url:null
        }],
        currentIsCover:false,

        dialogVisible: false,

        goodsId:null,

        form:{
          name:null,
          code:null,
          isUse:true,
          lastClassify:null
        },
        addFlag: false,
        tableData: [],
        optTitle: null,
        formLabelWidth: '120px',
      }
    },
    watch:{
      photoPrm(v){
        if (v.length>0&&v.length === this.fileArr.length){
          let prm = {
            commodityId: this.goodsId,
            "photos": v
          };
          goodsPicOpt(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"添加成功"
              });
              this.$refs.uploadNode.clearFiles()
              this.getList();
              this.addFlag = false
            }
          })
        }
      }
    },
    methods: {
      removeImg(file){
        this.fileArr = this.fileArr.filter((item,idx)=>{
          if (item.name === file.name){
            this.coverArr.splice(idx,1)
          }
          return item.name !== file.name
        })
        console.log(this.fileArr)
        console.log(this.coverArr)
      },
      exceedFunc(files, fileList) {
        this.$message.warning(`当前限制选择 ${this.picLimit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      httpRequest(file){
        this.tempFILE = file;
        this.fileArr.push(file.file)
        this.imgUrl = URL.createObjectURL(file.file)

        this.$confirm('是否将该图片设置为商品封面?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.coverArr.push(true)
        }).catch(() => {
          this.coverArr.push(false)
        });
      },


      getList(){
        let prm = qs.stringify({
          CommodityId:this.goodsId
        });
        goodsPicList(prm).then(res=>{
          this.tableData = res.data.result;
          this.total = res.data.result.total;
        })
      },

      itemEdit(info){
        this.fileArr = []
        this.coverArr = []
        this.optTitle = "修改信息"
        this.picLimit = 1
        this.currentIsCover = info.isCover
        this.addFlag = true;
        this.imgUrl = null
        this.$nextTick(()=>{
          this.$refs.uploadNode.clearFiles();
        })
        this.currentPicId = info.commodityPhotoId.toString()
      },
      itemDelete(info){

        this.$confirm('此操作将永久删除该商品图片信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let prm = qs.stringify({
            commodityPhotoId:info.commodityPhotoId.toString()
          })
          goodsPicDelete(prm).then(res=>{
            if (res.data.code === 200){
              this.$message({
                type:"success",
                message:"刪除成功"
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


        console.log(info)
      },

      addHandle(){
        this.addFlag = true;
        this.picLimit = 4
        this.photoPrm = []
        this.fileArr = []
        this.$nextTick(()=>{
          this.imgUrl = null
          this.$refs.uploadNode.clearFiles();
        })
        this.optTitle = "添加图片"
      },


      saveHandle(){
        if (this.fileArr.length===0){
          this.$confirm('还未选择图片, 是否退出?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.addFlag = false
            return
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '请继续选择图片'
            });
            return
          });
        }else{
          if (this.optTitle === '添加图片'){
            let prm = qs.stringify({
              fileNum:this.fileArr.length,
              uploadType:4
            });
            policy(prm).then(res=>{
              let {result} = res.data;
              this.fileArr.forEach(async (item,idx)=>{
                let requestData = new FormData();
                let fileId = result.fileIds[idx]
                let fileKey = this.tempFILE.file.type === 'image/png'?result.dir+fileId+".png":result.dir+fileId+'.jpg'
                requestData.append('policy',result.policy)
                requestData.append("signature",result.signature)
                requestData.append("ossaccessKeyId",result.accessid)
                requestData.append("key",fileKey)
                requestData.append("dir",result.dir)
                requestData.append("host",result.host)
                requestData.append("file",item)

                let res = await axios({
                  url:result.host,
                  method:'post',
                  data:requestData
                });
                let tempUrl = result.host + '/' + fileKey
                this.photoPrm.push({
                  "commodityPhotoUrl": tempUrl,
                  "isCover": this.coverArr[idx]
                })
              })
            })

          }else if (this.optTitle === '修改信息'){
            let prm = qs.stringify({
              commodityPhotoId:this.currentPicId
            })
            goodsPicDelete(prm).then(res=>{
              if (res.data.code === 200){
                let newPrm = qs.stringify({
                  fileNum:1,
                  uploadType:4
                });
                let requestData = new FormData();
                policy(newPrm).then(res=>{
                  let {result} = res.data;
                  let fileId = result.fileIds[0]
                  let fileKey = this.tempFILE.file.type === 'image/png'?result.dir+fileId+".png":result.dir+fileId+'.jpg'
                  requestData.append('policy',result.policy)
                  requestData.append("signature",result.signature)
                  requestData.append("ossaccessKeyId",result.accessid)
                  requestData.append("key",fileKey)
                  requestData.append("dir",result.dir)
                  requestData.append("host",result.host)
                  requestData.append("file",this.tempFILE.file)

                  axios({
                    url:result.host,
                    method:'post',
                    data:requestData
                  }).then(res=>{
                    this.imgUrl =  result.host+'/'+fileKey
                    let prama = {
                      commodityId:this.goodsId,
                      "photos": [
                        {
                          "commodityPhotoUrl": this.imgUrl,
                          "isCover": this.coverArr[0]
                        }
                      ]
                    };
                    goodsPicOpt(prama).then(res=>{
                      if (res.data.code === 200){
                        this.$message({
                          type:"success",
                          message:"修改成功"
                        })
                        this.getList();
                        this.addFlag = false
                        this.$nextTick(()=>{
                          this.$refs.uploadNode.clearFiles();
                        })
                      }
                    })
                  })
                })
              }
            })
          }
        }

      },
    },
    mounted() {
      this.goodsId = parseInt(this.$route.query.goodsId)
      this.getList()
    }
  }
</script>
<style scoped lang="less">
  .app-container{
    .search-wrapper{
      width: 500px;
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

    /deep/.img-dialog{
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
    }
  }


</style>
