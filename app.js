const mongoose = require('mongoose')

const UserDetails = new mongoose.Schema(
    {
    name:String,
    email:{type: String,unique:true},
    password:String,
},{
    collection:"Userdata"
}
)
const UserDetails1 = new mongoose.Schema(
    {
        Task:String,
        email:String
       
},{
    collection:"Taskinfo"
}
)
mongoose.model('Userdata',UserDetails)
mongoose.model('Taskinfo',UserDetails1)

