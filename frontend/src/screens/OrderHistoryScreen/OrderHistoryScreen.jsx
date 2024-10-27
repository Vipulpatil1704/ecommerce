import React, { useContext, useEffect, useReducer } from 'react'
import './OrderHistoryScreen.css'
import { Store } from '../../Store';
const reducer=(state,action)=>{
    switch(action.type){
       case 'FETCH_REQUEST': 
        return {...state,loading:true};
       case 'FETCH_SUCCESS':
        return {...state,loading:false,orders:action.payload};
       case 'FETCH_FAIL':
        return {...state,loading:false,error:action.payload}
    }
    
}
export default function OrderHistoryScreen() {
    const [{loading,orders,error},dispatch]=useReducer(reducer,{loading:true,orders:[],error:''})
    const {state}=useContext(Store);
    const {userInfo}=state
    useEffect(()=>{
        const fetchData=async()=>{
            dispatch({type:'FETCH_REQUEST'});
            const response=await fetch('/api/orders/',{headers:{authorization:`Bearer ${userInfo.token}`}});
            const data=await response.json();
            if(response.status!==404){
                dispatch({type:'FETCH_SUCCESS',payload:data});
            }
            else{
                dispatch({type:'FETCH_FAIL',payload:data.message});
            }          
        }
        fetchData();
    },[userInfo])
    console.log(orders);
  return (
    <div>
        <h1>Order History</h1>
        {orders && orders.length && orders.map((order)=> <table key={order._id} cellSpacing={50}>
            <thead>
                <th>Hello:{true}</th>
                <th>ID:{order._id}</th>
                <th>DATE{order.createdAt}</th>
                <th>TOTAL:{order.totalPrice}</th>
                <th>PAID:{order.isPaid ? 'YES':'NO'}</th>
                <th>DELIVERED:{order.isDelivered ? 'YES':'NO'}</th>
                <th>ACTIONS</th>
            </thead>
            <tbody>
                
            </tbody>
        </table>)}
       
    </div>
  )
}
