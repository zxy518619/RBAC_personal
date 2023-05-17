const express = require("express")
const md5 = require("blueimp-md5")
const UserModel = require("../models/UserModel.js")
const RoleModel = require('../models/RoleModel')
const SchoolModel = require("../models/SchoolModel.js")
const MajorModel = require("../models/MajorModel.js")
const ClassModel = require("../models/ClassModel.js")
const StudentModel = require("../models/StudentModel");
const router = express.Router()
const filter = {
    password: 0,
    __v: 0
}
//检查密码是否正确
router.post("/manage/user/pwd",(req,res)=>{
    const body = req.body;
    UserModel.findOne({
        _id:body.userId,
        password:md5(body.password)
    }).then(user=>{
        if(!user){
            res.send({status:1,msg:"密码不正确"})
        }
        res.send({status:0,data:user})
    })
}),
//修改密码
router.put("/manage/user/pwd",(req,res)=>{
    const id = req.body.userId;
    UserModel.findOne({_id:id}).then(user=>{
        if(!user){
            res.send({status:1,msg:"密码不正确"})
        }
        user.password = md5(req.body.password);
        UserModel.findByIdAndUpdate({_id:id},user).then(()=>{
            return res.send({status:0,msg:"密码修改成功"})
        })
    })
})


////学生部分
router.get("/manage/student/all",(req,res)=>{
    StudentModel.find().then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("获取所有学生",error);
        res.send({status:1,msg:"获取失败"})
    })
})
//根据日期获取当月信息
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
                _id: "$month",
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
    ]).exec().then((data) => {
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
    const {name} = req.body
    StudentModel.findOne({
        name
    }).then(data => {
        //if(data){
          //  res.send({status:1,msg:'已存在'})
            //return new Promise(()=>{})
      //  }else{
            return StudentModel.create({...req.body})
       // }
        
    }).then(data=>{
        res.send({
            status: 0,
            data: data
        })
    }).catch(error=>{
        console.log(error,"添加异常");
        res.send({status:1,msg:"添加异常"})
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
///////


//删除班级
router.post('/manage/class/delete', (req, res) => {
    const {
        classId
    } = req.body
    ClassModel.deleteOne({
        _id: classId
    }).then(() => {
        res.send({status: 0, msg:"删除成功"})
    }).catch(error => {
        console.log("删除出现异常", error);
        res.send({
            status: 1,
            msg: "删除出现异常"
        })
    })
})

//更新班级*
router.post("/manage/class/update", (req, res) => {
    const c = req.body
    ClassModel.findOneAndUpdate({
        _id: c._id
    }, c).then(oldClass => {
        const data = Object.assign(oldClass, c)
        res.send({
            status: 0,
            data
        })
    }).catch(error => {
        console.log("更新班级异常", error);
        res.send({
            status: 1,
            msg: '更新班级异常'
        })
    })
})

//根据id查询*
router.get("/manage/class/find", (req, res) => {
    const c = req.query
    ClassModel.findById({
        _id: c._id
    }).then(data => {
        res.send({
            status: 0,
            data
        })
    }).catch(error => {
        console.log("根据id获取班级", error);
        res.send({
            status: 1,
            msg: "根据id查询班级出错"
        })
    })
})
//添加班级*
router.post('/manage/class/add', (req, res) => {
    const {
        name
    } = req.body
    ClassModel.findOne({
        name
    }).then(data => {
        if (data) {
            res.send({
                status: 1,
                msg: "已存在"
            })
            return new Promise(() => {})
        } else {
            return ClassModel.create({
                ...req.body
            })
        }
    }).then(data => {
        res.send({
            status: 0, data
        })
    }).catch(error => {
        console.log(error, "添加异常");
        res.send({
            status: 1,
            msg: "添加异常"
        })
    })
})

//获取所有班级
router.get("/manage/class/all",(req,res)=>{
    ClassModel.find().then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("获取所有班级",error);
        res.send({status:1,msg:"获取失败"})
    })
})


//获取班级列表*
router.post('/manage/class/list', (req, res) => {
    let page = req.body.page || 1
    let size = req.body.size || 5
    let searchMap = req.body.searchMap || {} //前端传递过来的条件查询对象
    let obj = {} //真正到数据库中查询的条件
    searchMap.teacher_id ? obj["teacher_id"] = searchMap.teacher_id : obj
    searchMap.manager_id ? obj["manager_id"] = searchMap.manager_id : obj
    ClassModel.find(obj).then(classes => {
        const count = classes.length;
        ClassModel.find(obj).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec().then(data => {
            res.send({
                status: 0,
                data: {
                    total: count,
                    data
                }
            })
        })
    }).catch(error => {
        console.log("获取班级列表异常", error);
        res.send({
            status: 1,
            msg: "获取班级列表异常"
        })
    })
})



//////////////////////////////////////////////////////////////////////////////////////////////////
//删除专业

router.post('/manage/major/delete', (req, res) => {
    const {
        majorId
    } = req.body
    MajorModel.deleteOne({
            _id: majorId
        })
        .then((doc) => {
            res.send({
                status: 0
            })
        }).catch(error => {
            console.log(error, "删除出现异常");
            res.send({
                status: 1,
                msg: '删除出现异常'
            })
        })
})
//更新专业信息*
router.post("/manage/major/update", (req, res) => {
    const major = req.body
    console.log("major", major);
    MajorModel.findOneAndUpdate({
        _id: major._id
    }, major).then(oldMajor => {
        const data = Object.assign(oldMajor, major);
        res.send({
            status: 0,
            data
        })
    }).catch(error => {
        console.log("更新异常", error);
        res.send({
            status: 1,
            msg: "更新异常"
        })
    })
})


//根据ID查询专业*
router.get("/manage/major/find", (req, res) => {
    const major = req.query
    MajorModel.findById({
        _id: major._id
    }).then(data => {
        res.send({
            status: 0,
            data
        })
    }).catch(error => {
        console.log("根据id获取异常", error);
        res.send({
            status: 1,
            msg: "根据id获取异常"
        })
    })
})
//新增专业* 网络工程专业  64141692fcc10bba824f9478
router.post('/manage/major/add', (req, res) => {
    const {
        majorname
    } = req.body
    console.log(majorname);
    MajorModel.findOne({
            majorname
        })
        .then(major => {
            if (major) {
                res.send({
                    status: 1,
                    msg: "已经存在"
                })
                return new Promise(() => {

                })
            } else {
                return MajorModel.create({
                    ...req.body
                })
            }
        })
        .then(major => {
            res.send({
                status: 0,
                data: major
            })
        })
        .catch(error => {
            console.log(error, "添加异常");
            res.send({
                status: 1,
                msg: "添加异常"
            })
        })
})

//获取专业列表*
router.post('/manage/major/list', (req, res) => {
    let page = req.body.page || 1
    let size = req.body.size || 5

    MajorModel.find()
        .then(majors => {
            const count = majors.length;
            MajorModel.find().skip((page - 1) *
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
            console.log("获取列表异常", error);
            res.send({
                status: 1,
                msg: "获取列表异常"
            })
        })
})
/////////////////////////////////////////////////////////////////////////////////
//获取所有学校
router.get("/manage/school/all",(req,res)=>{
    SchoolModel.find().then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("获取所有学校异常",error);
        res.send({status:1,msg:"获取所有学校异常"})
    })
})
//获取所有专业
router.get("/manage/major/all",(req,res)=>{
    MajorModel.find().then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("获取所有专业异常",error);
        res.send({status:1,msg:"获取所有专业异常"})
    })
})

