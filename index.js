// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// app.use(express.json());
// require("./app");
// const user = mongoose.model("Userdata");
// const detail = mongoose.model("Taskinfo")
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// app.use(cors());
// const jwt = require("jsonwebtoken");


// const JWT_SECRET =
//   "jdsudkdsid5841645488151646()jhudksdnkbsjcbdscds21c6ds4v6ds1vds15v4dsvndsdsoiods8789631450dcdudsnisasoduiypewfif";

// const mongourl ="mongodb://blckluxury17:blckluxury@ac-3uciipg-shard-00-00.fuldxxy.mongodb.net:27017,ac-3uciipg-shard-00-01.fuldxxy.mongodb.net:27017,ac-3uciipg-shard-00-02.fuldxxy.mongodb.net:27017/?ssl=true&replicaSet=atlas-ts9t6p-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
//   // "mongodb+srv://nareshpattss:nareshout@cluster-out.ivfodi6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-out";

//   mongoose.connect(mongourl)
//   .then(() => {
//     console.log("connected to database");
//   })
//   .catch((error) => console.log(error,"connect error"));

// // register

// app.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   const encPass = await bcrypt.hash(password, 10);
//   try {
//     const oldUser = await user.findOne({ email });
//     if (oldUser) {
//       return res.send({ error: "user Exists" });
//     }
//     await user.create({
//       name,
//       email,
//       password: encPass,
//     });
//     res.send({ status: "ok" });
//   } catch (error) {
//     res.send({ status: "rerror" });
//   }
// });

// // login

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const userRecord = await user.findOne({ email });

//     if (!userRecord) {
//       return res.json({ error: "user not found" });
//     }
//     if (await bcrypt.compare(password, userRecord.password)) {
//       const token = jwt.sign({ email: userRecord.email }, JWT_SECRET);

//       if (res.status(201)) {
//         return res.json({
//           status: "ok",
//           data: {
//             token,
//             userName: userRecord.name,
//             userMail: userRecord.email,
//           },
//         });
//       } else {
//         return res.json({ error: "lerror" });
//       }
//     }
//     res.json({ status: "error", error: "Invalis password" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// // getuser from login

// app.post("/data", async (req, res) => {
//   const { token } = req.body;
//   try {
//     const users = jwt.verify(token, JWT_SECRET, (err, res) => {
//       if (err) {
//         return "token expired";
//       }
//       return res;
//     });
//     if (users == "token expired") {
//       return res.send({ status: "error", data: "token expired" });
//     }
//     const useremail = users.email;
//     await user
//       .findOne({ email: useremail })
//       .then((data) => {
//         if (!data) {
//           res.send({ status: "error", data: "User not found" });
//         } else {
//           res.send({ status: "ok", data: data });
//         }
//       })
//       .catch((error) => {
//         res.send({ status: "error", data: error });
//       });
//   } catch (error) {
//     console.log("kserror");
//   }
// });

// // for details

// app.post("/addtask", async(req,res)=>{
//   await detail.create(req.body)
//   .then((stud)=>res.json(stud))
//   .catch((err)=>res.json(err,"register error"))
// });

// app.get("/reciev", async (req, res) => {
  
//   try {
//     const users = await detail.find();
//     if (users) {
//       res.json(users);
//     } else {
      
//       res.status(404).json({ status: "create a book list" });
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Error fetching data from the server" });
//   }
// });

// // for delete details of user

// app.post("/deletetask", async (req, res) => {
//   const { taskid } = req.body;
//   try {
//     const result = await detail.deleteOne({ _id: taskid });
//     if (result.deletedCount === 1) {
//       res.status(200).json({ status: "ok", message: "Task deleted successfully" });
//     } else {
//       res.status(404).json({ status: "error", message: "User not found or already deleted" });
//     }
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({ status: "error", message: "Internal server error" });
//   }
// });

// // for edit user details

// app.post("/edittask", async (req,res)=>{
//   const {id,task} = req.body;
//   try {
//     await detail.updateOne({_id:id},{
//       $set:{
//         Task:task,
        
//       }
//     })
//     return res.json({status:"ok",data:"updated"})
//   } catch (error) {
//     return res.json({status:"editerror",data:error})
//   }
// })

// app.listen(5001, () => {
//   console.log("server started");
// });
const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors());
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET;
const userFilePath = "./userdata.json";
const taskFilePath = "./taskinfo.json";


const readJsonFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// Utility function to write JSON data to a file
const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const encPass = await bcrypt.hash(password, 10);
  const users = readJsonFile(userFilePath);

  const oldUser = users.find((user) => user.email === email);
  if (oldUser) {
    return res.send({ error: "user Exists" });
  }

  users.push({ name, email, password: encPass });
  writeJsonFile(userFilePath, users);
  res.send({ status: "ok" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = readJsonFile(userFilePath);

  const userRecord = users.find((user) => user.email === email);
  if (!userRecord) {
    return res.json({ error: "user not found" });
  }

  if (await bcrypt.compare(password, userRecord.password)) {
    const token = jwt.sign({ email: userRecord.email }, JWT_SECRET);
    return res.json({
      status: "ok",
      data: {
        token,
        userName: userRecord.name,
        userMail: userRecord.email,
      },
    });
  }

  res.json({ status: "error", error: "Invalid password" });
});

// Get user data
app.post("/data", async (req, res) => {
  const { token } = req.body;
  try {
    const users = jwt.verify(token, JWT_SECRET);
    const userEmail = users.email;
    const userData = readJsonFile(userFilePath).find((user) => user.email === userEmail);

    if (!userData) {
      return res.send({ status: "error", data: "User not found" });
    }
    res.send({ status: "ok", data: userData });
  } catch (error) {
    res.send({ status: "error", data: "Invalid token" });
  }
});

// Add task
app.post("/addtask", (req, res) => {
  const tasks = readJsonFile(taskFilePath);
  tasks.push(req.body);
  writeJsonFile(taskFilePath, tasks);
  res.json(req.body);
});

// Get all tasks
app.get("/reciev", (req, res) => {
  try {
    const tasks = readJsonFile(taskFilePath);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data from the server" });
  }
});

// Delete task
app.post("/deletetask", (req, res) => {
  const { taskid } = req.body;
  let tasks = readJsonFile(taskFilePath);
  const taskIndex = tasks.findIndex((task) => task._id === taskid);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    writeJsonFile(taskFilePath, tasks);
    res.status(200).json({ status: "ok", message: "Task deleted successfully" });
  } else {
    res.status(404).json({ status: "error", message: "Task not found or already deleted" });
  }
});

// Edit task
app.post("/edittask", (req, res) => {
  const { id, task } = req.body;
  let tasks = readJsonFile(taskFilePath);
  const taskIndex = tasks.findIndex((t) => t._id === id);

  if (taskIndex !== -1) {
    tasks[taskIndex].Task = task;
    writeJsonFile(taskFilePath, tasks);
    res.json({ status: "ok", data: "updated" });
  } else {
    res.json({ status: "editerror", data: "Task not found" });
  }
});

app.listen(5001, () => {
  console.log("server started");
});
