import { createContext, useReducer } from "react";
export const Store = createContext();
const initialState = {
    userInfo:localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')): null,
    cart: {
        cartItems:localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')):[],
        shippingAddress:localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')):null,
        paymentMethod:localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')):null
    },
}
const reducer = (state,action) => {
    switch (action.type) {
        case 'CART_ADD_ITEM':
            //add to cart 
            //add to cart with updated functionality that if item already exist then just increase the quantity not add item.
            const newItem=action.payload;
            const existItem=state.cart.cartItems.find((item)=>item._id===newItem._id);
            const cartItems=existItem ? state.cart.cartItems.map((item)=>item._id===existItem._id ? newItem : item) : [...state.cart.cartItems,newItem];
            localStorage.setItem('cart',JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        case 'CART_REMOVE_ITEM':
            //remove from cart
            const {id}=action.payload;
            const items=state.cart.cartItems.filter((item)=>item._id!=id);
            return {...state,cart:{...state.cart,cartItems:items}}
        case 'CART_CLEAR':
            return {...state,cart:{...state.cart,cartItems:[]}}
        case 'USER_SIGNIN':
            const userInfo=action.payload;
            return {...state,userInfo:userInfo}
        case 'USER_SIGNOUT':
            //From localstorage also we have to remove and from context state also we have to remove userInfo.
            return {...state,userInfo:null}
        case 'SAVE_SHIPPING_ADDRESS':
            return {...state,cart:{...state.cart,shippingAddress:action.payload}}
        case 'SAVE_PAYMENT_METHOD':
            return {...state,cart:{...state.cart,paymentMethod:action.payload}}
        default:
            return state;
    }
}
export default function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}

