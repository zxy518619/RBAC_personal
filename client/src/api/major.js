import request from '@/utils/request.js'
export default {
    getMajorAll() {
        return request({
            url: '/manage/major/all',
            method: 'get'
        })
    },
    add(major) {
        return request({
            url: '/manage/major/add',
            method: 'post',
            data: major
        })
    }

    ,
    getMajorList(page, size) {
        return request({
            url: '/manage/major/list',
            method: 'post',
            data: {
                page,
                size
            }
        })
    },
    getById(_id) {
        return request({
            url: `/manage/major/find?_id=${_id}`,
            method: 'get'
        })
    },
    update(major) {
        return request({
            url: `/manage/major/update`,
            method: 'post',
            data: major
        })
    },
    deleteById(majorId) {
        return request({
            url: '/manage/major/delete',
            method: 'post',
            data: {
                majorId
            }
        })
    }
}