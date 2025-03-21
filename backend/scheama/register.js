const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const usersch = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  filename:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  phone:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  chats:[{type:String}],
})
usersch.pre('save',async function(next){
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
}

next();

})

const usescheams = mongoose.model('user',usersch)
module.exports = usescheams