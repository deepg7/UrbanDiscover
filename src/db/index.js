const mongoose = require('mongoose')
const User = require('../models/user')

const DATABASE_URL = process.env.DATABASE_URL ||'mongodb://127.0.0.1/UrbanDiscover'
const connectToDB = ()=>{
    mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    }).then(async()=>{
        await User.init()
        console.log("mongo connected, models initialised")
    })
}

module.exports = connectToDB


