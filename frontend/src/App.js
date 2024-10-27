import {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import ProductScreen from './screens/ProductScreen/ProductScreen';
import Navbar from './components/Navbar/Navbar';
import CartScreen from './screens/CartScreen/CartScreen';
import SigninScreen from './screens/SigninScreen/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen/SignupScreen';
import PaymentScreen from './screens/PaymentScreen/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen/OrderHistoryScreen';
import UserProfileScreen from './screens/UserProfileScreen/UserProfileScreen';
import SearchScreen from './screens/SearchScreen/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminRoute from './components/AdminRoute/AdminRoute';
import DashboardScreen from './screens/DashboardScreen/DashboardScreen';
function App() {
  const [isSidebarOpen,setSidebarOpen]=useState(false);
  const [categories,setCategories]=useState([]);
  function handleSideBar(){
    //toggle
    setSidebarOpen(!isSidebarOpen);
  }
  useEffect(()=>{
    const fetchCategories=async ()=>{
      try{
        const response=await fetch('/api/products/categories');
        const data=await response.json();
        setCategories(data);
      }
      catch(e){
        alert(e);
      }
    }
    fetchCategories();
  },[categories])
  return (
    <div  className={isSidebarOpen ? 'body-content sideview':'body-content'}>
       <BrowserRouter>
      <header>
        <div>
          <button onClick={handleSideBar}>OpenSideBar</button>
          <div className={isSidebarOpen ? 'sidebar active':'sidebar'}>
            <h1>Categories</h1>
            {categories.length ?<ul className='sidebar-list'>{categories.map((category)=><Link to={`/search?category=${category}`}>{category}</Link>)}</ul> :null}   
          </div>
          <Navbar />
        </div>
      </header>
      <Routes>
        <Route path="/" element={<HomeScreen />}></Route>
        <Route path="/product/:slug" element={<ProductScreen />}></Route>
        <Route path="/signin" element={<SigninScreen/>}></Route>
        <Route path='/signup' element={<SignupScreen/>}></Route>
        <Route path='/cart' element={<CartScreen/>}></Route>
        <Route path='/shipping' element={<ShippingAddressScreen/>}></Route>
        <Route path='/payment' element={<PaymentScreen/>}></Route>
        <Route path='/placeorder' element={<PlaceOrderScreen/>}></Route>
        <Route path='/orders/:id' element={<ProtectedRoute><OrderScreen/></ProtectedRoute>}></Route>
        <Route path='/orderhistory' element={<ProtectedRoute><OrderHistoryScreen/></ProtectedRoute>}></Route>
        <Route path='/userprofile' element={<ProtectedRoute><UserProfileScreen/></ProtectedRoute>}></Route>
        <Route path='/search' element={<SearchScreen/>}></Route>
        {/* Admin Routes */}
        <Route path='/admin/dashboard' element={<AdminRoute><DashboardScreen></DashboardScreen></AdminRoute>}></Route>
      </Routes>
    </BrowserRouter>
    </div>
   
  );
}

export default App;
