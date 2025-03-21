const jwt = require('jsonwebtoken');
const Users = require('../scheama/register')
async function checkauth(req,res,next){
if(req.cookies.jwt){
    const finduser = await Users.findOne({_id:jwt.verify(req.cookies.jwt,process.env.JWT_SECRET)})
     req.user = finduser
     next()
}else{
    res.status(201).send('unauthorized')
}
}
module.exports = checkauth