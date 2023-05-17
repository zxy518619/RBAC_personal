<template>
  <div>
    <!-- 条件查询 -->
    <el-form
      :inline="true"
      :model="searchMap"
      style="margin: 20px"
      ref="searchForm"
    >
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="根据姓名查询">
        </el-input>
      </el-form-item>

      <el-form-item prop="direction">
        <el-select v-model="searchMap.direction" placeholder="根据学习方向查询">
          <el-option
            v-for="option in directionOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="class">
        <el-select v-model="searchMap.class" placeholder="根据班级查询">
          <el-option
            v-for="option in classOptions"
            :key="option.id"
            :label="option.name"
            :value="option._id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="teacher_id">
        <el-select
          v-model="searchMap.teacher_id"
          placeholder="根据授课教师查询"
        >
          <el-option
            v-for="option in teacherOptions"
            :key="option.id"
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
            :key="option.id"
            :label="option.name"
            :value="option._id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
      
      </el-form-item>
    </el-form>
    <!--  -->
    <el-table :data="students" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="student-table-expand">
            <el-form-item label="学员姓名">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.gender | dataFilter(genderOptions) }}</span>
            </el-form-item>
            <el-form-item label="所在学校">
              <span>{{ props.row.school }}</span>
            </el-form-item>
            <el-form-item label="专业">
              <span>{{ props.row.major }}</span>
            </el-form-item>
            <el-form-item label="年级">
              <span>{{ props.row.grade | dataFilter(gradeOptions) }}</span>
            </el-form-item>
            <el-form-item label="学历">
              <span>{{
                props.row.education | dataFilter(educationOptions)
              }}</span>
            </el-form-item>
            <el-form-item label="学习方向">
              <span>{{
                props.row.direction | dataFilter(directionOptions)
              }}</span>
            </el-form-item>
            <el-form-item label="身份证号">
              <span>{{ props.row.id_number }}</span>
            </el-form-item>
            <el-form-item label="电话号码">
              <span>{{ props.row.phone }}</span>
            </el-form-item>
            <el-form-item label="家长姓名">
              <span>{{ props.row.parent }}</span>
            </el-form-item>
            <el-form-item label="家长联系电话">
              <span>{{ props.row.parent_phone }}</span>
            </el-form-item>
            <el-form-item label="家庭住址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="QQ号码">
              <span>{{ props.row.qq }}</span>
            </el-form-item>
            <el-form-item label="所在班级">
              <span>{{
                props.row.class | teacherOrManagerFilter(classOptions)
              }}</span>
            </el-form-item>
            <el-form-item label="入学时间">
              <span>{{ props.row.admission_date }}</span>
            </el-form-item>
            <el-form-item label="授课教师">
              <span>{{
                props.row.teacher_id | teacherOrManagerFilter(teacherOptions)
              }}</span>
            </el-form-item>
            <el-form-item label="学管">
              <span>{{
                props.row.manager_id | teacherOrManagerFilter(managerOptions)
              }}</span>
            </el-form-item>
            <el-form-item label="照片">
              <span>{{ props.row.pictures }}</span>
            </el-form-item>
            <el-form-item label="备注信息">
              <span>{{ props.row.note }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="60"> </el-table-column>
      <el-table-column label="学员姓名" prop="name"> </el-table-column>
      <el-table-column label="性别" prop="gender">
        <template slot-scope="scope">
          <span>{{ scope.row.gender | dataFilter(genderOptions) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学习方向" prop="direction">
        <template slot-scope="scope">
          <span>{{ scope.row.direction | dataFilter(directionOptions) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" prop="phone"> </el-table-column>
      <el-table-column label="所在班级" prop="class">
        <template slot-scope="scope">
          <span>{{
            scope.row.class | teacherOrManagerFilter(classOptions)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入学时间" prop="admission_date">
      </el-table-column>
      <el-table-column label="授课教师" prop="teacher_id">
        <template slot-scope="scope">
          <span>{{
            scope.row.teacher_id | teacherOrManagerFilter(teacherOptions)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学管" prop="manager_id">
        <template slot-scope="scope">
          <span>{{
            scope.row.manager_id | teacherOrManagerFilter(managerOptions)
          }}</span>
        </template>
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
      :page-sizes="[10, 15, 20, 25]"
      :page-size="pageSize"
      layout="total,sizes,prev, pager, next,jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import studentApi from "@/api/student.js";
import userApi from "@/api/user.js";
import roleApi from "@/api/role.js";
import classApi from "@/api/class.js";

export default {
  data() {
    return {
      students: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      totalPage: 1,
      searchMap: {
        name: "",
        direction: "",
        teacher_id: "",
        manager_id: "",
        class: "",
      },
      teacherOptions: [],
      managerOptions: [],
      classOptions: [],
      //角色为教师的id
      teacher_role_id: "",
      //角色为学管的id
      manager_role_id: "",
      //表格数据格式化的各种列表
      genderOptions: [
        { type: "0", name: "男" },
        { type: "1", name: "女" },
      ],
      gradeOptions: [
        { type: "1", name: "大一" },
        { type: "2", name: "大二" },
        { type: "3", name: "大三" },
        { type: "4", name: "大四" },
        { type: "5", name: "在读研究生" },
      ],
      educationOptions: [
        { type: "1", name: "专科" },
        { type: "2", name: "本科" },
        { type: "3", name: "硕士" },
        { type: "4", name: "社会" },
      ],
      directionOptions: [
        { type: "1", name: "web前端" },
        { type: "2", name: "java" },
        { type: "3", name: "ui/ue" },
        { type: "4", name: "c/c++" },
      ],
    };
  },

  components: {},
  mounted() {
    this.fetchStudents();
    this.getRole(), this.getUser(), this.getClassAll();
  },
  //过滤器,格式化数据
  filters: {
    teacherOrManagerFilter(_id, options) {
      //console.log(_id, options);
      const obj = options.find(
        (item) =>
          /* 箭头函数如果写了大括号,就需要写return */
          item._id == _id
      );
      return obj ? obj.name : null;
    },
    dataFilter(type, options) {
      const obj = options.find((item) => {
        return item.type == type;
      });
      return obj ? obj.name : null;
    },
  },
  methods: {
    handleAdd() {
      this.$router.push("/student/update/-1");
    },
    searchData() {
      this.currentPage = 1;
      this.fetchStudents();
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.fetchStudents();
    },

    getClassAll() {
      classApi.getClassAll().then((response) => {
        const resp = response.data;

        if (resp.status == 0) {
          this.classOptions = resp.data;
        }
      });
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
        }
      });
    },
    fetchStudents() {
      if(this.currentPage > Math.ceil(this.totalPage)){
        this.currentPage = Math.ceil(this.totalPage)
      }
      studentApi
        .getStudentList(this.currentPage, this.pageSize, this.searchMap)
        .then((response) => {
          const res = response.data;

          if (res.status === 0) {
            this.students = res.data.data;
            this.total = res.data.total;
            this.totalPage = this.total / this.pageSize;
          }
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchStudents();
      console.log(`每页${val}条`);
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchStudents();
      console.log(`当前页:${val}`);
    },
    handleEdit(_id) {
      this.$router.push(`/student/update/${_id}`)
    },
    handleDele(_id) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
       console.log(2332);
          studentApi.delete(_id).then((response) => {
            const resp = response.data;
            if (resp.status === 0) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.totalPage = (this.total-1)/this.pageSize
              this.fetchStudents();
            }
          });
        })
        .catch(() => {
          //取消删除,不用管
        });
      console.log("删除");
    },
  },
};
</script>

<style scoped>
.student-table-expand {
  font-size: 0;
  padding: 20px;
}
.student-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.student-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>