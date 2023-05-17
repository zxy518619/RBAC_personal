<template>
  <div>
    <el-form
      :model="updateStudent"
      :rules="rules"
      ref="studentForm"
      label-width="100px"
      class="update-form"
      style="width: 100%; height: 100%"
    >
      <el-form-item label="学员姓名" prop="name">
        <el-input v-model="updateStudent.name"></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-select v-model="updateStudent.gender" placeholder="请点击选择">
          <el-option
            v-for="option in genderOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所在学校" prop="school">
        <el-autocomplete
          class="inline-input"
          v-model="updateStudent.school"
          :fetch-suggestions="querySearchSchool"
        >
        </el-autocomplete>
      </el-form-item>

      <el-form-item label="专业" prop="major">
        <el-autocomplete
          class="inline-input"
          v-model="updateStudent.major"
          :fetch-suggestions="querySearchMajor"
        >
        </el-autocomplete>
      </el-form-item>

      <el-form-item label="年级" prop="grade">
        <el-select v-model="updateStudent.grade" placeholder="请点击选择">
          <el-option
            v-for="option in gradeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="学历" prop="education">
        <el-select v-model="updateStudent.education" placeholder="请点击选择">
          <el-option
            v-for="option in educationOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="学习方向" prop="direction">
        <el-select v-model="updateStudent.direction" placeholder="请点击选择">
          <el-option
            v-for="option in directionOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="身份证号" prop="id_number">
        <el-input v-model="updateStudent.id_number"></el-input>
      </el-form-item>

      <el-form-item label="电话号码" prop="phone">
        <el-input v-model="updateStudent.phone"></el-input>
      </el-form-item>

      <el-form-item label="家长姓名" prop="parent">
        <el-input v-model="updateStudent.parent"></el-input>
      </el-form-item>

      <el-form-item label="家长联系电话" prop="parent_phone">
        <el-input v-model="updateStudent.parent_phone"></el-input>
      </el-form-item>

      <el-form-item label="家庭住址" prop="address">
        <el-input v-model="updateStudent.address"></el-input>
      </el-form-item>

      <el-form-item label="QQ号码" prop="qq">
        <el-input v-model="updateStudent.qq"></el-input>
      </el-form-item>

      <el-form-item label="所在班级" prop="class">
        <el-select v-model="updateStudent.class" placeholder="请点击选择">
          <el-option
            v-for="option in classOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="入学时间" prop="admission_date">
        <el-date-picker
          v-model="updateStudent.admission_date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="授课教师" prop="teacher_id">
        <el-select v-model="updateStudent.teacher_id" placeholder="请点击选择">
          <el-option
            v-for="option in teacherOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="学管" prop="manager_id">
        <el-select v-model="updateStudent.manager_id" placeholder="请点击选择">
          <el-option
            v-for="option in managerOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="照片" prop="pictures">
        <el-upload
          :action="baseApi + '/manage/img/upload'"
          list-type="picture-card"
          :auto-upload="true"
          :file-list="fileList"
          name="image"
          accept="image/*"
          :on-change="handleChange"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <i class="el-icon-download"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="备注信息">
        <vue-tinymce v-model="updateStudent.note" 
        :setting="setting" >
        </vue-tinymce>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="
            updateStudent._id == null
              ? addData('studentForm')
              : updateData('studentForm')
          "
        >
          确定
        </el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import userApi from "@/api/user";
