const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
require("./app");
app.use('/uploads',express.static('uploads'))
const user = mongoose.model("Userinfo");
const detail = mongoose.model("Detailinfo")
const cors = require("cors");
const bcrypt = require("bcryptjs");
// const fs = require("fs")
const cloudinary = require("./Cloudinary");

app.use(cors());
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const dotenv = require("dotenv")
dotenv.config();

const JWT_SECRET =process.env.JWT_SECRET
 
const pass = process.env.MONGO_PASS
const mongourl = `mongodb://nareshpattss:${pass}@ac-wmxyr0d-shard-00-00.wkubra7.mongodb.net:27017,ac-wmxyr0d-shard-00-01.wkubra7.mongodb.net:27017,ac-wmxyr0d-shard-00-02.wkubra7.mongodb.net:27017/?ssl=true&replicaSet=atlas-nhq81q-shard-0&authSource=admin&retryWrites=true&w=majority&appName=formimg`
 
  mongoose.connect(mongourl)
  .then(() => {
    console.log("connected to database");
  })
  .catch((error) => console.log(error,"connect error"));

// register

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const encPass = await bcrypt.hash(password, 10);
  try {
    const oldUser = await user.findOne({ email });
    if (oldUser) {
      return res.send({ error: "user Exists" });
    }
    await user.create({
      name,
      email,
      password: encPass,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "rerror" });
  }
});

// login

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRecord = await user.findOne({ email });

    if (!userRecord) {
      return res.json({ error: "user not found" });
    }
    if (await bcrypt.compare(password, userRecord.password)) {
      const token = jwt.sign({ email: userRecord.email }, JWT_SECRET);

      if (res.status(201)) {
        return res.json({
          status: "ok",
          data: {
            token,
            userName: userRecord.name,
            userMail: userRecord.email,
          },
        });
      } else {
        return res.json({ error: "lerror" });
      }
    }
    res.json({ status: "error", error: "Invalis password" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// getuser from login

app.post("/data", async (req, res) => {
  const { token } = req.body;
  try {
    const users = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    if (users == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }
    const useremail = users.email;
    await user
      .findOne({ email: useremail })
      .then((data) => {
        if (!data) {
          res.send({ status: "error", data: "User not found" });
        } else {
          res.send({ status: "ok", data: data });
        }
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {
    console.log("kserror");
  }
});

// for details


app.post("/details", async (req, res) => {
  const { author, isbnno, title, date, had, email, image } = req.body;
  if (!author || !isbnno || !title || !date || !had || !email || !image) {
    return res.send({ code: 400, message: "Please fill all the fields" });
  }
  try {
    const result = await cloudinary.uploader.upload(image, { folder: "produ" });
    const newDetail = await detail.create({
      Author: author,
      ISBNNumber: isbnno,
      Title: title,
      PublishDate: date,
      HadBuy: had,
      email: email,
      image: { public_id: result.public_id, url: result.secure_url }
    });
    console.log(newDetail);
    res.json(newDetail);
  } catch (error) {
    res.status(500).json({ error: "Error saving details", message: error.message });
  }
});
app.get("/reciev", async (req, res) => {
  
  try {
    const users = await detail.find();
    if (users) {
      res.json(users);
    } else {
      
      res.status(404).json({ status: "create a book list" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data from the server" });
  }
});

// for delete details of user

app.post("/deleteuser", async (req, res) => {
  const { userid ,image} = req.body;
  console.log(image)
  try {
    await cloudinary.uploader.destroy(image);
    const result = await detail.deleteOne({ _id: userid });
    if (result.deletedCount === 1) {
      // fs.unlinkSync(`uploads\/${image}`)
      res.status(200).json({ status: "ok", message: "User deleted successfully" });
    } else {
      res.status(404).json({ status: "error", message: "User not found or already deleted" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// for edit user details

app.post("/edituser", async (req,res)=>{
  const {id,author,isbnno,title,date,had} = req.body;
  try {
    await detail.updateOne({_id:id},{
      $set:{
        Author:author,
        ISBNNumber:isbnno,
        Title:title,
        PublishDate:date,
        HadBuy:had
      }
    })
    return res.json({status:"ok",data:"updated"})
  } catch (error) {
    return res.json({status:"editerror",data:error})
  }
})

// forgot password

app.post("/forgotpass", async (req,res)=>{
try {
  const {email,ot}=req.body;
  
  const userRecord = await user.findOne({ email });
  if(!userRecord){
   return res.json({status:"user not exists"})
  }
  // const secret =JWT_SECRET + userRecord.password
  // const token = jwt.sign({email:userRecord.email, id:userRecord._id},secret,{expiresIn:"5m"})
  // const link = `http://localhost:5173/reset-password/${userRecord._id}/${token}`
  // console.log(link);
  var transporter = nodemailer.createTransport({
    service: 'nareshpattss@gmail.com',
    port: 587,
    secure:false,
    auth: {
      user: 'nareshpattss@gmail.com',
      pass: process.env.EMAIL_PASS
    }
  });
  
  var mailOptions = {
    from: 'nareshpattss@gmail.com',
    to: email,
    subject: 'Sending Email using Node.js',
    text: `your OTP:${ot} for reset password`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
} catch (error) { 
  console.log(error);
}
})

// app.get("/reset-password/:id/:token", async (req,res)=>{
//  const {id,token} =req.params;
//  console.log(req.params ,"hello");
// const oldUser = await user.findOne({_id:id});
// if(!oldUser){
//   return res.json({status:"user not exists"})
// }
// const secret = JWT_SECRET + oldUser.password
// try {
//   const verify = jwt.verify(token, secret);
//   res.send("verified")
// } catch (error) {
//    res.send("not verified")
// }
// res.send("done")
// })

app.listen(5001, () => {
  console.log("server started");
});

// for details multer get data in it------------------------------

  // const multer  = require('multer')

  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, 'uploads/')
  //   },
  //   filename: function (req, file, cb) {
  //     const uniqueSuffix = Date.now()
  //     cb(null, uniqueSuffix + file.originalname)
  //   }
  // })

  // const upload = multer({ storage: storage })

  // app.post("/details",upload.single("image"), async(req,res)=>{
  //   console.log(req);
  //   const Author = req.body.Author
  //   const ISBNNumber = req.body.ISBNNumber
  //   const Title = req.body.Title
  //   const PublishDate = req.body.PublishDate
  //   const HadBuy = req.body.HadBuy
  //   const email = req.body.email
  //   const image = req.file.path
  //   const fileimage = req.file.filename
  //   if(!Author ||!ISBNNumber ||!Title ||!PublishDate ||!HadBuy ||!email ||!image ||!fileimage ){
  //     return res.send({code:400, message:"fill the request"})
  //   }
  //   await detail.create({Author: Author, ISBNNumber:ISBNNumber,Title:Title,PublishDate:PublishDate,HadBuy:HadBuy,email:email,image:image,fileimage:fileimage})
  //   .then((stud)=>res.json(stud))
  //   .catch((err)=>res.json(err,"register error"))
  // });