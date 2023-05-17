<template>
 <div>
 <el-breadcrumb separator-class="/">
<el-breadcrumb-item class="line" >{{$route.meta.title}}</el-breadcrumb-item>
</el-breadcrumb>
 </div>
</template>

<script>
export default {
 data () {
 return {
 }
 },

 components: {},

 methods: {}
}
</script>

<style scoped>
.el-breadcurmb{
    height: 10px;
    padding:20px;
    border-radius: 4px;
    box-shadow: 0 2px 12 px 0 rgba(0,0,0,0.1);
}
.line{
    border-left: 3px solid #31c17b;
    padding-left: 10px;
}
</style>