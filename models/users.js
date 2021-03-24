const mongoose=require('mongoose')
const userSchema=mongoose.Schema({

        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true
        },
        permission:{
            type:String,
            required:true
        },
        
})
module.exports =mongoose.model('user', userSchema);
