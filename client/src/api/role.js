import request from '@/utils/request'

export default {
    
    updateRole(role) {
        return request({
            url: '/manage/role/update',
            method: 'post',
            data: role
        })
    },
    getRoleList() {
        return request({

            url: '/manage/role/list',
            method: 'get'
        })
    },
    addRole(name) {
        return request({
            url: '/manage/role/add',
            method: 'post',
            data: {
                name
            }

        })
    }
}