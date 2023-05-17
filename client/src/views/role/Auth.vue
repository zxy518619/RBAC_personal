<template>
  <div>
    <el-form
      status-icon
      ref="roleForm"
      :model="updateRole"
      label-width="100px"
      label-position="right"
      style="width: 400px"
      :rules="rules"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="updateRole.name" placeholder="请输入角色">
        </el-input>
      </el-form-item>
    </el-form>
    <!-- 树形控件 -->
    <el-tree
      :data="authList"
      show-checkbox
      node-key="index"
      :default-expand-all="true"
      :default-checked-keys="checkedKeys"
      @check-change="handleCheckChange"
    >
    </el-tree>
  </div>
</template>

<script>
import menuList from "@/config/menuConfig.js";
export default {
  data() {
    return {
      updateRole: {
        name: "",
      },
      authList: [],//树形控件数据列表
     checkedKeys:[],
     rules: {
        name: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: ["blur"],}],
      },
      //checkedKeys: [],
    };
  },
  props: ["role"],
  mounted() {
    
    this.authList = this.getAuthNodes(menuList);
    //this.checkedKeys = this.role.menus;+
    this.updateRole = { ...this.role };
    this.checkedKeys=this.role.menus
  },
  components: {},

  methods: {
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    if(checked){
      if(data.index != "/students" &&
      this.checkedKeys.indexOf(data.index) == -1){
this.checkedKeys.push(data.index)
      }
    }else{
      if(this.checkedKeys.indexOf(data.index) != -1){
this.checkedKeys.splice(this.checkedKeys.indexOf(data.index),1)
      }
    }
    },
    getMenus(){
this.updateRole.menus = this.checkedKeys
return this.updateRole
    },
    //树形空间元素
    getAuthNodes(menuList) {
      return menuList.map((item) => {
        if (!item.children) {
          return {
            index: item.index,
            label: item.title,
          };
        } else {
          return {
            index: item.index,
            label: item.title,
            children: this.getAuthNodes(item.children),
          };
        }
      });
    },
  },
};
</script>

<style scoped>
</style>