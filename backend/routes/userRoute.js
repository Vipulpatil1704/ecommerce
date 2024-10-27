import express from 'express'
const userRouter=express.Router();
import User from '../models/User.js'
import bcrypt from 'bcryptjs';
import {generateToken} from '../middlewares/utils.js'
userRouter.post('/signin',async (req,res)=>{
    try{
        
        const user=await User.findOne({username:req.body.username});
        if(user){
            if(bcrypt.compareSync(req.body.password,user.password)){
                res.send({
                    _id:user._id,
                    username:user.username,
                    token:generateToken(user)
                })
                return;
            }
        }
        res.status(401).send({message:"Invalid username or password"})
    }
    catch(error){
        res.status(500).json({error:error})
    }
});
userRouter.post('/signup',async (req,res)=>{
    const {fullname,username,password,}=req.body;
    const newUser=new User({
        name:fullname,
        username:username,
        password:bcrypt.hashSync(password),
        isAdmin:false,
    })
    try{
        //find user 
        const foundUser=await User.findOne({username:username});
        if(foundUser){
            res.status(500).send({message:'user exist already'});
            return;
        }
        const user=await newUser.save();
        res.status(200).send({
            _id:user._id,
            username:user.username,
            token:generateToken(user)
        })
    }
    catch(e){
        res.status(500).send({message:e.errorResponse.errmsg});
    }

})
userRouter.put('/',async (req,res)=>{
    const new_details=req.body;
    let user=await User.findOne({username:new_details.username});
    if(user){
  
        if(bcrypt.compareSync(new_details.password,user.password)){
            user.name=new_details.fullname;
            user.username=new_details.username;
            user=await user.save();
            res.send(user);
        }
        else{
            res.status(400).send({message:'Please enter correct password'});
            return;
        }

    }
    else{
        res.status(400).send({message:'User doesnt found'})
    }
})
export default userRouter;