import roleApi from "@/api/role";
import classApi from "@/api/class";
import schoolApi from "@/api/school";
import majorApi from "@/api/major";
import studentApi from '@/api/student'
export default {
  data() {
    const validateIdNumber = (rule, value, callback) => {
      value = value.trim();
      const _IDRe18 =
        /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      const _IDre15 =
        /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/;
        if (_IDRe18.test(value) ||_IDre15.test(value)) {
        callback();
      }  else {
        callback(new Error("重新输入"));
      }
    };
    const validatePhone = (rule, value, callback) => {
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
     
       // 富文本编辑框的设置内容
      setting: {
        //去除文件栏
        menubar: false,
        //定义工具栏
        toolbar:
          "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar:
          "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        //工具栏模块
        plugins: "link image media table lists fullscreen quickbars imagetools",
        height: 350,
      },
      baseApi:process.env.VUE_APP_BASE_API,
      baseUrl:process.env.VUE_APP_SERVICE_URL,
      fileList:[],
      dialogVisible:false,
      pictureDialogVisible: false,
      dialogImageUrl: "",
      disabled: false,
      updateStudent: {
        _id: null,
        name: "",
        gender: "",
        school: "",
        major: "",
        grade: "",
        education: "",
        direction: "",
        id_number: "",
        phone: "",
        parent: "",
        parent_phone: "",
        address: "",
        qq: "",
        class: "",
        qq: "",
        admission_date: "",
        teacher_id: "",
        manager_id: "",
        pictures: "",
        note: "",
      },
      rules: {
        name:[{required:true,message:"请输入",trigger:"blur"}],
        gender:[{required:true,message:"请输入",trigger:"blur"}],
        direction:[{required:true,message:"请输入",trigger:"blur"}],
        id_number:[{validator:validateIdNumber,message:"请输入",trigger:"blur"}],
        phone:[{validator:validatePhone,message:"请输入",trigger:["blur","change"]}],
        class:[{required:true,message:"请输入",trigger:"blur"}],
        admission_date:[{required:true,message:"请输入",trigger:"blur"}],
        teacher_id:[{required:true,message:"请输入",trigger:"blur"}],
        manager_id:[{required:true,message:"请输入",trigger:"blur"}],
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

  //过滤器,格式化数据
  mounted() {
    this.getRole();
    this.getUser();
    this.getClassAll();
    this.getSchoolAll();
    this.getMajorAll();
    this.getStudent();
  },
  methods: {
    getStudent(){
      const{_id} = this.$route.params
      if(_id !== "-1"){
studentApi.getById(_id).then((response)=>{
  const resp = response.data;
  if(resp.status === 0){
    this.updateStudent = resp.data;
    const{pictures} = resp.data
    if(pictures && pictures.length>0){
      this.fileList = pictures.map((img,index)=>({
        uid:-index,
        name:img,
        status:"success",
        url:this.baseUrl+"/upload/"+img

      }))
    }
  }
})
      }
    },
    //
    handleRemove(file, fileList) {
      studentApi.reqDeleteImg(file.name).then((response) => {
        const resp = response.data;
        if (resp.status === 0) {
          this.fileList.splice(this.fileList.indexOf(file.name),1);
        }
      });
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleDownload(file) {
      console.log(file);
    },
    handleChange(file, fileList) {
      if (file.status === "success") {
        const result = file.response;
        if (result.status === 0) {
          const { name, url } = result.data;
          file = fileList[fileList.length-1];
          file.name = name;
          file.url = url
        }
      }
      this.fileList = fileList
    },
    getImgs(){
      return this.fileList.map((file)=>file.name)
    },
    querySearchSchool(queryString, cb) {
      var schoolOptions = this.schoolOptions;
      var results = queryString
        ? schoolOptions.filter(this.createFilter(queryString))
        : schoolOptions;
      cb(results);
    },
    querySearchMajor(queryString, cb) {
      var majorOptions = this.majorOptions;
      var results = queryString
        ? majorOptions.filter(this.createFilter(queryString))
        : majorOptions;
      cb(results);
    },

    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        console.log("valid",valid);
        if (valid) {
          this.updateStudent.pictures = this.getImgs()
          console.log("this.updateStudent",this.updateStudent);
          studentApi.add(this.updateStudent).then(response=>{
            const resp = response.data;
            console.log("resp",resp);
            if(resp.status === 0){
              this.$router.replace('/student')
            }
          })
        } else {
          return false;
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateStudent.pictures = this.getImgs()
          studentApi.update(this.updateStudent).then(response=>{
            const resp = response.data;
            if(resp.status == 0){
              this.$router.replace('/student')
            }
          })
        } else {
          return false;
        }
      });
    },

    getClassAll() {
      classApi.getClassAll().then((response) => {
        const resp = response.data;
        if (resp.status == 0) {
          this.classOptions = resp.data;
        }
      });
    },
    getSchoolAll() {
      schoolApi.getSchoolAll().then((response) => {
        const resp = response.data;
        if (resp.status == 0) {
          this.schoolOptions = resp.data;
          const arr = resp.data;
          for (let i = 0; i < arr.length; i++) {
            this.schoolOptions[i].value = arr[i].schoolname;
          }
        }
      });
    },
    getMajorAll() {
      majorApi.getMajorAll().then((response) => {
        const resp = response.data;
        if (resp.status == 0) {
          this.majorOptions = resp.data;
          const arr = resp.data;
          for (let i = 0; i < arr.length; i++) {
            this.majorOptions[i].value = arr[i].majorname;
          }
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
  },
};
</script>

<style scoped>
.el-form {
  margin-top: 20px;
}
.el-input {
  width: 224px;
}
</style>