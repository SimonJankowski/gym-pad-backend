require("dotenv").config();

const mongoose = require("mongoose");
const usersData = require("./data/users");
const connectDB = require("./config/db");
const User = require("./models/User");

connectDB()

const reloadData = async()=>{
    try{
        await User.deleteMany({}); //passing empty braces will delete everything in mongo
        console.log("deleted everything")
        await User.insertMany(usersData)
        console.log("Data import Success");
    } catch(error){
        console.error("something went wrong", error);
    }
}

reloadData().then(()=>{
    mongoose.connection.close()
})