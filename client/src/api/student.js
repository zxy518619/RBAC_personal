import request from '@/utils/request'

export default {
    getStudentListForMonth(year){
        return request({
            url:'/manage/student/date',
            method:'post',
            data:{
                year
            }
        })
    },

    getStudentAll() {
        return request({
            url: '/manage/student/all',
            method: 'get'
        })
    },
    getStudentList(page, size, searchMap) {
        return request({
            url: '/manage/student/list',
            method: 'post',
            data: {
                page,
                size,
                searchMap
            }
        })
    },
    add(c){
        return request({
            url:'/manage/student/add',
            method:"post",
            data:c
        })
    },
    getById(_id){
        return request({
            url:`/manage/student/find?_id=${_id}`,
            method:'get'
        })
    },
    update(c){
        return request({
            url:`/manage/student/update`,
            method:`post`,
            data:c
        })
    },
    delete(studentId){
        return request({
            url:'/manage/student/delete',
            method:`post`,
            data:{
                studentId
            }
        })
    },
    reqDeleteImg(name){
        return request({
            url:'/manage/img/delete',
            method:'delete',
            data:{
                name
            }
        })
    }
}