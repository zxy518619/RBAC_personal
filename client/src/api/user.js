import request from '@/utils/request'
export default {
    delete(userId){
        return request({
            url:'/manage/user/delete',
            method:'delete',
            data:{
                userId
            }
        })
    },
    checkPwd(userId,password){
        return request({
            url:'/manage/user/pwd',
            method:'post',
            data:{
                userId,
                password
            }
        })
    },
    updatePwd(userId,password){
        return request({
            url:"/manage/user/pwd",
            method:'put',
            data:{
                userId,
                password
            }
        })
    },
    add(user) {
        return request({
            url: '/manage/user/add',
            method: 'post',
            data: user
        })
    },
    getUserAll() {
        return request({
            url: '/manage/user/all',
            method: 'get'
        })
    },
    getUserList(page, size) {
        return request({
            url: '/manage/user/list',
            method: 'post',
            data: {
                page,
                size
            }
        })
    },
    getById(_id) {
        return request({
            url: `/manage/user/find?_id=${_id}`,
            method: 'get'
        })
    },
    update(user) {
        return request({
            url: '/manage/user/update',
            method: 'post',
            data: user
        })
    },
    deleteById(userId){
        return request({
            url:'/manage/user/delete',
            method:'delete',
            data:{
                userId
            }
        })
    }

}