const menuList = [{
        title: '首页',
        index: '/home',
        icon: 'el-icon-s-home',
        isPublic: true,
    },
    {
        title: '用户管理',
        index: "/user",
        icon: "el-icon-user"
    },
    {

        title: '角色管理',
        index: '/role',
        icon: 'el-icon-medal'
    },
    {
        title: "学员",
        index: '/students',
        icon: 'el-icon-s-cooperation',
        children: [{
                title: '学校管理',
                index: '/school',
                icon: 'el-icon-office-building'
            },
            {
                title: '专业管理',
                index: '/majors',
                icon: 'el-icon-reading'
            },
            {
                title: '班级管理',
                index: '/class',
                icon: 'el-icon-s-grid'
            },
            {
                title: '学生管理',
                index: '/student',
                icon: 'el-icon-notebook-1'
            },
            


        ]
    }
]
export default menuList