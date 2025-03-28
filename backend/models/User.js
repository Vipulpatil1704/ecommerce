import mongoose, { mongo } from "mongoose";
const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true,unique:true},
    isAdmin:{type:Boolean,default:false,required:true},
},{timestamps:true})
const User=mongoose.model('User',userSchema);
export default User;