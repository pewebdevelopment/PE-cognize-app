const mongoose=require('mongoose')
const studentSchema=mongoose.Schema({
        //student details
        studentId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true
        },
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        grade:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        }, 

        
})
module.exports =mongoose.model('student', studentSchema);
