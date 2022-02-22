const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:false
    },
    id:{
        type:Number,
        required:true
    },
    registered:{
        type:Number,
        required:true
    },
    stats:{
        waist:[{date:Number, value:Number}],
        bodyweight:[{date:Number, value:Number}],
        biceps:[{date:Number, value:Number}],
        benchpress:[{date:Number, value:Number}]
    }
})

const User = mongoose.model("user", userSchema)
module.exports = User