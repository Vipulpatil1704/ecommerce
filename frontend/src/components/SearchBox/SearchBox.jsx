import React,{useState} from 'react'
import './SearchBox.css'
import { useNavigate } from 'react-router-dom';
export default function SearchBox() {
    const [query,setQuery]=useState('');
    const navigate=useNavigate();
    function submitHandler(e){
        e.preventDefault();
        navigate(query ? `/search/?query=${query}`:'/search');
    }
  return (
    <div>
        <form onSubmit={submitHandler}>
            <input name='query' value={query} onChange={(e)=>setQuery(e.target.value)}/>
            <button type='submit'>Search</button>        
        </form>
    </div>
  )
}
