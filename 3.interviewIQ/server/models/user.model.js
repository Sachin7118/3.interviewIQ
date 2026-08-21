import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        default:"",
        select:false
    },
    credits:{
        type:Number,
        default:100
    }

}, {timestamps:true})

const User = mongoose.model("User" , userSchema)

export default User