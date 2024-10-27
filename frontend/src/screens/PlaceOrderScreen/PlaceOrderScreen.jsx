import React,{useContext, useReducer} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './PlaceOrderScreen.css'
import { Store } from '../../Store';
const reducer=(state,action)=>{
    switch(action.type){
        case 'CREATE_REQUEST':
            return {...state,loading:true};
        case 'CREATE_SUCCESS':
            return {...state,loading:false};
        case 'CREATE_FAIL':
            return {...state,loading:false};
    }
}
export default function PlaceOrderScreen() {
    const {state,dispatch:ctxDispatch}=useContext(Store);
    const [{loading},dispatch]=useReducer(reducer,{loading:false});
    const {cart,userInfo}=state;
    const {shippingAddress,cartItems,paymentMethod}=cart;
    //rounding off to 2 decimal 
    const round2=(num)=>Math.round(num*100+Number.EPSILON)/100;
    cart.itemsPrice=round2(cartItems.reduce((a,c)=>a+c.quantity*c.price,0));
    cart.shippingPrice=cart.ItemsPrice > 100 ? 0 : 10;
    cart.taxPrice=round2(0.15*cart.itemsPrice);
    cart.totalPrice=cart.itemsPrice+cart.shippingPrice+cart.taxPrice;
    const navigate=useNavigate();
    function Cart(props) {
        return (
            <div className='cart-items'>
                <img className='responsive-img' src={props.image} />
                <div>
                    <Link to={`/product/${props.slug}`}>{props.name}</Link>
                </div>
                <div className='flex-container'>
                    <h4>{props.quantity}</h4>
                </div>
                <div>
                    <h4>{props.price}</h4>
                </div>
            </div>
        )
    }
    async function placeOrderHandler(){
        dispatch({type:'CREATE_REQUEST'});
        try{
        const response=await fetch('/api/orders',{
            method:'POST',
            headers:{
                'content-type':'application/json',
                // authorization:`Bearer ${userInfo.token}`
            },
            body:JSON.stringify({
                orderItem:cartItems,
                shippingAddress:shippingAddress,
                paymentMethod:paymentMethod,
                itemsPrice:cart.itemsPrice,
                shippingPrice:cart.shippingPrice,
                taxPrice:cart.taxPrice,
                totalPrice:cart.totalPrice,
                user:userInfo,
            })
        })
        const {orderId}=await response.json();
        ctxDispatch({type:'CART_CLEAR'});
        dispatch({type:'CREATE_SUCCESS'});
        localStorage.removeItem('cartItems');
        navigate(`/orders/${orderId}`);
    }
    catch(e){
        dispatch({type:'CREATE_FAIL'});
        console.log(e);
        throw new Error(e);
    }
    }
    return (
        <div>
            <h1>Preview Order</h1>
            <div className='placeorder'>
                <div>
                    <div>
                        <h2>Shipping</h2>
                        <div>Name:{shippingAddress.fullname}</div>
                        <div>Address:{shippingAddress.address}</div>
                    </div>
                    <div>
                        <h2>Payment</h2>
                        <div>Method:{paymentMethod}</div>
                    </div>
                    <div>
                        <h2>Items</h2>
                        <div className='cart-container'>
                            {cartItems.map((item) => <Cart key={item._id} image={item.image} name={item.name} quantity={item.quantity} slug={item.slug} price={item.price} id={item._id} />)}
                        </div>
                    </div>
                </div>
                {/* order summary */}
                <div>
                    <h2>Order Summary</h2>
                    <div>
                        <div>Items:{cart.itemsPrice}</div>
                        <div>Shipping:{cart.shippingPrice}</div>
                        <div>Tax:{cart.taxPrice}</div>
                        <div>Order Total:{cart.totalPrice}</div>
                    </div>
                    <button onClick={placeOrderHandler} disabled={cartItems.length===0}>Place Order</button>
                </div>
            </div>
        </div>
    )
}
