const user = require('../models/users');
const student = require('../models/student');
const admin = require('../models/admin');
const parentDetails=require('../models/parent');
const teacher=require('../models/teacher');
const superAdmin = require('../models/superAdmin');

const verifyToken = require("../verifyToken");
const config=require('../config/env');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

const bcrypt =require('bcrypt')
const {GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLFloat
}=require('graphql');
const { json } = require('express');
const poolData = {    
  UserPoolId : config.UserPoolId, // Your user pool id here    
  ClientId : config.ClientId, // Your client id here
  }; 
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
/*const VacancyType = new GraphQLObjectType({
    name: 'Vacancy',
    description: 'This represents a Vacancy',
    fields: () => ({
      vacancyId:{ type: GraphQLNonNull(GraphQLID) },
      vacancyPost: { type: GraphQLNonNull(GraphQLString) },
      noOfOpenings: { type: GraphQLNonNull(GraphQLInt) },
      stipend: { type: GraphQLNonNull(GraphQLInt) },
      startDate:{type:GraphQLNonNull(GraphQLString)},
      deadlineDate:{type:GraphQLNonNull(GraphQLString)},
      perks: { type: GraphQLNonNull(new GraphQLList(GraphQLString)) },
      duration: { type: GraphQLNonNull(GraphQLInt) },
      deadline:{ type: GraphQLNonNull(GraphQLString)},
      aboutPost: { type: GraphQLNonNull(GraphQLString) },
      skillsRequired: { type: GraphQLNonNull(new GraphQLList(GraphQLString)) },
      status: { type: GraphQLNonNull(GraphQLBoolean)},
      rounds : {type : GraphQLNonNull(new GraphQLList(GraphQLNonNull(new GraphQLList(GraphQLString))))}
    })
})*/

const RootQueryType = new GraphQLObjectType({ 
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
      users: {
        type:GraphQLString,
        description: 'users',
        args: {
          email: { type: GraphQLNonNull(GraphQLString)},
        },
        resolve:async (parent, args,req) =>{
          var user=await verifyToken(req.headers.authorization)
          if(user['custom:permission']=='candidate'){
            console.log(user)
          }
          else{
            console.log("Not Candidate")
          }
        }
    },
    })
  })
