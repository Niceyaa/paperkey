

<template>
  <el-upload
    class="upload-poster"
    action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="false"
    :on-change="imgPreview"
    :auto-upload="false">
    <img v-if="posterURL" :src="posterURL" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<style lang="less">
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
</style>

<script>
  export default {
    data() {
      return {
        posterURL: ''
      };
    },
    methods: {
      imgPreview (file, fileList) {
        console.log(111111111111,file)
        this.posterURL = URL.createObjectURL(file.raw)
       /* let fileName = file.name;
        let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
        if (regex.test(fileName.toLowerCase())) {
          this.posterURL = file.name;
        } else {
          this.$message.error('请选择图片文件');
        }*/
      },
      handlePictureCardPreview(file) {
        console.log(222222,file)
        // this.imageUrl = file.url;
        // this.dialogVisible = true;
      },
      beforeAvatarUpload(file) {
       /* const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;*/
      }
    }
  }
</script>
<style lang="less">
  /deep/.avatar-uploader .el-upload {
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
</style>
