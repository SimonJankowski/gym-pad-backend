require("dotenv").config();
const mongoose = require("mongoose")


const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "Atlas database connection error:"));
    db.once("open", () => {
        console.log("Atlas Database connected");
    });
  }

  module.exports = connectDB