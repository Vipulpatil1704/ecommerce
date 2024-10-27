import express from 'express';
import data from './data.js'
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose'
import userRouter from './routes/userRoute.js';
import seedRouter from './routes/seedRoute.js';
import productRouter from './routes/productRoute.js';
import orderRouter from './routes/orderRoute.js';
dotenv.config();
const app=express();
// Middleware to parse JSON bodies

//without this line if you try to post data to server it won't work. Even if you are sending data /post data to server through req.body and when you will receive that data and see the req.body will be a empty object
app.use(express.json());
// Enable CORS for specific origin
<<<<<<< HEAD
// const allowedOrigins = ['https://amazona-6391.vercel.app']; // Update this with your frontend URL
=======
const allowedOrigins = ['https://amazona-6391.vercel.app']; // Update this with your frontend URL
>>>>>>> f11ba31ae5556428bf1f508998708d9c32bc1255

// app.use(cors({
//     origin: allowedOrigins, // Only allow specified origins
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
//     credentials: true, // Allow credentials (if needed)
// }));
mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log('connected to db');
 }).catch((err)=>{
    console.log(err.message);
 })
 app.use(cors({
    origin: 'http://localhost:3001', // Your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
// app.get("/api/products",(req,res)=>{
//     res.send(data.products);
// });
app.use('/api/products',productRouter);
//all routes related to product is in productRoute.js 

//Initially we have stored products on server itself in data.js file that's why we have created this api. but now data for products is stored in db.

// app.get("/api/products/slug/:slug",(req,res)=>{
//     const product=data.products.find(x=>x.slug===req.params.slug);
//     if(product){
//         res.send(product);
//     }
//     else{
//         res.status(404).send({message:'Product not found'});
//     }
// });
// app.get("/api/products/:id",(req,res)=>{
//     const product=data.products.find(x=>x._id==req.params.id);
//     if(product){
//         res.send(product);
//     }
//     else{
//         res.status(404).send({message:'Product not found'});
//     }
// });
//login,signup
app.use('/api/Users',userRouter);
app.use('/api/seed',seedRouter);
app.use('/api/orders',orderRouter);
app.use('/api/keys/paypal',(req,res)=>{
    res.send({data:process.env.PAYPAL_CLIENT_ID || 'sb'});
    //sb stands for sandbox
})
const port=process.env.PORT || 5000 ;
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
