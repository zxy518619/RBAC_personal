const StudentModel = require("../models/StudentModel");

////学生部分

//删除
router.post('/manage/student/date', (req, res) => {
    let {
        year
    } = req.body
    year = year + "";
    StudentModel.aggregate([{
            $project: {
                year: {
                    $substr: ["$admission_date", 0, 4]
                },
                month: {
                    $substr: ["$admission_date", 5, 2]
                }
            }
        },
        {
            $match: {
                year
            }
        },
        {
            $group: {
                _id: "$mouth",
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ]).exec().then((err, data) => {
        return res.send({
            status: 0,
            data
        })
    })
})
router.post('/manage/student/delete', (req, res) => {
    const {
        studentId
    } = req.body
    StudentModel.deleteOne({
        _id: studentId
    }).then(() => {
        res.send({
            status: 0,
            msg: "删除成功"
        })
    }).catch(error => {
        console.log("删除出现异常", error);
        res.send({
            status: 1,
            msg: "删除出现异常"
        })
    })
})

//更新学生*
router.post("/manage/student/update", (req, res) => {
    const student = req.body
    StudentModel.findOneAndUpdate({
        _id: student._id
    }, student).then(oldStudent => {
        const data = Object.assign(oldStudent, student)
        res.send({
            status: 0,
            data
        })
    }).catch(error => {
        console.log("更新学生异常", error);
        res.send({
            status: 1,
            msg: '更新学生异常'
        })
    })
})

//根据id查询*
router.get("/manage/student/find", (req, res) => {
    const student = req.query
    StudentModel.findById({
        _id: student._id
    }).then(data => {
        res.send({
            status: 0,
            data
        })
    }).catch(error => {
        console.log("根据id获取学生", error);
        res.send({
            status: 1,
            msg: "根据id查询学生出错"
        })
    })
})
//添加学生
router.post('/manage/student/add', (req, res) => {
    StudentModel.create({
        ...req.body
    }).then(data => {
        res.send({
            statys: 0,
            data: data
        })
    })
})
//获取学生列表/
router.post('/manage/student/list', (req, res) => {
    let page = req.body.page || 1
    let size = req.body.size || 5
    let searchMap = req.body.searchMap || {} //前端传递过来的条件查询对象
    let obj = {} //真正到数据库中查询的条件
    searchMap.name ? obj["name"] = searchMap.name : obj
    searchMap.direction ? obj["direction"] = searchMap.direction : obj
    searchMap.class ? obj["class"] = searchMap.class : obj
    searchMap.teacher_id ? obj["teacher_id"] = searchMap.teacher_id : obj
    searchMap.manager_id ? obj["manager_id"] = searchMap.manager_id : obj
    StudentModel.find(obj)
        .then(students => {
            const count = students.length;
            StudentModel.find(obj).skip((page - 1) *
                parseInt(size)).limit(parseInt(size)).exec().then(data => {
                res.send({
                    status: 0,
                    data: {
                        total: count,
                        data
                    }
                })
            })
        }).catch(error => {
            console.log("获取学生列表异常", error);
            res.send({
                status: 1,
                msg: "获取学生列表异常"
            })
        })
})
///