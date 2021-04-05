const mongoose=require('mongoose')
const adminSchema=mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    adminId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    userName:{
        type:String,
        required:true
    }
})
module.exports =mongoose.model('admin', adminSchema);
