require('dotenv').config()



config = {
    mongodblocal: {
        connectionString:"mongodb+srv://ADMIN:admin123@cluster0.lzybg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    },
    PORT:5000,
    pool_region :'ap-south-1',
    UserPoolId : "ap-south-1_jQWarxd0Y",    
    ClientId : "lr10mhj30smesbq05nrv0pevp",
}
module.exports = config