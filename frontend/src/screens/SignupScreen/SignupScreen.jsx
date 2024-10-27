import React,{useContext, useState} from 'react'
import './SignupScreen.css'
import { Link, useNavigate } from 'react-router-dom'
import { Store } from '../../Store'
export default function SignupScreen() {
    const [credentials,setCredentials]=useState({fullname:'',username:'',password:'',conformPassword:''})
    const {dispatch:ctxDispatch}=useContext(Store);
    const navigate=useNavigate();
    function onChangeInput(e){
        setCredentials({...credentials,[e.target.name]:e.target.value});
    }
    async function submitHandler(e){
        e.preventDefault();
        const {password,conformPassword}=credentials;
        if(password!==conformPassword){
            alert("Password and conform Password doesn't match");
            return ;
        }
        const response=await fetch('/api/Users/signup',{
            method:'POST',
            headers:{
                'content-type':'application/json',
            },
            body:JSON.stringify({...credentials})
        })
        if(response.status!==200){
            const msg=await response.json();
            console.log(msg);
            alert(msg.message);
            return;
        }
        const user=await response.json();
        ctxDispatch({type:'USER_SIGNIN',payload:user})
        localStorage.setItem('userInfo',JSON.stringify(user));
        navigate('/');
    }
  return (
    <div>
       <form className='signup' onSubmit={submitHandler}>
        <div>
            <h1>Sign up</h1>
        </div>
        <div>
            <label>Name</label>
            <input type="text" name="fullname" value={credentials.fullname} onChange={onChangeInput}/>
        </div>
        <div>
            <label>Username</label>
            <input type="text" name="username" value={credentials.username} onChange={onChangeInput}/>
        </div>
        <div>
            <label>Password</label>
            <input type="password" name="password" value={credentials.password} onChange={onChangeInput}/>
        </div>
        <div>
            <label>Conform Password</label>
            <input type="password" name="conformPassword" value={credentials.conformPassword} onChange={onChangeInput}/>
        </div>
        <div>
            <button type='submit'>Signup</button>
        </div>
        <div>
            <h3>Already have an account</h3>
            <Link to='/signin'>Sign-in</Link>
        </div>
    </form> 
    </div>
    
  )
}
