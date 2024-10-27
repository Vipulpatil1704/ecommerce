import React,{useContext, useEffect, useState} from 'react'
import {Link, useNavigate,useLocation} from 'react-router-dom'
import './SigninScreen.css'
import { Store } from '../../Store';
export default function SigninScreen() {
    const navigate=useNavigate();
    const {search}=useLocation();
    const redirectInUrl=new URLSearchParams(search).get('redirect');
    const redirect=redirectInUrl ? redirectInUrl : '/';
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const {state,dispatch}=useContext(Store);
    async function handleSubmit(e){
        e.preventDefault();
        const response=await fetch('https://amazona-puce.vercel.app/api/Users/signin',{
            method:'POST',
            headers:{
                'content-type':'application/json',
                //express server looks for the headers to see what kind of data is coming.
                //it helps server to identify type of data so that it can easily parse it.
                //express.json() is a middleware which converts json string body to json data on a server and attached it to a req.body object.

            },
            body:JSON.stringify({username:username,password:password})
        })
        if(response.status!=401 && response.status!=500){
             const json=await response.json();
             dispatch({type:'USER_SIGNIN',payload:json});
            //  console.log(state);
             localStorage.setItem('userInfo',JSON.stringify(json));
             navigate(redirect);
        }
        else{
            alert("Invalid username or password");
            navigate("/signin");
        }
       

    }
    useEffect(()=>{
        if(state.userInfo){
            navigate(redirect);
        }
    },[state.userInfo,redirect])
  return (
    <div>
        <div className='container'>
            <h1>Sign in</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor='username'>Username</label>
                <input type='text' id='username' required placeholder='enter your username' onChange={(e)=>setUsername(e.target.value)} value={username}></input>
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder='enter password'/>
                <button type='submit'>Submit</button>
                <div>
                    <h4>New Customer</h4>
                    <Link to= {`/signup?redirect={}`}>Create your account</Link>
                </div>
            </form>
        </div>
    </div>
  )
}
