const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
require("./app");
const user = mongoose.model("Userinfo");
const detail = mongoose.model("Detailinfo")
const cors = require("cors");
const bcrypt = require("bcryptjs");
app.use(cors({ origin: "http://localhost:5173" }));
const jwt = require("jsonwebtoken");


const JWT_SECRET =
  "jdsudkdsid5841645488151646()jhudksdnkbsjcbdscds21c6ds4v6ds1vds15v4dsvndsdsoiods8789631450dcdudsnisasoduiypewfif";

const mongourl ="mongodb://blckluxury17:blckluxury@ac-3uciipg-shard-00-00.fuldxxy.mongodb.net:27017,ac-3uciipg-shard-00-01.fuldxxy.mongodb.net:27017,ac-3uciipg-shard-00-02.fuldxxy.mongodb.net:27017/?ssl=true&replicaSet=atlas-ts9t6p-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
  // "mongodb+srv://nareshpattss:nareshout@cluster-out.ivfodi6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-out";

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

app.post("/details", async(req,res)=>{
  await detail.create(req.body)
  .then((stud)=>res.json(stud))
  .catch((err)=>res.json(err,"register error"))
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
  const { userid } = req.body;
  try {
    const result = await detail.deleteOne({ _id: userid });
    if (result.deletedCount === 1) {
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

app.listen(5001, () => {
  console.log("server started");
});
