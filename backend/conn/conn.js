const mongoose = require('mongoose')

mongoose.connect(process.env.CONN).then((e)=>{
    console.log("db conn sucess")
}).catch((e)=>{
    console.log(e)
})