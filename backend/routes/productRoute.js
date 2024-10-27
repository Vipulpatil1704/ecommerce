import express from 'express'

const productRouter =express.Router();
import Product from '../models/ProductModal.js'
const PAGE_SIZE=3;
productRouter.get('/',async (req,res)=>{
    const products=await Product.find({});
    res.send(products);
})
productRouter.get('/search',async (req,res)=>{
    const {query}=req;
    const pageSize=query.pageSize || PAGE_SIZE;
    const page=query.page || 1;
    const category=query.category || '';
    const brand=query.brand || '';
    const price=query.price || '';
    const rating=query.rating || '';
    const order=query.order || '';
    const searchQuery=query.query || '';
    //we have to search products using search query but not just search query there are filters as well so we have to find products from database which matches all of the filters only.
    //First thing is we have to modify searchQuery so that it will not just search for exactly query in documents rather it will match the portion.
    const queryFilter=searchQuery && searchQuery!=='all' ? {
        name:{
            $regex:searchQuery,
            $options:'i',
        }
    } : {};

    //now add filters query to be applied to fetch documents from collection 
    const categoryFilter=category && category!=='all' ? {category}:{};
    const ratingFilter= rating && rating!=='all' ? { rating:{$gte:Number(rating)}}:{};
    const priceFilter=price && price!=='all' ? {
        price:{
            $gte:Number(price.split('-')[0]),
            $lte:Number(price.split('-')[1]),
        }
    }:{};
    const sortOrder= order==='featured' ? {featured:-1} : order==='lowest' ? {price:1} : order==='highest' ? {price:-1} : order==='toprated' ? {rating:1} : order==='newest' ? {createdAt:-1} : {_id:-1};
    const products=await Product.find({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
    })
    .sort(sortOrder).skip(pageSize*(page-1)).limit(pageSize);
    const countProducts=await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter
     });   
     res.send({
        products,
        countProducts,
        page,
        pages:Math.ceil(countProducts/pageSize),
     });
})
productRouter.get("/slug/:slug",async (req,res)=>{
    const product=await Product.findOne({slug:req.params.slug});
    if(product){
        res.send(product);
    }
    else{
        res.status(404).send({message:'Product not found'});
    }
});

productRouter.get('/categories',async(req,res)=>{
    const categories=await Product.find({}).distinct('category');
    res.send(categories);
})
productRouter.get("/:id",async (req,res)=>{
    const product=await Product.findById(req.params.id);
    if(product){
        res.send(product);
    }
    else{
        res.status(404).send({message:'Product not found'});
    }
});
export default productRouter;