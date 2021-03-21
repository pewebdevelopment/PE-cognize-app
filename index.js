
const AWS = require('aws-sdk');
global.fetch = require('node-fetch');
const verifyToken = require("./verifyToken");
const express = require('express');
const app = express();
const mongoconnect = require("./mongoconnect/mongoconnect")
const user = require('./models/student');
mongoconnect()
const schema = require('./graphSchema/schema');
const cors = require('cors');
const {graphqlHTTP} = require('express-graphql');
const config = require('./config/env');
 


app.use(cors());

const validateToken=async (req,res,next)=>{
   //console.log(req.headers.authorization)
   var currentUser=await verifyToken(req.headers.authorization);
   //console.log(currentUser)
   if(currentUser!=null){
            await user.findOne({email:currentUser.email},(err,docs)=>{
                req.user=docs;
                console.log(req.user) 
                next()
            })    
    }
    else{
        req.user=null
        next()
    }
}

app.use(validateToken)

app.use('/graphql', graphqlHTTP({
    schema:schema,
    graphiql:true,
}))

app.listen(process.env.PORT || config.PORT ,()=>{console.log("Server is Running")});
