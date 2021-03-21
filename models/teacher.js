const mongoose=require('mongoose')
const teacherSchema=mongoose.Schema({

        firstName:{
            type:String,
            required:true
        },
        lastName:{
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
        
        subject:[{
            levels:{
                type:String,
                required:true
            },
            exams:[{
                type:String,
                required:true
            }],
        }],

        dob:{
            type:String,
            required:true
        },
        gender:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
          
        },
        city:{
            type:String,
            required:true
        },
        occupation:{
            type:String
        },
        profileHeading:{
            type:String,
            required:true
        },
        profileDescription:{
            type:String,
            required:true
        },
        teachingExperience:{
            type:Number,
            required:true
        },
        expectedHourlyRate:{
            type:Number,
            required:true
        },
        availability:{
            type:Number,
            required:true
        },

        permission:{
            type:String,
            required:true
        },
        
})
module.exports =mongoose.model('teacher', teacherSchema);
