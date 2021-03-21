const mongoose=require('mongoose')
const adminSchema=mongoose.Schema({

        email:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        
        permission:{
            type:String,
            required:true
        },
        
})
module.exports =mongoose.model('admin', adminSchema);
