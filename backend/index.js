const express = require('express');
const app = express()
const env = require('dotenv')
const path = require('path');
env.config({path:'./config.env'})
require('./conn/conn')
const routes = require('./router/router')

app.use("/",routes)
// app.use(express.static('./uploads'))
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));


app.listen(process.env.PORT,()=>{
    console.log(`Project Running ${process.env.PORT}`)
})
