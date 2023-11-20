//import async-handler
const asyncHandler = require("express-async-handler");
//import jwt
const jwt = require("jsonwebtoken");


//create a validate token func(middleware)
const validateToken = asyncHandler(async(req,res,next)=>{
    //create a token variable
    let token;
    //create authHeader to get the authorization header either from Headers' Authorization or from Auth's bearer
    let authHeader = req.headers.Authorization || req.headers.authorization;
    //if get authHeader or starts with a bearer then,
    if(authHeader && authHeader.startsWith("Bearer")){
        //extract the token first from authHeader
        token = authHeader.split(" ")[1];
        //verify the token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
            if(err){
                res.status(401);
                throw new Error("User is not authorized");
            }
           //append the decoder user on requested user to extract the information embedded in the token and attach that info to our req.user property.
            req.user = decoded.user;
            // console.log(decoded);
            next();  
        });
       //check if token is not provided or the user is not authorized.
        if(!token){
            res.status(401);
            throw new Error("User is not authorized or token is missing");
        }
    }
        
})
    
//export the module
module.exports = validateToken;