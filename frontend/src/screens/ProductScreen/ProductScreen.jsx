import React, { useContext, useEffect, useReducer } from 'react'
import './ProductScreen.css'
import { useNavigate, useParams } from 'react-router-dom'
import Rating from '../../components/Rating/Rating'
import Loading from '../../components/Loading/Loading'
import MessageBox from '../../components/MessageBox/MessageBox'
import { Store } from '../../Store'
import { getError } from '../../Utils'
const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, product: action.payload };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}
export default function ProductScreen() {
    const navigate=useNavigate();
    const [{ loading, error, product }, dispatch] = useReducer(reducer, { loading: true, error: '', product: [] });
    const params = useParams();
    const { slug } = params;
    const fetchData = async () => {
        dispatch({ type: 'FETCH_REQUEST' });
        try {
            const response = await fetch(`/api/products/slug/${slug}`);
            const product = await response.json();
            if(response.status!==404)
                dispatch({ type: 'FETCH_SUCCESS', payload: product });
            else
                dispatch({ type: 'FETCH_FAIL', payload:product.message });
        }
        catch (e) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(e) });
            console.log(e);
            throw new Error(e);
        }
    }
    useEffect(() => {
        fetchData();
    }, [slug])
    const {state,dispatch:ctxDispatch}=useContext(Store);
    const {cart}=state;
    useEffect(()=>{
        console.log(state)
    },[state])
    async function addToCartHandler(){
        //make sure that quantity of item should be avaiable in stock in data
        const existItem=cart.cartItems.find((x)=>x._id===product._id);
        const quantity=existItem ? existItem.quantity +1 :1;
        const data =await fetch(`/api/products/${product._id}`);
        if(data.countInStock<quantity){
            window.alert('sorry,Product is out of stock');
            return;
        }
        ctxDispatch({type:'CART_ADD_ITEM',payload:{...product,quantity}});
        navigate("/cart");
    }

    return (
        <div>
            {loading ? <Loading/> : error ? <MessageBox>{error}</MessageBox>:<div className='product-details'>
                <div>
                    <img src={`${product.image}`}></img>
                </div>
                <div>
                    <h1>{product.name}</h1>
                    <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                    <h4>Price:{product.price}</h4>
                    <h4>Description:{product.description}</h4>
                </div>
                <div>
                    <h4>Price:{product.price}</h4>
                    <h4>Status:</h4>
                    {product.countInStock>0 ? <div>
                        <h5>In Stock</h5>
                        <button onClick={addToCartHandler}>Add to cart</button>
                        </div>:<h5>Not Available</h5>}
                </div>
            </div>}
        </div>
    )
}
