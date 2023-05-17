import request from "@/utils/request"
//登陆
export function login(username,password) {
    return request({
        url:"/login",
        method:'post',
        data:{
            username,
            password
        }
    })
}