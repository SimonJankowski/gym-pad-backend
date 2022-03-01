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
  origin:'http://localhost:3000', 
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
  const user = await User.findOne({ id: req.params.id });
  console.log(user);
  if (!user)
    return res.status(404).send("The user with this id was not found.");
  return res.send(user);
});

//Handle of PATCH request is working but i haven't done full research how it should really look like
//$addToSet operator is not very clear for me, i'm just trying to push 4 diferent objects builded from the body of the request
//to 4 diferent arrays nested inside User model

app.patch("/user/:id", async (req, res) => {
  let user = await User.findOneAndUpdate(
    { id: req.params.id },
    {  $addToSet:
       {"stats.bodyweight":{date: req.body.timestamp, value: req.body.bodyweight}},
       $addToSet:
       {"stats.waist":{date: req.body.timestamp, value: req.body.waist}},
       $addToSet:
       {"stats.benchpress":{date: req.body.timestamp, value: req.body.benchpress}},
       $addToSet:
       {"stats.biceps":{date: req.body.timestamp, value: req.body.biceps}}
    }
  );
  //console.log(user.stats);
  //console.log(req.body);
  return res.send("got it");
});

const PORT = process.env.PORT || 3002
app.listen(PORT, ()=>{
    console.log(`Gym-Pad back-end avaiable on port ${PORT}`)
})