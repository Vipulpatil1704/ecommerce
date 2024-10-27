
import express from "express";
import Order from '../models/OrderModal.js'
import {isAuth} from '../middlewares/utils.js'
const orderRouter=express.Router();
orderRouter.get('/',isAuth,async (req,res)=>{
    console.log("order route");
    const orders=await Order.find({user:req.user._id});
    if(orders){
        res.send(orders);
    }
    else{
        res.status(404).send({message:'No order found'});
    }
})
orderRouter.post('/',async (req,res)=>{

    const newOrder=new Order({
        orderItem:req.body.orderItem.map((x)=>({...x,product:x._id})),
        shippingAddress:req.body.shippingAddress,
        paymentMethod:req.body.paymentMethod,
        itemsPrice:req.body.itemsPrice,
        shippingPrice:req.body.shippingPrice,
        taxPrice:req.body.taxPrice,
        totalPrice:req.body.totalPrice, 
        user:req.body.user,
    })

    const order=await newOrder.save();
    res.status(201).send({orderId:order._id});
});
orderRouter.get('/:id',async (req,res)=>{
    //get order details by an order id.
    const order=await Order.findById(req.params.id);
    if(order){
        res.send(order);
    }
    else{
        res.status(404).send({message:'Order not found'});
    }
    

})
orderRouter.put('/:id/pay',async (req,res)=>{
    const order=await Order.findById(req.params.id);
    if(order){
        order.isPaid=true;
        order.paidAt=Date.now();
        order.paymentResult={
            id:req.body.id,
            status:req.body.status,
            update_time:req.body.update_time,
            email_address:req.body.email_address,
        };
        const updatedOrder=await order.save();
        console.log("goingin inside orderRouter");
        res.send({message:'Order Paid',order:updatedOrder});
    }
    else{
        res.status(404).send({message:'Order Not Found'});
    }
})
export default orderRouter;