import React, { useState } from 'react';
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import Login from './login';
import axios from 'axios';


function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!username || !password || !email || !phone) {
            alert("All fields necessary");
            return;
        }

    try {
        const response = await axios.post('http://localhost:3001/register', {
        username,
        password,
        email,
        phone
        });
        alert("User registered Successfully!");
    }

    catch (err) {
        alert("An error Occured");
        console.log(err);
    }
}

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1em', margin:'0 auto', height: '10em', width: '10em'}}>
            <form onSubmit={handleRegister}>
            <input type = "text" placeholder='USERNAME' onChange={(e) => setUsername(e.target.value)}/>
            <input type = "password" placeholder='PASSWORD' onChange={(e) => setPassword(e.target.value)}/>
            <input type = "email" placeholder='EMAIL ID' onChange={(e) => setEmail(e.target.value)}/>
            <input type = "number" placeholder='PHONE NO.' onChange={(e) => setPhone(e.target.value)}/>
            {/* <select>
                <option>Role</option>
            </select> */}
            <button type = 'Submit'>Register</button>
            </form>
        </div>
    )
}

export default Register
