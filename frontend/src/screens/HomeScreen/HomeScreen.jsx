import React,{useState,useEffect, useReducer} from 'react'
import Product from '../../components/Product/Product';
import Loading from '../../components/Loading/Loading';
import MessageBox from '../../components/MessageBox/MessageBox';
const reducer=(state,action)=>{
  switch(action.type){
    case 'FETCH_REQUEST':
      return {...state,loading:true};
    case 'FETCH_SUCCESS':
      return {...state,loading:false,products:action.payload};
    case 'FETCH_FAIL':
      return {...state,loading:false,error:action.payload};
    default:
      return state;
  }
}
export default function Home() {
  // const [data,setData]=useState([]);
  //now we will manage state of homeScreen using useReducer.
  const [{loading,error,products},dispatch]=useReducer(reducer,{loading:true,error:'',products:[]});
  const fetchData=async()=>{
    dispatch({type:'FETCH_REQUEST'});
    try{
      const response=await fetch("https://amazona-sepia-three.vercel.app/api/products");
      const products=await response.json();
      dispatch({type:'FETCH_SUCCESS',payload:products});
    }
    catch(e){
      dispatch({type:'FETCH_FAIL',payload:e.message});
      console.log(e);
      throw new Error(e);
    }
  }
  useEffect(()=>{
    fetchData();
  },[])
  return (
    <div>
      <main>
        <div className='body-content'>
          <h1>Featured Products</h1>
          <div className='product-container'>
            {
              loading ? <Loading/>: error ? <div>error</div> :
              products && products.map((product) => {
                return <div className='product'><Product key={product.slug} data={product} /></div>;
              })
            }
          </div>
        </div>
      </main>
      <footer>
        <div className='body-content'>
            <div>All rights reserved</div>
        </div>
      </footer>
    </div>
  )
}
