// components/auth.js
import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status
  const [loggedInUsername, setLoggedInUsername] = useState(''); // New state to store the username

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const body = JSON.stringify({ username, password });
      const response = await axiosInstance.post(url, body, config);
      // If login is successful, save the token in localStorage
      if (response.data && isLogin) {
        localStorage.setItem('token', response.data);
        setIsLoggedIn(true); // Set login status to true
        setLoggedInUsername(username); // Save the logged-in username
      }
      // Handle successful registration or login here
    } catch (error) {
      console.error(error.response.data);
      // Handle errors here
    }
  };
  if (isLoggedIn) {
    return (
      <div>
        <h2>Welcome, {loggedInUsername}!</h2>
        {/* You can add a logout button or other user-related functionalities here */}
      </div>
    );
  }
  else {
    return (
      <div>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={onSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)}>
          Switch to {isLogin ? 'Register' : 'Login'}
        </button>
        {/* Add Social Login Buttons Here */}
      </div>
    );
  }
};

export default Auth;
