const express = require('express');
//通过express启动服务器
const mongoose = require('mongoose')
const path = require('path')
const app = express()
//声明使用静态中间件
app.use(express.static('public'))
//声明使用解析post请求的中间件
app.use(express.urlencoded({
    extended: true
})) 
app.use(express.json()) //请求体参数是json结构:{name:tom,pwd:123}

app.use("/node_modules", express.static(path.join(__dirname, "./node_modules/")))
const indexRouter = require('./routers/index.js')
app.use("/", indexRouter)
mongoose.connect("mongodb://localhost/b0386_server_stu", {
    useNewUrlParser: true
}).then(() => {
    console.log("数据库连接成功");
    app.listen(3000, () => {
        console.log("服务器启动成功,请访问:http://localhost:3000");

    })
}).catch(error => {
    console.log("数据库连接失败", error);
})