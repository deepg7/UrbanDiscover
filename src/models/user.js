const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        minlength:7,
    },
    token:{
        type: String,
    },
    otp:{
        type:Number
    },
},{
    timestamps:true
})

userSchema.methods.toJSON= function(){
    const user = this
    const userObject =user.toObject()
    delete userObject.password
    delete userObject.token
    return userObject
}

userSchema.methods.generateAuthToken = async function() {

    const user=this
    const token= jwt.sign({_id: user._id.toString(),role:null},process.env.JWT_KEY,{expiresIn:120})
    user.token=token
    await user.save()
    return token
    
}

userSchema.methods.makeAdmin = async function(){
    const user=this
    console.log("hi")
    const token= jwt.sign({_id: user._id.toString(),role:'Admin'},process.env.JWT_KEY,{expiresIn:120})
    user.token=token
    await user.save()
    return token
}

userSchema.statics.findByCredentials= async(email,password)=>{
    const user = await userModel.findOne({email})
    
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    
    next()
})

const userModel = mongoose.model('User',userSchema)

module.exports = userModel