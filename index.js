require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/authRoutes')
const communityRoutes = require('./routes/communityRoutes')
const memberRoutes = require('./routes/memberRoutes')
const roleRoutes = require('./routes/roleRoutes')

const app = express()
const PORT = process.env.PORT || 4000

// middlewares
app.use(express.json())
app.use(cookieParser())

// auth routes
app.use("/v1/auth", authRoutes)
// community routes
app.use("/v1/community", communityRoutes)
// member routes
app.use("/v1/member", memberRoutes)
// role routes
app.use("/v1/role", roleRoutes)

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(PORT, ()=>{console.log(`Server Started on port ${PORT}`);})
    }).catch((err)=>{
        console.log(err);
    })



