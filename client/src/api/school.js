import request from '@/utils/request.js'
export default {
    getSchoolAll(){
        return request({
            url:"/manage/school/all",
            method:'get'
        })
    },
    add(school) {
        return request({
            url:'/manage/school/add',
            method:'post',
            data:school
        })
    }

    ,
    getSchoolList(page, size) {
        return request({
            url: '/manage/school/list',
            method: 'post',
            data: {
                page,
                size
            }
        })
    },
    getById(_id){
        return request({
            url:`/manage/school/find?_id=${_id}`,
            method:'get'
        })
    },
    update(school){
        return request({
            url:`/manage/school/update`,
            method:'post',
            data:school
        })
    },
    deleteById(schoolId){
        return request({
            url:'/manage/school/delete',
            method:'post',
            data:{
                schoolId
            }
        })
    }
}