import React, { useContext, useEffect } from 'react'
import './CartScreen.css'
import { Link,useNavigate } from 'react-router-dom'
import { Store } from '../../Store'
function Cart(props) {
    const { state,dispatch } = useContext(Store);
    const { cart: { cartItems } } = state;
    async function updateCartHandler(id,quantity){
        const response=await fetch(`/api/products/${id}`);
        const data=await response.json();
        if(data.countInStock<quantity){
            window.alert('sorry,product is out of stock');
            return;
        }
        dispatch({type:'CART_ADD_ITEM',payload:{...data,quantity}});
    }
    function removeItemHandler(id){
        dispatch({type:'CART_REMOVE_ITEM',payload:{id}})
    }
    return (
        <div className='cart-items'>
            <img className='responsive-img' src={props.image} />
            <div>
                <Link to={`/product/${props.slug}`}>{props.name}</Link>
            </div>
            <div className='flex-container'>
                <button onClick={()=>updateCartHandler(props.id,props.quantity-1)} disabled={props.quantity===1}>-</button>
                <h4>{props.quantity}</h4>
                <button onClick={()=>updateCartHandler(props.id,props.quantity+1)}>+</button>
            </div>
            <div>
                <h4>{props.price}</h4>
            </div>
            <div>
                <button onClick={()=>removeItemHandler(props.id)}>Delete</button>
            </div>
        </div>
    )
}
export default function CartScreen() {
    const { state } = useContext(Store);
    const { cart: { cartItems } } = state;
    const navigate=useNavigate();
    function CheckoutHandler(){
        navigate('/signin?redirect=/shipping');
    }
    return (
        <div className='container'>
            <h1>Shopping Cart</h1>
            <div className='cart-container'>
                {cartItems.map((item) => <Cart key={item._id} image={item.image} name={item.name} quantity={item.quantity} slug={item.slug} price={item.price} id={item._id}/>)}
            </div>
            <div>
                <h1>Subtotal ({ cartItems.reduce((a,c)=>a+c.quantity,0)} items:)$
                    {cartItems.reduce((a,c)=>a+c.price*c.quantity,0)}
                    </h1>
                <button onClick={CheckoutHandler}>Proceed to checkout</button>  
            </div>
            
        </div>
  )
}
