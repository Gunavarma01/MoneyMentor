import React, { useState } from 'react';
import './register.css';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import loginimg from '../assert/login.jpg';
import mmlog from '../assert/mmlogo.jpeg'

function Register() {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement) => {
    api.success({
      message: (
        <div style={{ color: 'black' }}>
          Register successful
        </div>
      ),
      description: (
        <div style={{ color: 'black' }}>
          Congratulations, your account has been successfully registered
        </div>
      ),
      placement,
      duration: 1.5,
      onClose: () => {
        page('/');
      },
      style: {
        background: "white",
        borderRadius: '10px',
      },
    });
  };

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [cpasswordError, setCPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInputs()) {
      
      const userDetails = {
        username,
        email,
        password
      };

      const existingUsers = JSON.parse(localStorage.getItem('userDetails')) || [];
      existingUsers.push(userDetails);
      localStorage.setItem('userDetails', JSON.stringify(existingUsers));

      openNotification('bottomLeft');
      console.log('Form submitted successfully');
    }
  };

  const validateInputs = () => {
    let success = true;

    if (username.trim() === '') {
      success = false;
      setUsernameError('Username is required');
    } else if (username.length < 4) {
      success = false;
      setUsernameError('Username must be at least 4 characters long');
    }
    else {
      setUsernameError('');
    }

    if (email.trim() === '') {
      success = false;
      setEmailError('Email is required');
    } else if (!validateEmail(email)) {
      success = false;
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }

    if (password === '') {
      success = false;
      setPasswordError('Password is required');
    } else if (password.length < 8) {
      success = false;
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }

    if (cpassword === '') {
      success = false;
      setCPasswordError('Confirm password is required');
    } else if (cpassword !== password) {
      success = false;
      setCPasswordError('Password does not match');
    } else {
      setCPasswordError('');
    }

    return success;
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const page = useNavigate();

  return (
    <div className="login">
      <div className='r'>
        <div className="registerimg">
          <img className="rimg" src={loginimg} alt="login" />
        </div>
      </div>

      <div className="registerncontainer">
        <div style={{ backgroundColor: "limegreen" }}>
          {contextHolder}
        </div>
        <form onSubmit={handleSubmit} className='form'>
          <div>
            <img className='mmlogo' src={mmlog} alt='mmlogo' />
          </div>
          <div>
            <span style={{ fontFamily: 'cursive', fontSize: "12px", fontWeight: "555", color: 'gray' }}>Welcome To Our Website &#x1F44B; </span>
            <p style={{ fontFamily: 'cursive', fontSize: "11px", fontWeight: "555", color: 'gray' }}>Enter your details below to create your account and get started.</p>
          </div>
          <div className={`input-group ${usernameError && 'error'}`}>
            <input
              placeholder='Enter Username'
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="error">{usernameError}</div>
          </div>
          <div className={`input-group ${emailError && 'error'}`}>
            <input
              placeholder='Enter Email'
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="error">{emailError}</div>
          </div>
          <div className={`input-group ${passwordError && 'error'}`}>
            <input
              placeholder='Enter Password'
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="error">{passwordError}</div>
          </div>
          <div className={`input-group lasti ${cpasswordError && 'error'}`}>
            <input
              placeholder='Enter Confirm Password'
              type="password"
              id="cpassword"
              name="cpassword"
              value={cpassword}
              onChange={(e) => setCPassword(e.target.value)}
            />
            <div className="error">{cpasswordError}</div>
          </div>
          <button type="submit" className='sign_btn'>SIGN UP</button>
          <p style={{ textAlign: "center", fontFamily: 'cursive', marginTop: "10px" }}>Already have an account? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => { page('/') }}>Sign In</span></p>
        </form>
      </div>
    </div>
  );
}

export default Register;
