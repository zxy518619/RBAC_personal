<template>
 <div class="login-container">
 <el-form :model="form" status-icon :rules="rules" ref="form" label-width="80px" class="login-form">
  <h2 class="login-title">登陆</h2>
  <el-form-item label="账号" prop="username">
    <el-input type="text" v-model="form.username" ></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input type="password" v-model="form.password"></el-input>
  </el-form-item>
  
  <el-form-item>
    <el-button type="primary" @click="onSubmit('form')">登入</el-button>
   
  </el-form-item>
</el-form>
 </div>
</template>

<script>
import{login} from "@/api/login.js";
import memoryUtils from"@/utils/memoryUtils"
import storageUtils from'@/utils/storageUtils'
export default {
 data () {
  var validateUserName = (rule,value,callback) =>{
    value=value.trim()
    const length = value && value.length
    const reg = /^[a-zA-Z0-9_]+$/
    if(value === ""){
callback(new Error("请输入账号"));
    }else if(length <4 || length>12){
callback(new Error("长度应介于4到12之间"))
    }else if(!reg.test(value)){
callback(new Error("账号包含非法字符"))
    }else{
callback()
    }
  }
 return {
    form:{
        username:'',
        password:"",
    },
    //校验规则
    rules:{
      username:[
        {
          required:true,validator:validateUserName,trigger:["blur","change"]
          //必填            //自定义验证规则           何时触发:失去焦点  发生更改
        }
      ],
      password:[
        {
         required:true,message:'请输入密码', trigger:["blur","change"]
        }
      ]
    }
 }
 },

 components: {},

 methods: {
    //登陆
    onSubmit(formName){
      this.$refs[formName].validate(async(valid)=>{
        if(valid){
          let result = await login(this.form.username,this.form.password);
          result = result.data
          
          if(result.status === 0 ){
          this.$message({
          message:"登陆成功",
          type:"success"
          });
          //保存用户数据
          const user = result.data
          storageUtils.saveUser(user)
          memoryUtils.user = user
          this.$router.replace("/")
          }
          
        }else{
          console.log(error+'error submit');
          return false
        }
      })
    }
 }
}
</script>

<style scoped>
.login-container{
position:absolute;
width: 100%;
height: 100%;
background: url("../../assets/bg.png");
background-size:cover;
overflow:hidden;
}
.login-form{
    width: 350px;
    margin: 160px auto;
    background-color: rgba(255,255,255,0.8);
    padding:30px;
    border-radius:20px
}
.login-title{
    text-align:center
}
</style>