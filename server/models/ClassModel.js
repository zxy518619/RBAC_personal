const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
    name:{type:String,required:true},
    teacher_id
    
    :{type:String,required:true},
    manager_id
    
    :{type:String,required:true},

})
const ClassModel = mongoose.model('classs',classSchema)
module.exports = ClassModel