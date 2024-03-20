import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });

      alert("Login successful");
      navigate('/feeds'); // Navigate to the Feeds component
    } catch (err) {
      alert("Error Logging");
      console.log(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', margin: '0 auto', height: '10em', width: '10em' }}>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder='USERNAME' onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder='PASSWORD' onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" name="Submit">LOGIN</button>
      </form>
    </div>
  );
}

export default Login;