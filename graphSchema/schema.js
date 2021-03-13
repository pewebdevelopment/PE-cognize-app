const user = require('../models/user');
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
      
      signUp: {
        type:GraphQLString,
        description: 'Signup',
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
                    console.log(err);
                    reject(err)
                }
                else{
                try{
                   const passwordHash=await bcrypt.hashSync(args.password,10);
                   var newUser=new user({  
                       email:args.email,
                       password:passwordHash,
                       userName:args.userName,
                       permission:args.permission
                   })
                   newUser.userId=newUser._id;
                   await newUser.save();
                   console.log('user-created')
                   resolve('user created');
                  
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
            
            var st = await user.findOne({email:args.email});

            var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
            return new Promise((resolve, reject) => (
                cognitoUser.authenticateUser(authenticationDetails, {


                 onSuccess: (result) => resolve([result.getAccessToken().getJwtToken(),result.getIdToken().getJwtToken(),result.getRefreshToken().getToken(),result.getIdToken().payload['custom:permission'],st.userName]),
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