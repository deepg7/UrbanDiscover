const express = require('express')
const User = require('../models/user')
const auth = require('./../middleware')
const checkPassword = require('../middleware/checkPassword')
const mailer = require('../middleware/mailer')
const router = new express.Router()

router.post('/signup',async(req,res)=>{
   const user = new User(req.body)
   
    try {
        const passwordPass = checkPassword(user.password)
        if(!passwordPass) throw new Error("Password must contain special characters, uppercase, lowercase, numbers and atleast 7 digits!")
        if(!/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/.test(user.email)) throw new Error("Enter Correct Email!")
        const token = await user.generateAuthToken()
        return res.status(201).send({user,token})
    } 
    catch (e) {
        console.log(e)
        return res.status(400).send(e)
    }
})

router.post('/login',async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        console.log(token)
        return res.status(200).send({user,token})
    } catch (e) {
        return res.status(400).send(e)
    }
})

router.get("/makeAdmin",auth,async(req,res)=>{
    if(!req.user) return res.status(400).send("protected route")
    console.log(req.user)
    const user = await User.findById(req.user._id)
    const token = await user.makeAdmin()
    return res.send({user,token})
})

router.post('/logout',auth,async (req,res)=>{
    try {
        req.user.token=null
        console.log(req.user)
        await req.user.save()
        
        res.status(200).send()
    } catch (e) {
        console.log(e)
        res.status(400).send('err')
    }
})

router.post('/resetPassword',async(req,res)=>{
    try {
        const otp = (Math.floor(Math.random()*10000))+1
        const user = await User.findOne({email:req.body.email})
        user.otp=otp
        await user.save()
        const text = 'Your OTP is '+ otp + ' and it is valid for 3 minutes!' 
        console.log(user.email)
        mailer(user.email,'OTP For Email Verification!',text)
        async function deleteOtp(){
            user.otp=null
            await user.save()
        }
        res.send('Mail Sent')
        setTimeout(deleteOtp,180000) 
    } catch (e) {
        res.status(400).send(e)
    } 
})

router.post('/submitNewPassword',async(req,res)=>{
    try {
        const {otp,email,password}=req.body;
        const user = await User.findOne({email,otp})
        if (!user){
            return res.send('OTP Expired! Try Again!')
        }
        if(Number(user.otp)==Number(req.body.otp)){
            user.email_verified=true
            user.otp=null
            const passwordPass = checkPassword(password)
            if(!passwordPass) throw new Error("Password must contain special characters, uppercase, lowercase, numbers and atleast 7 digits!")
            user.password=password
            await user.save()
            return res.send('Successfull!')
        }
        user.otp=null
        await user.save()
        res.send('Wrong OTP Entered!')
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports=router