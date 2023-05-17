<template>
 <div class="main">
    <app-link v-show="$route.path!== '/home'"/>
    
    <router-view>
    </router-view>
 </div>
</template>

<script>
import AppLink from "./App_Link.vue"
export default {
 data () {
 return {
 }
 },

 components: {AppLink},

 methods: {}
}
</script>

<style scoped>
</style>