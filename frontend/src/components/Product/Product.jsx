import React from 'react'
import {Link} from 'react-router-dom'
import './Product.css'
import Rating from '../Rating/Rating'
export default function Product({data}) {
  return (
    <div>
        <div className='product-card'>
            <img className='product-image' src={data.image}/>
            <Link to={`/product/${data.slug}`}>{data.name}</Link>
            <Rating rating={data.rating} numReviews={data.numReviews}/>
            <p>{data.price}</p>
            <button>Add to cart</button>
        </div>
    </div>
  )
}
