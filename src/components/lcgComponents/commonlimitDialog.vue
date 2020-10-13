<template>
  <el-dialog title="收货地址" :visible.sync="commonLimitFlag">
    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="[5]">
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="setFalse">取 消</el-button>
      <el-button type="primary" @click="setLimit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
      name: "commonlimitDialog",
      data() {
        return {
          data: [{
            id: 1,
            label: '一级 2',
            children: [{
              id: 3,
              label: '二级 2-1',
              children: [{
                id: 4,
                label: '三级 3-1-1'
              }, {
                id: 5,
                label: '三级 3-1-2',
                disabled: true
              }]
            }, {
              id: 2,
              label: '二级 2-2',
              disabled: true,
              children: [{
                id: 6,
                label: '三级 3-2-1'
              }, {
                id: 7,
                label: '三级 3-2-2',
                disabled: true
              }]
            }]
          },
            {
              id: 1,
              label: '一级 2',
              children: [{
                id: 3,
                label: '二级 2-1',
                children: [{
                  id: 4,
                  label: '三级 3-1-1'
                }, {
                  id: 5,
                  label: '三级 3-1-2',
                  disabled: true
                }]
              }, {
                id: 2,
                label: '二级 2-2',
                disabled: true,
                children: [{
                  id: 6,
                  label: '三级 3-2-1'
                }, {
                  id: 7,
                  label: '三级 3-2-2',
                  disabled: true
                }]
              }]
            }],
          defaultProps: {
            children: 'children',
            label: 'label'
          }
        };
      },
      props:{
        commonLimitFlag:{
          type: Boolean,
          default: false
        }
      },
      methods:{
        setLimit(){
          this.$emit("update:commonLimitFlag",false);
        },
        setFalse(){
          this.$emit("update:commonLimitFlag",false);
        }
      }
    }
</script>

<style scoped>

</style>
