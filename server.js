require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser=require("body-parser");
const router = express.Router();
const mongoose =require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const cors = require("cors");
const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200
}

connectDB()
app.use("/",router);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors(corsOptions));

app.get('/', async (req, res) => {
  const users = await User.find({})
  console.log(users)
    return res.send(users);
  });

app.post('/register' , async (req,res)=>{
  const foundUser = await User.findOne({id:req.body.id})
  if(foundUser){
    console.log(foundUser)
    return res.send("user with this id exists")
  }
  const {id, username} = req.body
  const newGoogleUser =new User({
    name:username, 
    id:id, 
    registered:Date.now(), 
    stats:{
      waist:[], 
      bodyweight:[], 
      biceps:[], 
      benchpress:[]
    }
  })
    newGoogleUser.save()
  console.log(newGoogleUser)
  res.send(newGoogleUser)
})

app.get("/user/:id", async (req, res) => {
  if(req.params.id===null) return res.send("null casted as ID")
  const user = await User.findOne({ id: req.params.id });
  console.log(user);
  if (!user) {
    console.log("request usera co nie ma")
    return res.send("The user with this id was not found.");
  } else {
    return res.send(user);
  }
});

//Handle of PATCH request is working but i haven't done full research how it should really look like
//$addToSet operator is not very clear for me, i'm just trying to push 4 diferent objects builded from the body of the request
//to 4 diferent arrays nested inside User model
// https://stackoverflow.com/questions/71288634/struggle-with-mongoose-query-pushing-different-objects-into-different-arrays-in

app.patch("/user/:id", async (req, res) => {
  let user = await User.findOneAndUpdate(
    { id: req.params.id },
    {  $push:
       {"stats.bodyweight":{date: req.body.timestamp, value: req.body.bodyweight},
      
       "stats.waist":{date: req.body.timestamp, value: req.body.waist},
     
       "stats.benchpress":{date: req.body.timestamp, value: req.body.benchpress},
     
       "stats.biceps":{date: req.body.timestamp, value: req.body.biceps}
    }
  },  { returnNewDocument: true, returnDocument: "after" }
  );
  return res.send(user);
});

const PORT = process.env.PORT || 3002
app.listen(PORT, ()=>{
    console.log(`Gym-Pad back-end avaiable on port ${PORT}`)
})