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
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true
        },
        teacherId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true
        },
        phone:{
            type:String,
            required:true
        }, 
        
        subjects:[{
                type:String,
                required:true
        }],
        levels:[[{
            type:String,
            required:true
        }]],
        exams:[[{
            type:String,
            required:true 
        }]], 

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
            type:String,
            required:true
        },
        expectedHourlyRate:{
            type:String,
            required:true
        },
        availability:{
            type:String,
            required:true
        },
        
})
module.exports =mongoose.model('teacher', teacherSchema);
