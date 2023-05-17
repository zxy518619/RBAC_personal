<template>
 <div>

<app-header></app-header>
<app-main></app-main>
<app-navbar></app-navbar>

 </div>
</template>

<script>
import AppHeader from"@/components/AppHeader"
import AppNavbar from"@/components/AppNavbar"
import AppMain from"@/components/AppMain"
export default {
 data () {
 return {
 }
 },

 components: {
    AppHeader,
AppNavbar,
AppMain
    
 },

 methods: {}
}
</script>

<style scoped>
.header{
    position:absolute;
    line-height: 50px;
    padding: 0px;
    top: 0px;
    left:0px;
    right: 0px;
    background-color: #0270ff;
}
.navbar{
    position: absolute;
    width: 230px;
    top: 50px;
    left: 0px;
    bottom: 0px;
    overflow-y:auto ;
    background-color: #545c64;
}
.main{
    position: absolute;
    top: 50px;
    left: 230px;
    right: 0px;
    bottom:0px;
    padding:10px;
    overflow-y:auto;
    
}
</style>