<template>
  <div>
    <div style="margin-top: 20px" class="btn_box">
      <el-button type="primary" @click="handleAdd">添加学校</el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="schools" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column label="学校名称" prop="schoolname"> </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row._id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 新增/编辑窗口 -->
    <el-dialog title="用户编辑" :visible.sync="schoolFormVisible" width="500px">
      <el-form
        status-icon
        ref="schoolForm"
        :model="school"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="学校名称" prop="schoolname">
          <el-input
            v-model="school.schoolname"
            placeholder="请输入学校名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- button -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="schoolFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            school._id == null
              ? addData('schoolForm')
              : updateData('schoolForm')
          "
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import schoolApi from "@/api/school.js";
export default {
  data() {
    return {
      schoolFormVisible: false,
      total: 0,
      totalPage:1,
      currentPage: 1,
      pageSize: 5,
      schools: [],
      school: {
        _id: null,
        schoolname: "",
      },
      rules: {
        schoolname: [
          {
            required: true,
            message: "必须输入",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },

  components: {},
  mounted() {
    this.fetchSchools();
  },
  methods: {
    //添加
    addData(formName) {
      console.log(formName);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          schoolApi.add(this.school).then((response) => {
            const resp = response.data;
            console.log("resp", resp);
            if (resp.status == 0) {
              //新增成功,刷新列表
              this.fetchSchools();
              this.schoolFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //修改
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          schoolApi.update(this.school).then((response) => {
            const resp = response.data;
            console.log("resp", resp);
            if (resp.status === 0) {
              //新增成功,刷新列表
              this.fetchSchools();
              this.schoolFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //获取学校列表,为总条数以及角色列表数据赋值
    fetchSchools() {
      if(this.currentPage > Math.ceil(this.totalPage)){
        this.currentPage = Math.ceil(this.totalPage)
      }
      schoolApi
        .getSchoolList(this.currentPage, this.pageSize)
        .then((response) => {
          const res = response.data;
          console.log(res);
          if (res.status === 0) {
            this.schools = res.data.data;
            this.total = res.data.total;
            
          this.totalPage = this.total/this.pageSize
        
          }
        });
    },
    //打开新增窗口
    handleAdd() {
      this.school = {
        _id: null,
        schoolname: "",
      };
      this.schoolFormVisible = true;
      this.$nextTick(() => {
        this.$refs["schoolForm"].resetFields();
      });
      
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchSchools();
      console.log(`每页${val}条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchSchools();

      console.log(`当前页:${val}`);
    },
    handleEdit(_id) {
      this.handleAdd();
      schoolApi.getById(_id).then((response) => {
        const resp = response.data;
        console.log("编辑学校", resp);
        if (resp.status === 0) {
          this.school = resp.data;
        }
      });
      console.log("编辑");
    },
    handleDelete(_id) {
       this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        
          schoolApi.deleteById(_id).then((response) => {
            const resp = response.data;
            if (resp.status === 0) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.totalPage = (this.total-1)/this.pageSize
              this.fetchSchools();
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
</style>
