import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import React, { useState } from 'react';
import axios from 'axios';
import Register from "./components/register";
import Login from "./components/login";
import Feeds from './components/feeds/feeds';

function App() {
  
  return (
    <div className="App">
      
      <BrowserRouter>
        <nav>
          <Link to="/register">Register</Link> <br />
          <Link to="/login">Login</Link>
        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feeds" element={<Feeds />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
