const express = require('express');
const app = express();
const port = 3000;



app.listen(port,(err)=>{
    if(err){
        cout<<err;
    }else{
        console.log(`Server is running on port : ${port}`);
    }
})