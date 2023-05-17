<template>
  <div class="header">
    <a href="#">
      <img class="logo" src="@/assets/logo.png" width="25px" />
      <span class="title">学员管理系统</span>
    </a>
    <!-- 下拉菜单 -->
    <el-dropdown @command="handleCommand" trigger="click">
      <span class="el-dropdown-link">
        {{ user.username }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">修改密码</el-dropdown-item>
        <el-dropdown-item command="b">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span class="date-weather">
      <span class="date">{{ currentTime }}</span>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <span class="weather"
        ><p :class="wea_img"></p>
        &nbsp;&nbsp;{{ wea }} &nbsp;&nbsp; {{ tem_day }}/{{
          tem_night
        }}C&deg;</span
      >
    </span>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="userForm"
        status-icon
        :rules="rules"
        ref="userForm"
        label-width="100px"
        style="width: 400px"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="userForm.oldPass"> </el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="Pass">
          <el-input type="password" v-model="userForm.pass"> </el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="userForm.checkPass"> </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('userForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { reqWeather } from "@/api/jsonp.js";
import { formateTime } from "@/utils/dateUtils.js";
import memoryUtils from "@/utils/memoryUtils";
import storageUtils from "@/utils/storageUtils.js";
import userApi from "@/api/user.js"
export default {
  data() {
    const validateOldPass = (rule,value,callback)=>{
        userApi.checkPwd(this.user._id,value).then(response=>{
            const resp = response.data
            if(resp.status === 0){
                callback()
            }else{
                callback(new Error(resp.msg))
            }
        })
    }
    const validatePass = (rule,value,callback)=>{
        console.log(value, this.userForm.pass);
        if(value !== this.userForm.pass){
            callback(new Error("两次密码不一致"))
        }else{
            callback()
        }
    }
    return {
        user:JSON.parse(localStorage.getItem('msm-user')),
      dialogFormVisible: false,
      userForm: {
        oldPass: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        oldPass:[{required:true,message:"不能为空",trigger:"blur"},
        { validator: validateOldPass, trigger: 'blur' }],

        pass: [{required:true,message:"不能为空",trigger:"blur"}],
           

        checkPass: [
            {required:true,message:"不能为空",trigger:"blur"},
            { validator: validatePass, trigger: 'change' }
          ],
      },
      user: memoryUtils.user,
      currentTime: formateTime(Date.now()),
      tem_day: "",
      tem_night: "",
      wea: "",
      wea_img: "",
    };
  },

  components: {},

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
            userApi.updatePwd(this.user._id,this.userForm.checkPass).then(response=>{
                const resp = response.data
                if(resp.status == 0){
                    this.handleLogout();
                    this.dialogFormVisible  = false;
                }
            })
        } else {
            console.log("error submit");
          return false;
        }
      });
    },
    handlePwd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["userForm"].resetFields();
      });
    },
    handleCommand(command) {
      this.$message("click on item" + command);
      switch (command) {
        case "a":
          this.handlePwd();
          break;
        case "b":
          memoryUtils.user = {};
          storageUtils.removeUser();
          this.$router.replace("/login");

          break;
        default:
          break;
      }
    },
    handleLogout(){
        memoryUtils.user = {};
        storageUtils.removeUser();
        this.$router.replace('/login')
    },
    getWeather() {
      reqWeather("哈尔滨").then((response) => {
        const { tem_day, tem_night, wea, wea_img } = response;
        const weaImgs = {
          xue: "el-icon-light-rain",
          lei: "el-icon-lighting",
          shachen: "el-icon-sunrise",
          wu: "el-icon-cloudy-and-sunny",
          bingbao: "el-icon-light-rain",
          yun: "el-icon-heavy-rain",
          yu: "el-icon-heavy-rain",
          yin: "el-icon-partly-cloudy",
          qing: "el-icon-sunny",
        };
        (this.tem_day = tem_day),
          (this.tem_night = tem_night),
          (this.wea = wea);
        this.wea_img = weaImgs[wea_img];
        console.log(weaImgs);
      });
    },
    getTime() {
      setInterval(() => {
        this.currentTime = formateTime(Date.now());
      }, 1000);
    },
  },
  mounted() {
    this.getWeather(), this.getTime();
  },
};
</script>

<style scoped>
.logo {
  vertical-align: middle;
  padding: 0 10px 0 40px;
}
.company {
  position: absolute;
  color: white;
}
.date-weather {
  float: right;
  color: white;
  margin-right: 30px;
  font-size: 12px;
}
.title {
  color: #fff;
  position: absolute;
}
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
</style>