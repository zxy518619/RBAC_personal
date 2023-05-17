import router from './router'
import memoryUtils from '@/utils/memoryUtils.js'

router.beforeEach((to,from,next)=>{
    const user = memoryUtils.user
    if(user && user._id){
        if(to.path == '/login'){
            next({path:"/"})
        }else{
            next()
        }
    }else{
        if(to.path == "/login"){
next()
        }else{
            next({path:"/login"})
        }
    }
})