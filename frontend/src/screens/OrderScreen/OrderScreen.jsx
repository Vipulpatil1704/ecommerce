import React, { useContext, useEffect, useReducer } from 'react'
import './OrderScreen.css'
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../../Store';
import { Link } from 'react-router-dom';
import {PayPalButtons,usePayPalScriptReducer} from '@paypal/react-paypal-js'
const reducer=(state,action)=>{
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state,loading:true,error:''}
        case 'FETCH_SUCCESS':
            return {...state,loading:false,order:action.payload,error:''}
        case 'FETCH_FAIL':
            return {...state,loading:false,error:action.payload}
        case 'PAY_REQUEST':
            return {...state,loadingPay:true};
        case 'PAY_SUCCESS':
            return {...state,loadingPay:false,successPay:true};
        case 'PAY_FAIL':
            return {...state,loadingPay:false};
        case 'PAY_RESET':
            return {...state,loadingPay:false,successPay:false};
        default :
            return state;
    }
}
export default function OrderScreen() {
    const params = useParams();
    const navigate=useNavigate();
    const {state}=useContext(Store);
    const {userInfo}=state;
    const {id:orderId} = params;
    const [{loading,error,order,successPay,loadingPay},dispatch]=useReducer(reducer,{loading:true,order:{},error:'',successPay:false,
        loadingPay:false,});
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
    const [{isPending},paypalDispatch]=usePayPalScriptReducer(); 
    function createOrder(data,actions){
        return actions.order.create({purchase_units:[{amount:{value:order.totalPrice}}]}).then((orderId)=>{return orderId});
    }
    function onApprove(data,actions){
        return actions.order.capture().then(async function (details){
            try{
                console.log("inside try block");
                dispatch({type:'PAY_REQUEST'});
                 const response=await fetch(`/api/orders/${order._id}/pay`,{
                    method:'PUT',
                    headers:{
                        'content-type':'application/json',
                    },
                    body:JSON.stringify(details)
                 });
                 const data=await response.json();
                 if(response.status!==404){
                    dispatch({type:'PAY_SUCCESS',payload:data.order});
                    console.log("order is paid");
                 }
                 else{
                    dispatch({type:'PAY_FAIL',payload:data.message});
                    console.log(error);
                 }
            }
            catch(err){
                dispatch({type:'PAY_FAIL',payload:err});
                console.log(error);
            }
        })
    }
    function onError(err){
        console.log(err);
    }
    useEffect(()=>{
        const fetchOrder=async ()=>{
            dispatch({type:'FETCH_REQUEST'});
            try{
                const response=await fetch(`/api/orders/${orderId}`);
                const data=await response.json();
                if(response.status!==404){ 
                    dispatch({type:'FETCH_SUCCESS',payload:data});
                }
                else{
                    dispatch({type:'FETCH_FAIL',payload:data.message})
                }
            }
            catch(e){
                dispatch({type:'FETCH_FAIL',payload:e});
                console.log(e);
            }

        }
        if(!userInfo){
            navigate('/login');
        }
        if(!order._id || successPay || (order._id && order._id!==orderId)){
            fetchOrder();
            if(successPay){
                dispatch({type:'PAY_RESET'});   
            }
        }
        else{
            const loadPaypalScript=async ()=>{
               const response= await fetch('/api/keys/paypal');
               const {data:clientId}=await response.json();
               paypalDispatch({type:'resetOptions',value:{'client-id':clientId,currency:'USD',
               }})
               paypalDispatch({type:'setLoadingStatus',value:'pending'});
            }       
            loadPaypalScript();
        }
    },[order,userInfo,orderId,successPay,paypalDispatch])
    return (
        <div>
            <div className='order-container'>
                <h1>Order:{orderId}</h1>
                {loading ? <div>Loading...</div>:
                      <div className='order'>
                      <div className='left-child'>
                          <div>
                              <h1>Shipping</h1>
                              <h3>Name:{order.shippingAddress.fullname}</h3>
                              <h3>Address:{order.shippingAddress.address}</h3>
                              {/* status */}
                              {order.isDelivered ? <h3>Delivered at {order.deliveredAt}</h3>:<h3>Not Delivered</h3>}
                          </div>
                          <div>
                              <h1>Payment</h1>
                              <h3>Method:{order.paymentMethod}</h3>
                              {/* status */}
                              {order.isPaid ? <h3>Paid at {order.paidAt}</h3>:<h3>Not Paid</h3>}
                          </div>
                          <div>
                          <h2>Items</h2>
                          <div className='cart-container'>
                              {order.orderItem.map((item) => <Cart key={item._id} image={item.image} name={item.name} quantity={item.quantity} slug={item.slug} price={item.price} id={item._id} />)}
                          </div>
                          </div>
                      </div>
                      <div className='right-child'>
                        <h2>Order summary</h2>
                        <h4>Items:{order.itemsPrice}</h4>
                        <h4>Shipping:{order.shippingPrice}</h4>
                        <h4>Tax:{order.taxPrice}</h4> 
                        <h4>Order Total:{order.totalPrice}</h4>
                        {!order.isPaid && <div>{isPending ? <div>Loading...</div>:<div><PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons></div>}</div>}
                        {loadingPay && <div>Loading...</div>}
                      </div>
                  </div>
                }
            </div>
        </div>
    )
}
