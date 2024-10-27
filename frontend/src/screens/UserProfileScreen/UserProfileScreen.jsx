import React, { useContext,useState } from 'react'
import './UserProfileScreen.css'
import { Store } from '../../Store';
import { useNavigate } from 'react-router-dom';
export default function UserProfileScreen() {
    const navigate = useNavigate();
    const { state} = useContext(Store);
    const { userInfo } = state;
    const [credentials, setCredentials] = useState({ fullname: '', username: userInfo.username, password: '', confirmPassword: '' });
    function handleOnchange(e) {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    async function handleSubmit(e) {
        e.preventDefault();
        if (credentials.password !== credentials.confirmPassword) {
            alert('Password and confirm password does not match');
            return;
        }
        const response = await fetch('/api/Users', { method: 'PUT', headers: {
            'Content-Type': 'application/json' // Set the content type header
        }, body: JSON.stringify(credentials) });
        const data = await response.json();
        if (response.status !== 400) {
            if (data) {
                alert('updated data successfully');
                navigate('/');
            }
        }
        else {
            alert(data.message);
        }
    }
    return (
        <div>
            <h1>User Profile</h1>
            <form onSubmit={handleSubmit}>
                <label>Name</label><br></br>
                <input type='text' name='fullname' value={credentials.fullname} onChange={handleOnchange}></input><br />
                <label>Username</label><br></br>
                <input type='text' name='username' value={credentials.username} onChange={handleOnchange}></input><br />
                <label>Password</label><br></br>
                <input type='password' name='password' value={credentials.password} onChange={handleOnchange}></input><br></br>
                <label>Confirm Password</label><br></br>
                <input type='password' name='confirmPassword' value={credentials.confirmPassword} onChange={handleOnchange}></input><br></br>
                <button type='submit'>Update</button>
            </form>
        </div>
    )
}
