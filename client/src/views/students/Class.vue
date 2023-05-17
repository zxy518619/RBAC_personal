<template>
  <div>
    <!-- 条件查询 -->
    <el-form
      :inline="true"
      :model="searchMap"
      style="margin: 20px"
      ref="searchForm"
    >
      <el-form-item prop="teacher_id">
        <el-select v-model="searchMap.teacher_id" placeholder="根据教师查询">
          <el-option
            v-for="option in teacherOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="manager_id">
        <el-select v-model="searchMap.manager_id" placeholder="根据学管查询">
          <el-option
            v-for="option in managerOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')"
          >重置</el-button
        >
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table :data="classes" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column label="班级名称" prop="name"> </el-table-column>
      <el-table-column
        label="授课教师"
        prop="teacher_id"
        :formatter="formatTeacher"
      >
      </el-table-column>
      <el-table-column
        label="学管"
        prop="manager_id"
        :formatter="formatManager"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDele(scope.row._id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total,sizes,prev, pager, next,jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 新增窗口 -->

    <el-dialog title="教师编辑" :visible.sync="dialogFormVisible">
      <el-form
        status-icon
        ref="classForm"
        :model="updateClass"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="updateClass.name"></el-input>
        </el-form-item>
        <el-form-item label="授课教师" prop="teacher_id">
          <el-select
            v-model="updateClass.teacher_id"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="option in teacherOptions"
              :key="option._id"
              :label="option.name"
              :value="option._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 学管 -->
        <el-form-item label="学管" prop="manager_id">
          <el-select
            v-model="updateClass.manager_id"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="option in managerOptions"
              :key="option._id"
              :label="option.name"
              :value="option._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            updateClass._id === null
              ? addData('classForm')
              : updateData('classForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import classApi from "@/api/class";
import userApi from "@/api/user";
import roleApi from "@/api/role";
export default {
  data() {
    return {
      rules: {
        name: [
          {
            required: "true",
            message: "必须填写",
            trigger: "blur",
          },
        ],
        teacher_id: [
          {
            required: "true",
            message: "选择教师",
            trigger: "blur",
          },
        ],
        manager_id: [
          {
            required: "true",
            message: "选择学管",
            trigger: "blur",
          },
        ],
      },
      classes: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      totalPage: 1,
      updateClass: {
        _id: null,
        name: "",
        teacher_id: "",
        manager_id: "",
      },
      search: {
        teacher: "",
        manager: "",
      },
      searchMap: {
        teacher_id: "",
        manager_id: "",
      },
      userAll: [],
      dialogFormVisible: false,
      teacherOptions: [],
      managerOptions: [],
      teacher_role_id: "",
      manager_role_id: "",
    };
  },

  components: {},
  mounted() {
    this.fetchClass();
    this.getRole(), this.getUser();
  },
  methods: {
    updateData() {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("add", this.updateClass);
          classApi.updateClass(this.updateClass).then((response) => {
            const resp = response.data;
            if (resp.status === 0) {
              this.fetchClass();
              this.dialogFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("add", this.updateClass);
          classApi.add(this.updateClass).then((response) => {
            const resp = response.data;
            if (resp.status === 0) {
              this.fetchClass();
              this.dialogFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //格式化数据
    formatTeacher(row, colum, cellValue, index) {
      const teacher =
        this.teacherOptions.find((item) => item._id == cellValue) || {};
      return teacher.name;
    },
    //格式化数据
    formatManager(row, colum, cellValue, index) {
      const manager =
        this.managerOptions.find((item) => item._id == cellValue) || {};
      return manager.name;
    },
    //条件查询回调函数,查询后如果页码对不上会出现空页
    searchData() {
      this.currentPage = 1;
      this.fetchClass();
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.fetchClass();
    },
    getRole() {
      roleApi.getRoleList().then((response) => {
        const resp = response.data;
        if (resp.status == 0) {
          resp.data.forEach((item) => {
            if (item.name == "教师") {
              this.teacher_role_id = item._id;
            } else if (item.name == "学管") {
              this.manager_role_id = item._id;
            }
          });
        }
      });
    },
    getUser() {
      userApi.getUserAll().then((response) => {
        const resp = response.data;
        if (resp.status == 0) {
          resp.data.forEach((item) => {
            if (item.role_id == this.teacher_role_id) {
              this.teacherOptions.push(item);
            } else if (item.role_id == this.manager_role_id) {
              this.managerOptions.push(item);
            }
          });
          console.log(this.teacherOptions, this.managerOptions);
        }
      });
    },
    handleAdd() {
    this.updateClass = {
        _id: null,
        name: "",
        teacher_id: "",
        manager_id: "",
        stage: "",
      },
        this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["classForm"].resetFields();
      });
    },
    handleEdit(_id) {
      this.handleAdd();
      classApi.getById(_Id).then((response) => {
        const resp = response.data;
        if (resp.status === 0) {
          this.updateClass = resp.data;
        }
      });
    },
    handleDele(_id) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
       console.log(2332);
          classApi.delete(_id).then((response) => {
            const resp = response.data;
            if (resp.status === 0) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.totalPage = (this.total-1)/this.pageSize
              this.fetchClass();
            }
          });
        })
        .catch(() => {
          //取消删除,不用管
        });
      console.log("删除");
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchClass();
      console.log(`每页${val}条`);
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchClass();
      console.log(`当前页:${val}`);
    },
    fetchClass() { if(this.currentPage > Math.ceil(this.totalPage)){
        this.currentPage = Math.ceil(this.totalPage)
      }
      if(this.currentPage > Math.ceil(this.totalPage)){
        this.currentPage = Math.ceil(this.totalPage)
      }
      classApi
        .getClassList(this.currentPage, this.pageSize, this.searchMap)
        .then((response) => {
          const res = response.data;
          console.log(res);
          if (res.status === 0) {
            this.classes = res.data.data;
            this.total = res.data.total;

            this.totalPage = this.total / this.pageSize;
          }
        });
    },
    onsubmit() {
      console.log("submit!!");
    },
  },
};
</script>

<style scoped>
</style>