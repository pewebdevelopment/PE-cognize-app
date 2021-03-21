const mongoose=require('mongoose')
const studentSchema=mongoose.Schema({
        //student details

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
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true
        }, 

        //parent details 


        parentFirstName:{
            type:String,
            required:true
        },
        parentLastName:{
            type:String,
            required:true
        },
        parentEmail:{
            type:String,
            required:true
        },
        parentPassword:{
            type:String,
            required:true
        },
        parentPhone:{
            type:Number,
            required:true
        }, 


        //permission shuld be same for them
        permission:{
            type:String,
            required:true
        },
        
})
module.exports =mongoose.model('student', studentSchema);
