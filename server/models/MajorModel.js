const mongoose = require('mongoose')

const majorSchema = new mongoose.Schema({
    majorname:{type:String,required:true}
})
const MajorModel = mongoose.model('majors',majorSchema)
module.exports = MajorModel