const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
      
      studentSignUp: {
        type:GraphQLString,
        description: 'student signup',
        args: {
          email: { type: GraphQLNonNull(GraphQLString )},
          password:{type: GraphQLNonNull(GraphQLString )},
          firstName:{type: GraphQLNonNull(GraphQLString )},
          lastName:{type: GraphQLNonNull(GraphQLString )},
          grade:{type: GraphQLNonNull(GraphQLString )},
          phone:{type: GraphQLNonNull(GraphQLString)},
          permission:{type: GraphQLNonNull(GraphQLString )},
        },
        resolve:async (parent, args) =>{
         return new Promise((resolve,reject)=>{
            user.findOne({email:args.email},async (err,docs)=>{
              if(!docs){
                var attributeList = [];
                attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:args.email}));
                attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:permission",Value:args.permission}));
                userPool.signUp(args.email, args.password, attributeList, null,async function(err, result){
                if (err) {
                    console.log(err);
                    reject(err)
                }
                else{
                try{
                  const passwordHash=await bcrypt.hashSync(args.password,10);
                  var newUser=new user({  
                      email:args.email,
                      password:passwordHash,
                      permission:args.permission
                  })
                  newUser.userId=newUser._id;
                  
                  await newUser.save({},(err,docs)=>{
                    if(docs){
                     var newStudent=new student({
                       userId:newUser._id,
                       firstName:args.firstName,
                       lastName:args.lastName,
                       grade:args.grade,
                       phone:args.phone,
                      })
                      newStudent.studentId=newStudent._id;
                      newStudent.save({},(err,docs)=>{
                        if(docs){
                         console.log('student-created')
 
                         resolve(newStudent._id);
                        }
                      });
                    }
                    if(err){
                     console.log('err2')
                     console.log(err)
                    }
                  });                  
                }catch(err){
                   console.log(err);
                }       
                cognitoUser = result.user;
                }
                })
             }
             else{
                resolve('Email exists');
             }

            })   
        })
      }
    },
    teacherSignUp: {
      type:GraphQLString,
      description: 'teacher signup',
      args: {
        email: { type: GraphQLNonNull(GraphQLString )},
        password:{type: GraphQLNonNull(GraphQLString )},
        firstName:{type: GraphQLNonNull(GraphQLString )},
        lastName:{type: GraphQLNonNull(GraphQLString )},
        phone:{type: GraphQLNonNull(GraphQLString)},
        dob:{type: GraphQLNonNull(GraphQLString)},
        gender:{type: GraphQLNonNull(GraphQLString)},
        city:{type: GraphQLNonNull(GraphQLString)},
        country:{type: GraphQLNonNull(GraphQLString)},
        occupation:{type: GraphQLNonNull(GraphQLString)},
        profileHeading:{type: GraphQLNonNull(GraphQLString)},
        profileDescription:{type: GraphQLNonNull(GraphQLString)},
        teachingExperience:{type: GraphQLNonNull(GraphQLString)},
        expectedHourlyRate:{type: GraphQLNonNull(GraphQLString)},
        subjects:{type: GraphQLNonNull(new GraphQLList(GraphQLString))},
        levels:{type: GraphQLNonNull(new GraphQLList(new GraphQLList(GraphQLString)))},
        exams:{type: GraphQLNonNull(new GraphQLList(new GraphQLList(GraphQLString)))},
        availability:{type: GraphQLNonNull(GraphQLString)},
        permission:{type: GraphQLNonNull(GraphQLString )},
      },
      resolve:async (parent, args) =>{
        console.log('0')

       return new Promise((resolve,reject)=>{
        console.log('1')

          user.findOne({email:args.email},async (err,docs)=>{
            if(!docs){
              console.log('2')

              var attributeList = [];
              attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:args.email}));
              attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:permission",Value:args.permission}));
              userPool.signUp(args.email, args.password, attributeList, null,async function(err, result){
              if (err) {
                  console.log(err);
                  reject(err)
              }
              else{
              try{
                const passwordHash=await bcrypt.hashSync(args.password,10);
                var newUser=new user({  
                    email:args.email,
                    password:passwordHash,
                    permission:args.permission
                })
                newUser.userId=newUser._id;
                console.log('3')

                await newUser.save({},(err,docs)=>{
                  if(docs){
                   var newTeacher=new teacher({
                     userId:newUser._id,
                     firstName:args.firstName,
                     lastName:args.lastName,
                     phone:args.phone,
                     profileDescription:args.profileDescription,
                     profileHeading:args.profileHeading,
                     city:args.city,
                     country:args.country,
                     gender:args.gender,
                     dob:args.dob,
                     occupation:args.occupation,
                     subjects:args.subjects,
                     levels:args.levels,
                     exams:args.exams,
                     teachingExperience:args.teachingExperience,
                     expectedHourlyRate:args.expectedHourlyRate,
                     availability:args.availability
                    })
                    newTeacher.teacherId=newTeacher._id;
                    console.log('4')

                    newTeacher.save({},(err,docs)=>{
                      if(docs){
                       console.log('teacher-created')

                       resolve('teacher created');
                      }
                    });
                  }
                  if(err){
                   console.log('err2')
                   console.log(err)
                  }
                });                  
              }catch(err){
                 console.log(err);
              }       
              cognitoUser = result.user;
              }
              })
           }
           else{
              resolve('Email exists');
           }

          })   
      })
    }
  },
    parentSignUp: {
      type:GraphQLString,
      description: 'parent signup',
      args: {
        parentEmail: { type: GraphQLNonNull(GraphQLString )},
        parentPassword:{type: GraphQLNonNull(GraphQLString )},
        parentFirstName:{type: GraphQLNonNull(GraphQLString )},
        parentLastName:{type: GraphQLNonNull(GraphQLString )},
        parentPhone:{type: GraphQLNonNull(GraphQLString)},
        studentId:{type:GraphQLNonNull(GraphQLString)},

        permission:{type: GraphQLNonNull(GraphQLString )},
      },
      resolve:async (parent, args) =>{
       return new Promise((resolve,reject)=>{
          user.findOne({email:args.parentEmail},async (err,docs)=>{
            if(!docs){
              var attributeList = [];
              attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:args.parentEmail}));
              attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:permission",Value:args.permission}));
              userPool.signUp(args.parentEmail, args.parentPassword, attributeList, null,async function(err, result){
              if (err) {
                  console.log(err);
                  reject(err)
              }
              else{
              try{
                const passwordHash=await bcrypt.hashSync(args.parentPassword,10);
                var newUser=new user({  
                    email:args.parentEmail,
                    password:passwordHash,
                    permission:args.permission
                })
                newUser.userId=newUser._id;
                
                await newUser.save({},(err,docs)=>{
                  if(docs){
                   var newParent= new parentDetails({
                     userId:newUser._id,
                     parentFirstName:args.parentFirstName,
                     parentLastName:args.parentLastName,
                     parentPhone:args.parentPhone,
                     studentId:args.studentId
                    })
                    newParent.parentId=newParent._id;
                    newParent.save({},(err,docs)=>{
                      if(docs){
                       console.log('parent-created')

                       resolve('parent created');
                      }
                      if(err){
                        console.log(err);
                      }
                    });
                  }
                  if(err){
                   console.log('err2')
                   console.log(err)
                  }
                });                  
              }catch(err){
                 console.log(err);
              }       
              cognitoUser = result.user;
              }
              })
           }
           else{
              resolve('Email exists');
           }

          })   
      })
    }
  },
    adminSignUp: {
      type:GraphQLString,
      description: 'admin signup',
      args: {
        email: { type: GraphQLNonNull(GraphQLString )},
        password:{type: GraphQLNonNull(GraphQLString )},
        userName:{type: GraphQLNonNull(GraphQLString )},
        permission:{type: GraphQLNonNull(GraphQLString )},
      },
      resolve:async (parent, args) =>{
       return new Promise((resolve,reject)=>{
          user.findOne({email:args.email},async (err,docs)=>{
            if(!docs){
              var attributeList = [];
              attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:args.email}));
              attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:permission",Value:args.permission}));
              userPool.signUp(args.email, args.password, attributeList, null,async function(err, result){
              if (err) {
                  console.log("err1");
                  reject(err)
              }
              else{
              try{
                 const passwordHash=await bcrypt.hashSync(args.password,10);
                 var newUser=new user({  
                     email:args.email,
                     password:passwordHash,
                     permission:args.permission
                 })
                 newUser.userId=newUser._id;
                 
                 await newUser.save({},(err,docs)=>{
                   if(docs){
                    var newAdmin=new admin({
                      userId:newUser._id,
                      userName:args.userName,
                     })
                     newAdmin.adminId=newAdmin._id;
                     newAdmin.save({},(err,docs)=>{
                       if(docs){
                        console.log('admin-created')

                        resolve('admin created');
                       }
                     });
                   }
                   if(err){
                    console.log('err2')
                    console.log(err)
                   }
                 });
                
              }catch(err){
                 console.log(err);
              }       
              cognitoUser = result.user;
              }
              })
           }
           else{
              resolve('Email exists');
           }

          })   
      })
    }
  },
  signIn:{
    type:GraphQLList (GraphQLString),
    description:"SignIn",
    args:{
        email:  { type: GraphQLNonNull(GraphQLString )},
        password:{ type: GraphQLNonNull(GraphQLString )},
    },
    resolve:async (parent,args,req)=>{

      var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
          Username : args.email,
          Password : args.password,
      });
      var userData = {
          Username : args.email,
          Pool : userPool
      };  

      let st = await user.findOne({email:args.email});
      let name;
      //console.log("ads",st);
      let us;
      if(st.permission == "student"){
        us = await student.findOne({userId:st.userId});
        name = us.firstName + ' ' + us.lastName;
      }else if(st.permission == "admin"){
        us = await admin.findOne({userId:st.userId});
        name = us.userName;
      }else if(st.permission == "parent"){
        us = await parent.findOne({userId:st.userId});
        name = us.firstName + ' ' + us.lastName;
      }else if(st.permission == "teacher"){
        us = await teacher.findOne({userId:st.userId});
        name = us.firstName + ' ' + us.lastName;
      }else{
        us = await admin.findOne({userId:st.userId});
        name = us.userName;
      }
      

      var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      return new Promise((resolve, reject) => (
          cognitoUser.authenticateUser(authenticationDetails, {


           onSuccess: (result) => resolve([result.getAccessToken().getJwtToken(),result.getIdToken().getJwtToken(),result.getRefreshToken().getToken(),result.getIdToken().payload['custom:permission'],name]),
           onFailure: (err) => resolve([]),
          })
      ));
    }
},
    })
  })

 module.exports = new GraphQLSchema({
    query:RootQueryType,
    mutation: RootMutationType
  })
