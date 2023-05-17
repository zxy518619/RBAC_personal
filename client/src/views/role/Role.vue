<template>
  <div>
    <div style="margin-top: 20px 0" class="btn_box">
      <el-button type="primary" @click="handlerAdd">创建角色</el-button>
      <el-button
        type="primary"
        :disabled="currentRow == null ? true : false"
        @click="roleAuthVisible = true"
        >设置角色权限</el-button
      >
    </div>
    <el-table
      :data="roleList"
      height="380"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
    >
      <el-table-column type="index" width="50" label="序号"> </el-table-column>
      <el-table-column prop="name" label="角色名称"> </el-table-column>
      <el-table-column prop="create_time" label="创建时间"  :formatter="resetDate"> </el-table-column>
      <el-table-column prop="auth_time" label="授权时间" :formatter="resetDate"> </el-table-column>
      <el-table-column prop="auth_name" label="授权人"> </el-table-column>
    </el-table>
    <!--  创建角色对话框-->
    <el-dialog title="添加角色" :visible.sync="roleFormVisible" width="500px">
      <el-form
        status-icon
        ref="roleForm"
        :model="role"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="roleRules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData('roleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 设置角色权限弹窗 -->
    <el-dialog
      title="设置角色权限"
      :visible.sync="roleAuthVisible"
      with="500px"
    >
      <!-- 添加一个ref属性,通过this.$ref[子组件ref名称]来获取 -->
      <Auth :role="currentRow" ref="auth" v-if="roleAuthVisible"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleAuthVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Auth from "./Auth.vue";
import roleApi from "@/api/role.js";
import memoryUtils from "@/utils/memoryUtils.js";
import {formateDate} from "@/utils/dateUtils.js"
export default {
  data() {
    return {
      currentRow: null,
      roleList: [
        /* {
          menus: [
            "/home",
            "/role",
            "/user",
            "/class",
            "/majors",
            "/school",
            "/student",
          ],
          _id: 1,
          name: "测试1",
          create_time: 1554639521749,
          __v: 0,
          auth_time: 1558410329436,
          auth_name: "admin",
        },
        {
          menus: ["/home", "/class", "/majors", "/school", "/student"],
          _id: 1,
          name: "测试2",
          create_time: 1554639521749,
          __v: 0,
          auth_time: 1558410329436,
          auth_name: "admin",
        },
        {
          menus: ["/home", "/role", "/user"],
          _id: 1,
          name: "测试3",
          create_time: 1554639521749,
          __v: 0,
          auth_time: 1558410329436,
          auth_name: "admin",
        }, */
      ],
      role: {
        name: "",
        menus: [],
      },
      roleFormVisible: false,

      roleRules: {
        name: [{ required: true, message: "角色名必须输入", trigger: "blur" }],
      },
      roleAuthVisible: false, //设置角色权限弹窗是否展示
    };
  },

  components: { Auth },
  mounted() {
    this.fetchData();
  },

  methods: {
    resetDate(row,column,cellValue,index){
      return formateDate(cellValue)
    },
    updateRole() {
      const newRole = this.$refs["auth"].getMenus();
      this.currentRow.menus = newRole.menus;
      this.currentRow.name = newRole.name;

      this.currentRow.auth_name = memoryUtils.user.username;
      roleApi.updateRole(this.currentRow).then((response) => {
        const res = response.data;
        console.log(res);
        if (res.status === 0) {
          this.$message({
            message: "更新成功",
            type: "success",
          });
          this.roleAuthVisible = false;
          this.fetchData();
        }
      });
    },
    handleUpdateAuth() {
    
    },
    updateData() {},
    /* 测试 */
    test() {
      console.log(111);
    },
    /********/
    handlerAdd() {
      this.roleFormVisible = true;
      this.$nextTick(() => {
        this.$refs["roleForm"].resetFields();
      });
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          roleApi.addRole(this.role.name).then((response) => {
            const res = response.data;
            if (res.status === 0) {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.roleFormVisible = false;
              this.fetchData();
            }
          });
        } else {
          return false;
        }
      });
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      console.log(val);
    },
    fetchData() {
      roleApi.getRoleList().then((response) => {
        const res = response.data;
        if (res.status === 0) {
          this.roleList = res.data;
        }
      });
    },
  },
};
</script>

<style scoped>
</style>