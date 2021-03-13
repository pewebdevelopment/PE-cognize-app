const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    userId:{    
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
        userName:{
            type:String,
            required:true
        },
        email:{
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
module.exports =mongoose.model('users', userSchema);
