import React, { useContext, useState } from 'react'
import './Navbar.css'
import { Badge } from '@fluentui/react-badge';
import { Link, useNavigate } from 'react-router-dom'
import { Store } from '../../Store';
import SearchBox from '../SearchBox/SearchBox';
export default function Navbar() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [adminDrop,setAdminDrop]=useState('dashboard');
  const navigate=useNavigate();
  function handleOnchange(event) {
    if (event.target.value === 'signout') {
      ctxDispatch({ type: 'USER_SIGNOUT' });
      localStorage.removeItem('userInfo');
      localStorage.removeItem('shippingAddress')
      window.location.href = '/signin';
    }
    else if(event.target.value==='orderHistory'){
      navigate('/orderhistory');
    }
    else if(event.target.value=='userProfile'){
      navigate('/userprofile');
    }
  }
  function handleAdminDropdown(e){
    setAdminDrop(e.target.value);
    navigate(`/${adminDrop}`);
  }
  return (
    <div>
      <Link className='nav-brand' to="/">Amazona</Link>
      <ul>
        <li><Link to="/cart"></Link>
          {cart.cartItems.reduce((a, c) => a + c.quantity, 0) && <Badge>{cart.cartItems.reduce((a, c) => a + c.quantity, 0)}</Badge>}
        </li>
        {userInfo ? <select onChange={handleOnchange}>
          <option disabled selected>{`Hello ${userInfo.username}`}</option>
          <option value={'userProfile'}>User Profile</option>
          <option value={'orderHistory'}>Order history</option>
          <option value={'signout'}>Sign out</option>
        </select> : <Link to={'/signin'}>Signin</Link>}
        {userInfo && userInfo.isAdmin && (
          <select value={adminDrop} onChange={handleAdminDropdown}>
            <option value="admin/dashboard">Dashboard</option>
            <option value="admin/productlist">Products</option>
            <option value="admin/orderlist">Orders</option>
            <option value="admin/userlist">Users</option>
          </select>
        )}
      </ul>
      <ul>
        <SearchBox/>
      </ul>
    </div>
  )
}
