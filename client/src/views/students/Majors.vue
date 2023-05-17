<template>
  <div>
    <div style="margin-top: 20px" class="btn_box">
      <el-button type="primary" @click="handleAdd">添加专业</el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="majors" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column label="专业名称" prop="majorname"> </el-table-column>
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
    <el-dialog title="用户编辑" :visible.sync="majorFormVisible" width="500px">
      <el-form
        status-icon
        ref="majorForm"
        :model="major"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="专业名称" prop="majorname">
          <el-input
            v-model="major.majorname"
            placeholder="请输入专业名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- button -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="majorFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            major._id == null
              ? addData('majorForm')
              : updateData('majorForm')
          "
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import majorApi from "@/api/major.js";
export default {
  data() {
    return {
      majorFormVisible: false,
      total: 0,
      totalPage:1,
      currentPage: 1,
      pageSize: 5,
      majors: [],
      major: {
        _id: null,
        majorname: "",
      },
      rules: {
        majorname: [
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
    this.fetchMajors();
  },
  methods: {
    //添加
    addData(formName) {
      console.log(formName);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          majorApi.add(this.major).then((response) => {
            const resp = response.data;
            console.log("resp", resp);
            if (resp.status == 0) {
              //新增成功,刷新列表
              this.fetchMajors();
              this.majorFormVisible = false;
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
          majorApi.update(this.major).then((response) => {
            const resp = response.data;
            console.log("resp", resp);
            if (resp.status === 0) {
              //新增成功,刷新列表
              this.fetchMajors();
              this.majorFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //获取专业列表,为总条数以及角色列表数据赋值
    fetchMajors() {
        if(this.currentPage > Math.ceil(this.totalPage)){
        this.currentPage = Math.ceil(this.totalPage)
      }
      majorApi
        .getMajorList(this.currentPage, this.pageSize)
        .then((response) => {
          const res = response.data;
          console.log(res);
          if (res.status === 0) {
            this.majors = res.data.data;
            this.total = res.data.total;
            
          this.totalPage = this.total/this.pageSize
        
          }
        });
    },
    //打开新增窗口
    handleAdd() {
      this.major = {
        _id: null,
        majorname: "",
      };
      this.majorFormVisible = true;
      this.$nextTick(() => {
        this.$refs["majorForm"].resetFields();
      });
      
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchMajors();
      console.log(`每页${val}条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchMajors();

      console.log(`当前页:${val}`);
    },
    handleEdit(_id) {
      this.handleAdd();
      majorApi.getById(_id).then((response) => {
        const resp = response.data;
        console.log("编辑专业", resp);
        if (resp.status === 0) {
          this.major = resp.data;
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
        
          majorApi.deleteById(_id).then((response) => {
            const resp = response.data;
            if (resp.status === 0) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.totalPage = (this.total-1)/this.pageSize
              this.fetchMajors();
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
