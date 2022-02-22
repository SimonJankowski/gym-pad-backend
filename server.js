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

app.get('/user/:id', async (req,res)=>{
  const user = await User.find({id:req.params.id})
  console.log(user)

  return res.send(user);
  
})

const PORT = process.env.PORT || 3002
app.listen(PORT, ()=>{
    console.log(`Gym-Pad back-end avaiable on port ${PORT}`)
})