//删除学校

router.post('/manage/school/delete', (req, res) => {
    const {
        schoolId
    } = req.body
    SchoolModel.deleteOne({
            _id: schoolId
        })
        .then((doc) => {
            res.send({
                status: 0
            })
        }).catch(error => {
            console.log(error, "删除出现异常");
            res.send({
                status: 1,
                msg: '删除出现异常'
            })
        })
})
//更新学校信息
router.post("/manage/school/update", (req, res) => {
    const school = req.body
    console.log("school", school);
    SchoolModel.findOneAndUpdate({
        _id: school._id
    }, school).then(oldSchool => {
        const data = Object.assign(oldSchool, school);
        res.send({
            status: 0,
            data
        })
    }).catch(error => {
        console.log("更新异常", error);
        res.send({
            status: 1,
            msg: "更新异常"
        })
    })
})


//根据ID查询学校
router.get("/manage/school/find", (req, res) => {
    const school = req.query
    SchoolModel.findById({
        _id: school._id
    }).then(data => {
        res.send({
            status: 0,
            data
        })
    }).catch(error => {
        console.log("根据id获取异常", error);
        res.send({
            status: 1,
            msg: "根据id获取异常"
        })
    })
})
//新增学校
router.post('/manage/school/add', (req, res) => {
    const {
        schoolname
    } = req.body
    console.log(schoolname);
    SchoolModel.findOne({
            schoolname
        })
        .then(school => {
            if (school) {
                res.send({
                    status: 1,
                    msg: "已经存在"
                })
                return new Promise(() => {

                })
            } else {
                return SchoolModel.create({
                    ...req.body
                })
            }
        })
        .then(school => {
            res.send({
                status: 0,
                data: school
            })
        })
        .catch(error => {
            console.log(error, "添加异常");
            res.send({
                status: 1,
                msg: "添加异常"
            })
        })
})





