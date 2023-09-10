const jwt=require('jsonwebtoken')
const User = require('../models/user')
const errorHandler = require('./errorHander')
const authFunction = async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ', '')
        const decoded=jwt.verify(token,process.env.JWT_KEY)
        const user =await User.findOne({_id: decoded._id,token})
        console.log(decoded)
        if(!user)
        { 
            throw new Error()
        }
        req.user=user,
        req.role=decoded.role       
        req.token=token
        next()
    }
    catch(e){
        errorHandler({statusCode:401,message:'Not authenticated'},req,res)
    }
}

module.exports = authFunction