<template>
  <div>
    <div style="margin-top: 20px" class="btn_box">
      <el-button type="primary" @click="handleAdd">新增用户</el-button>
    </div>
    <el-table :data="users" height="380" border style="width: 100%">
      <el-table-column prop="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="phone" label="电话号码"> </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        :formatter="resetDate"
      >
      </el-table-column>
      <el-table-column prop="role_id" label="所属角色" :formatter="formatRole">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)"
            >编辑</el-button
          >
          <el-button size="mini" @click="handleDelete(scope.row._id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15,20]"
      :page-size="pageSize"
      layout="total,sizes,prev, pager, next,jumper"
      :total="total"
    >
    </el-pagination>

    <el-dialog title="用户编辑" :visible.sync="userFormVisible" width="500px">
      <el-form
        status-icon
        ref="userForm"
        :model="user"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select
            v-model="user.role_id"
            class="filter-item"
            placeholder="点击选择角色"
          >
            <el-option
              v-for="option in roleOptions"
              :key="option._id"
              :label="option.name"
              :value="option._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="user.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            user._id == null ? addData('userForm') : updateData('userForm')
          "
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>


<script>
import userApi from "@/api/user";
import { formateDate } from "@/utils/dateUtils";
export default {
  data() {
    //自定义校验规则(用户名)
    var validateUserName = (rule, value, callback) => {
      value = value.trim();
      const length = value && value.length;
      const pwdReg = /^[a-zA-Z0-9_]+$/;
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (length < 4 || length > 12) {
        callback(new Error("长度在4~12之间"));
      } else if (!pwdReg.test(value)) {
        callback(new Error("账号必须是英文,数字或下划线组成"));
      } else {
        callback();
      }
    };
    //自定义校验规则(手机号)
    var validatePhone = (rule, value, callback) => {
      value = value.trim();
      const phoneReg =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!phoneReg.test(value)) {
        callback(new Error("请输入正确格式手机号"));
      } else {
        callback();
      }
    };

    return {
      rules: {
        username: [
          {
            required: true,
            validator: validateUserName,
            trigger: ["blur", "change"],
          },
        ],
        password: [
          { required: true, message: "不能为空", trigger: "blur" },
          { min: 3, message: "不得小于4位", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        role_id: [{ required: true, message: "请选择角色", trigger: "blur" }],
        phone: [
          {
            required: true,
            validator: validatePhone,
            trigger: ["blur", "change"],
          },
        ],
      },
      userFormVisible: false,
      total: 0,
      totalPage:1,
      currentPage: 1,
      pageSize: 5,
      user: {
        _id: null,
        username: "",
        password: "",
        name: "",
        phone: "",
        role_id: "",
      },
      roleOptions: [],
      users: [],
    };
  },

  components: {},
  mounted() {
    this.fetchUsers();
  },

  methods: {
    //格式化角色名称
    formatRole(row, colum, cellValue, index) {
      let role = this.roleOptions.find((item) => item._id == cellValue) || {};
      return role.name;
    },

    //打开添加用户对话框
    handleAdd() {
      this.userFormVisible = true;
      this.$nextTick(() => {
        this.$refs["userForm"].resetFields();
        this.user = {
          _id: null,
          username: "",
          password: "",
          name: "",
          phone: "",
          role_id: "",
        };
      });
    },
    //添加用户
    addData(formName) {
      console.log(111);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userApi.add(this.user).then((response) => {
            const resp = response.data;
            console.log("resp",resp);
            if (resp.status == 0) {
              //新增成功,刷新列表
              this.fetchUsers();
              this.userFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //更新用户
    updateData(formName) {
      console.log(111);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userApi.update(this.user).then((response) => {
            const resp = response.data;
            if (resp.status == 0) {
              //新增成功,刷新列表
              this.fetchUsers();
              this.userFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },

    fetchUsers() {
      if(this.currentPage > Math.ceil(this.totalPage)){
        this.currentPage = Math.ceil(this.totalPage)
      }
      userApi.getUserList(this.currentPage, this.pageSize).then((response) => {
        const resp = response.data;
        if (resp.status == 0) {
          this.users = resp.data.data;
          this.total = resp.data.total;
          this.roleOptions = resp.data.roles;
          this.totalPage = this.total/this.pageSize
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchUsers()
      console.log(`每页${val}条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val
       this.fetchUsers()
       
      console.log(`当前页:${val}`);
    },
    resetDate(row, colum, cellValue, index) {
      return formateDate(cellValue);
    },
    handleEdit(_id) {
      this.handleAdd();
      userApi.getById(_id).then((response) => {
        const resp = response.data;
        if (resp.status === 0) {
          this.user = resp.data;
        }
      });
      console.log("编辑", _id);
    },
    handleDelete(_id) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          userApi.deleteById(_id).then((response) => {
            const resp = response.data;
            if (resp.status === 0) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.totalPage = (this.total-1)/this.pageSize
              this.fetchUsers();
            }
          });
        })
        .catch(() => {
          //取消删除,不用管
        });
      console.log("删除", _id);
    },
  },
};
</script>

<style scoped>
</style>