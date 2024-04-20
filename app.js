const mongoose = require('mongoose')

const UserDetails = new mongoose.Schema(
    {
    name:String,
    email:{type: String,unique:true},
    password:String,
},{
    collection:"Userinfo"
}
)
const UserDetails1 = new mongoose.Schema(
    {
        Author:String,
        ISBNNumber:String,
        Title:String,
        PublishDate:String,
        HadBuy:String,
        email:String,
},{
    collection:"Detailinfo"
}
)
mongoose.model('Userinfo',UserDetails)
mongoose.model('Detailinfo',UserDetails1)

