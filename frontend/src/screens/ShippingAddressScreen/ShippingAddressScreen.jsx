import React,{useContext, useEffect, useState} from 'react'
import './ShippingAddressScreen.css'
import { useFetcher, useNavigate } from 'react-router-dom';
import { Store } from '../../Store';
export default function ShippingAddressScreen() {
    const [shippingDetails,setShippingDetails]=useState({fullname:'',address:'',city:'',postalCode:'',country:''});
    const {state,dispatch:ctxDispatch}=useContext(Store);
    const {userInfo}=state;
    const navigate=useNavigate();
    function submitHandler(e){
        e.preventDefault();
        ctxDispatch({type:'SAVE_SHIPPING_ADDRESS',payload:{...shippingDetails}});
        localStorage.setItem('shippingAddress',JSON.stringify({...shippingDetails}));
        navigate('/payment');
    }
    function onInputChange(e){
        const {name,value}=e.target;
        setShippingDetails({...shippingDetails,[name]:value});
    }
    useEffect(()=>{
        if(!userInfo){
            navigate('/signin?redirect=shipping');
        }
        localStorage.getItem('shippingAddress') && setShippingDetails(JSON.parse(localStorage.getItem('shippingAddress')))
    },[])
  return (
    <div className='shipping'>
        <h1>Shipping Address</h1>
        <form onSubmit={submitHandler}>
            <div className='form-grid'>
                <label>Full Name:</label>
                <input type='text' name='fullname' value={shippingDetails.fullname} onChange={onInputChange}></input>
                <label>Address:</label>
                <input type='text' name='address' value={shippingDetails.address} onChange={onInputChange}></input>  
                <label>City:</label>
                <input type='text' name='city' value={shippingDetails.city} onChange={onInputChange}></input> 
                <label>Postal Code:</label>
                <input type='number' name='postalCode' value={shippingDetails.postalCode} onChange={onInputChange}></input> 
                <label>Country:</label>
                <input type='text' name='country' value={shippingDetails.country} onChange={onInputChange}></input>
                <button type='submit'>Continue</button>
            </div>         
        </form>
    </div>
  )
}
