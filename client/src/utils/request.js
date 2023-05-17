import axios from 'axios'
import memoryUtils from './memoryUtils'

import storageUtils from "@/utils/storageUtils.js"
import {Message,Loading} from 'element-ui';
const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000

})
const loading = {
loadingInstance:null,
open(){
    if(this.loadingInstance == null){
        this.loadingInstance = Loading.service({
            text:'加载中',
            background:"reba(0,0,0,0.5)",
            target:'.main'
        })
    }
},
close(){
    if(this.loadingInstance != null){
        this.loadingInstance.close()
    }this.loadingInstance = null

}
}
const getMenus = () => {
    if (memoryUtils.user.role_id) {
        const roleId = memoryUtils.user.role_id;
        const userMenus = memoryUtils.user.role.menus;
        console.log("userMenus", userMenus);
        request({
            url: `/menus`,
            method: 'post',
            data: {
                roleId
            }
        }).then(response => {
            const resp = response.data;
            if (resp.status === 0) {
                const menus = resp.data.menus;
                console.log("menus", menus);
                if (userMenus.length === menus.length) {
                    console.log(111);
                    userMenus.forEach(item => {
                        if (menus.indexOf(item) === -1) {
                            memoryUtils.user = {}
                            storageUtils.removeUser()
                            Message({
                                message: "权限被修改,请重新登入",
                                type: "warning"
                            })
                            window.location.replace('/login')
                        }
                    })
                } else {
                    console.log(222);
                    memoryUtils.user = {}
                    storageUtils.removeUser()
                    Message({
                        message: "权限被修改,请重新登入",
                        type: "warning"
                    })
                    window.location.replace('/login')
                }

            }
            return
        }).catch(err => {
            return
        })
    }
}
//请求拦截器
request.interceptors.request.use(config => {
    if (config.url !== "/menus" && config.url != "/login") {
       loading.open()
        getMenus()
    }
    return config
}, function (error){
loading.close()
    return Promise.reject(error)
})

request.interceptors.response.use(function(response)  {
   const resp = response.data;
   if(resp.status != 0){
    Message({
        message:resp.msg || '系统错误',
        type:'warning',
        duration:3000

    })
   }
   
   loading.close()
    return response
}, function(error){
    loading.close()
    return Promise.reject(error)
})
export default request