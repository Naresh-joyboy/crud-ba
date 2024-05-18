const mongoose = require('mongoose')

const UserDetails = new mongoose.Schema(
    {
    name:{ type: String, required: true },
    email:{type: String,unique:true},
    password:{ type: String, required: true },
},{
    collection:"Userinfo"
}
)
const UserDetails1 = new mongoose.Schema(
    {
        Author:{ type: String, required: true },
        ISBNNumber:{ type: String, required: true },
        Title:{ type: String, required: true },
        PublishDate:{ type: String, required: true },
        HadBuy:{ type: String, required: true },
        email:{ type: String, required: true },
        image: {
            public_id: { type: String, required: true },
            url: { type: String, required: true }
      }
},{
    collection:"Detailinfo"
}
)
mongoose.model('Userinfo',UserDetails)
mongoose.model('Detailinfo',UserDetails1)

