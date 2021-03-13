require('dotenv').config()



config = {
    mongodblocal: {
        connectionString:"mongodb+srv://Admin:admin@cluster0.spnni.mongodb.net/test"
    },
    PORT:5000,
    /*pool_region :'us-east-2',
    UserPoolId : "us-east-2_gbGsTviN1",    
    ClientId : "5mancm4soeolgeii6aa01p6lm4",*/
    pool_region :'ap-south-1',
    UserPoolId : "ap-south-1_jQWarxd0Y",    
    ClientId : "lr10mhj30smesbq05nrv0pevp",
}
module.exports = config