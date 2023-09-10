const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectToDB = require("./db")
const PORT = process.env.PORT || 3000
const app = express()
const userRouter = require("./routers")

// dotenv.config()
connectToDB()

app.use(express.json())
app.use(cors())

app.use("/user",userRouter)

app.listen(PORT,()=>{
    console.log(`Running on port ${PORT}`)
})


