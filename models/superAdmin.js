const mongoose=require('mongoose')
const superAdminSchema=mongoose.Schema({
    ///SHOULD BE HARDCODED
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
module.exports =mongoose.model('superAdmin', superAdminSchema);
