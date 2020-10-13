<template>
    <div class="edit-container">
      <el-form :model="form">
        <el-form-item label="角色名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="代理商" :label-width="formLabelWidth">
          <el-select v-model="form.agent" placeholder="代理商">
            <el-option label="代理商1" value="0"></el-option>
            <el-option label="代理商2" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" >
        <el-button @click="cancelHandle">取 消</el-button>
        <el-button type="primary" @click="saveHandle">保 存</el-button>
      </div>
    </div>
</template>

<script>
  import {rolesUpdate} from "../../api/roleManagement";

  export default {
      name: "rolesEdit",
      data(){
          return{
            form: {
              name: '',
              agent: '',
            },
            formLabelWidth: '120px',
            data: [
              {
              id: 1,
              label: '一级 1',
              children: [{
                id: 4,
                label: '二级 1-1',
                children: [{
                  id: 9,
                  label: '三级 1-1-1'
                }, {
                  id: 10,
                  label: '三级 1-1-2'
                }]
              }]
            }, {
              id: 2,
              label: '一级 2',
              children: [{
                id: 5,
                label: '二级 2-1'
              }, {
                id: 6,
                label: '二级 2-2'
              }]
            }, {
              id: 3,
              label: '一级 3',
              children: [{
                id: 7,
                label: '二级 3-1'
              }, {
                id: 8,
                label: '二级 3-2'
              }]
            }],
            defaultProps: {
              children: 'children',
              label: 'label'
            }
          }
      },
      props:['editInfo','editVisible'],
      mounted() {
        console.log("接受信息",this.editInfo)
      },
      methods:{
        saveHandle(){
          let prm = {
            "agentId": this.form.agent,
            "name": this.form.name,
            "roleCode": this.editInfo.roleCode,
            "roleId": this.editInfo.roleId
          }
          rolesUpdate(prm).then(res=>{
            if (res.data.code === 200){
              this.$emit("update:editVisible",false)
            }
            console.log("res",res);
          })
        },
        cancelHandle(){
          this.$emit("update:editVisible",false)
        }
      }
    }
</script>

<style scoped>
.dialog-footer{
  margin: 100px 0 30px 0;
  padding-left: 120px;
}
</style>