//获取学校列表
router.post('/manage/school/list', (req, res) => {
    let page = req.body.page || 1
    let size = req.body.size || 5

    SchoolModel.find()
        .then(schools => {
            const count = schools.length;
            SchoolModel.find().skip((page - 1) *
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
            console.log("获取列表异常", error);
            res.send({
                status: 1,
                msg: "获取列表异常"
            })
        })
})

//获取权限列表
router.post("/menus", (req, res) => {
    console.log("roleId", req.body);
    const {
        roleId
    } = req.body;

    RoleModel.findOne({
            _id: roleId
        })
        .then(role => {
            console.log('role', role);
            res.send({
                status: 0,
                data: {
                    menus: role.menus
                }
            })
        }).catch(error => {
            console.log(error, "获取权限列表出现异常");
            res.send({
                status: 1,
                msg: "获取权限列表出现异常"
            })
        })
})

//根据id删除
router.delete('/manage/user/delete', (req, res) => {
    const {
        userId
    } = req.body
    UserModel.deleteOne({
            _id: userId
        })
        .then((doc) => {
            res.send({
                status: 0
            })
        })
})

//提交修改数据接口
router.post('/manage/user/update', (req, res) => {
    const user = req.body

    UserModel.findOne({
        _id: user._id
    }).then(data => {
        if (data.password != user.password) {
            user.password = md5(user.password)
        }
        UserModel.findOneAndUpdate({
                _id: user._id
            }, user)
            .then(oldUser => {
                const data = Object.assign(oldUser, user)
                res.send({
                    status: 0,
                    data
                })
            }).catch(error => {
                console.log(error, "更新用户异常");
                res.send({
                    status: 1,
                    msg: "更新用户异常"
                })
            })
    })

})


//根据Id查询用户
router.get('/manage/user/find', (req, res) => {
    const user = req.query
    UserModel.findById({
            _id: user._id
        })
        .then(data => {
            res.send({
                status: 0,
                data
            })
        }).catch(error => {
            console.log(error, "根据id查询用户异常");
            res.send({
                status: 1,
                msg: "根据id查询用户异常"
            })
        })
})



//添加用户
router.post('/manage/user/add', (req, res) => {
    const {
        username,
        password
    } = req.body
    UserModel.findOne({
            username
        }).then(user => {
            if (user) {
                res.send({
                    status: 1,
                    msg: "用户已存在"
                })
                return new Promise(() => {

                })
            } else {
                return UserModel.create({
                    ...req.body,
                    password: md5(password || 'buka')
                })
            }
        }).then(user => {
            res.send({
                status: 0,
                data: user
            })
        })
        .catch(error => {
            console.log(error + "注册异常");
            res.send({
                status: 1,
                msg: "添加异常,请重试"
            })
        })
})
//获取所有用户
router.get('/manage/user/all', (req, res) => {
    UserModel.find({
            username: {
                '$ne': "admin"
            }
        })
        .then(users => {
            res.send({
                status: 0,
                data: users
            })
        })
        .catch(error => {
            console.error("获取用户列表异常", error)
            res.send({
                status: 1,
                msg: "获取列表异常,请重试"
            })
        })
})
//获取用户列表(分页)
router.post("/manage/user/list", (req, res) => {
    let page = req.body.page || 1;
    let size = req.body.size || 5;
    UserModel.find({
        username: {
            '$ne': "admin"
        }
    }).then(users => {
        let count = users.length;
        UserModel.find({
            username: {
                '$ne': "admin"
            }
        }).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec().then(data => {
            RoleModel.find().then(roles => {
                res.send({
                    status: 0,
                    data: {
                        total: count,
                        data: data,
                        roles: roles
                    }
                })
            })
        })
    }).catch(error => {
        console.log("获取异常", error)
        res.send({
            status: 1,
            msg: '获取用户列表异常'
        })
    })
})

/* 更新角色 */
router.post('/manage/role/update', (req, res) => {
    const role = req.body
    role.auth_time = Date.now()
    RoleModel.findOneAndUpdate({
            _id: role._id
        }, role)
        .then(oldRole => {
            console.log('---', oldRole);
            res.send({
                status: 0,
                data: {
                    ...oldRole._doc,
                    ...role
                }
            })
        })
        .catch(error => {
            console.log(error);
            res.send({
                status: 1,
                msg: "更新异常请重试"
            })
        })
})

router.post('/manage/role/add', (req, res) => {
    const {
        name
    } = req.body
    RoleModel.create({
            name
        })
        .then(role => {
            res.send({
                status: 0,
                data: role
            })
        })
        .catch(error => {
            console.log(error);
            res.send({
                status: 1,
                msg: "角色添加异常,请重试"
            })
        })
})
router.get('/manage/role/list', (req, res) => {
    RoleModel.find()
        .then(roles => {
            res.send({
                status: 0,
                data: roles
            })
        })
        .catch(error => {
            console.log(error);
            res.send({
                status: 1,
                msg: "获取角色异常"
            })
        })
})
//登陆接口
router.post("/login", (req, res) => {
    const {
        username,
        password
    } = req.body;
    UserModel.findOne({
            username,
            password: md5(password)
        })
        .then(user => {
            if (user) {
                if (user.role_id) {
                    RoleModel.findOne({
                            _id: user.role_id
                        })
                        .then(role => {
                            user._doc.role = role
                            console.log("role user", user);
                            res.send({
                                status: 0,
                                data: user
                            })
                        })
                } else {
                    user._doc.role = {
                        menus: []
                    }
                    res.send({
                        status: 0,
                        data: user
                    })
                }

            } else {
                res.send({
                    status: 1,
                    msg: '账号或密码错误'
                })
            }
        }).catch(error => {
            console.log("登陆异常", error);
            res.send({
                status: 1,
                msg: "登陆异常.请重试"
            })
        })

})
require('./file-upload')(router)
module.exports = router