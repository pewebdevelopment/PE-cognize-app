const mongoose=require('mongoose')
const parentSchema=mongoose.Schema({         
        parentFirstName:{
            type:String,
            required:true
        },
        parentLastName:{
            type:String,
            required:true
        },
        parentPhone:{
            type:Number,
            required:true
        }, 
        parentId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true
        },
        studentId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true
        },
})
module.exports =mongoose.model('parent', parentSchema);