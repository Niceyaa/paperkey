<template>
  <div class="createPost-container">
    <el-form ref="postForm" model="postData" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar'">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          提交
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;">
              <MDinput v-model="title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="flag-wrapper">置顶：
          <el-radio-group v-model="topFlag" size="small">
            <el-radio-button label="正常"></el-radio-button>
            <el-radio-button label="置顶"></el-radio-button>
          </el-radio-group>
        </el-row>
        <el-row class="flag-wrapper">禁用：
          <el-radio-group v-model="useFlag" size="small">
            <el-radio-button label="正常"></el-radio-button>
            <el-radio-button label="禁用"></el-radio-button>
          </el-radio-group>
        </el-row>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="content" :height="400" />
        </el-form-item>


      </div>
    </el-form>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import MDinput from '@/components/MDinput'
  import Sticky from '@/components/Sticky' // 粘性header组件
  import {addArticle,updateArticle} from "../../api/articleManagement";
  import qs from "qs"

  export default {
    name: 'ArticleDetail',
    components: { Tinymce, MDinput, Sticky },
    data() {
      return {
        content:"",
        title: "",
        loading: false,
        topFlag: '正常',
        useFlag: '正常'
      }
    },
    mounted() {
      if (this.$route.query.articleInfo){
        let {articleInfo} = this.$route.query;
        console.log(2222,articleInfo)
        this.title = articleInfo.title;
        this.content = articleInfo.content;
        this.topFlag = articleInfo.isTop?"置顶":"正常";
        this.useFlag = articleInfo.isUse?"正常":"禁用";
      }
    },
    methods: {
      submitForm() {
        if (this.title.length<1){
          this.$message.error("请填写标题再提交哦")
          return
        }else if (this.content.length<1){
          this.$message.error("请填写内容再提交哦")
          return
        }else if (this.$route.query.categoryId){
          let prm = qs.stringify({
            categoryId:this.$route.query.categoryId,
            isTop:this.topFlag==='正常'?false:true,
            isUse:this.useFlag==='正常'?true:false,
            title:this.title,
            content:this.content
          })
          addArticle(prm).then(res=>{
            if(res.data.code === 200){
              this.$message({
                type:"success",
                message:res.data.msg
              })
              this.$router.push({
                path:'/article'
              })
            }
          })
        }else if (this.$route.query.articleInfo){
          let prm = {
            categoryId:this.$route.query.articleInfo.articleCategory.categoryId,
            isTop:this.topFlag==='正常'?false:true,
            isUse:this.useFlag==='正常'?true:false,
            title:this.title,
            content:this.content,
            articleId:this.$route.query.articleInfo.articleId
          }
          updateArticle(prm).then(res=>{
            if(res.data.code === 200){
              this.$message({
                type:"success",
                message:res.data.msg
              })
              this.$router.push({
                path:'/article'
              })
            }
          })
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .flag-wrapper{
    margin-bottom: 20px;
    color: #000;
    font-weight: bold;
  }
  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea /deep/ {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }
</style>


