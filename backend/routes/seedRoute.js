import express from 'express'
import Product from '../models/ProductModal.js';
import data from '../data.js'
import User from '../models/User.js'
const seedRouter=express.Router();
seedRouter.get('/',async (req,res)=>{
    // await Product.remove({});
    await Product.deleteMany({});
    const createdProducts=await Product.insertMany(data.products);
    await User.deleteMany({});
    const createdUsers=await User.insertMany(data.users);
    res.send({createdProducts,createdUsers})
})
export default seedRouter;