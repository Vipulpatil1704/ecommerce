import React, { useContext, useState } from 'react'
import './PaymentScreen.css'
import { useNavigate } from 'react-router-dom';
import { Store } from '../../Store';
export default function PaymentScreen() {
    const [paymentMethod,setPaymentMethod]=useState('');
    const {dispatch}=useContext(Store);
    const navigate=useNavigate();
    function submitHandler(e){
        e.preventDefault();
        navigate('/placeorder');
        dispatch({type:'SAVE_PAYMENT_METHOD',payload:paymentMethod});
        localStorage.setItem('paymentMethod',JSON.stringify(paymentMethod));
    }
    function handleRadioChange(e){
        setPaymentMethod(e.target.value);
    }
  return (
    <div className='payment'>
        <h1>Payment Method</h1>
        <form onSubmit={submitHandler}>
            <label htmlFor='paypal'>Paypal</label>
            <input id="paypal" type='radio' name='paypal' value='paypal' onChange={handleRadioChange} checked={paymentMethod==='paypal'}></input><br/>
            <label htmlFor='stripe'>Stripe</label>
            <input id='stripe' type='radio' name='stripe' value='stripe' onChange={handleRadioChange} checked={paymentMethod==='stripe'}></input><br/>
            <button type='submit'>Continue</button>
        </form>
    </div>
  )
}
