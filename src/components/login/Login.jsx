import React, { useState } from 'react';
import { Input, Button, Modal, Form } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import "./login.css";
import loginimg from '../assert/login.jpg';
import mmlog from '../assert/mmlogo.jpeg';
import { IoWarning } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginUserName, setLoginUserName] = useState('');
  const [loginUserPass, setLoginUserPass] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username: loginUserName,
        password: loginUserPass
      });

      if (response.status === 200) {
        localStorage.setItem('userId', response.data.id);
        console.log(response);
        navigate("/home");
      }
    } catch (error) {
      form.resetFields();
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="login">
        <div>
          <div className="loginimg">
            <img className="limg" src={loginimg} alt="login" />
          </div>
        </div>
        <div className="logincontainer">
          <div>
            <img className='mmlogo' src={mmlog} alt="mmlogo" />
          </div>
          <div>
            <span style={{ fontFamily: 'cursive', fontSize: "12px", fontWeight: "555", color: 'gray' }}>Welcome Back &#x1F44B;</span>
            <p style={{ fontFamily: 'cursive', fontSize: "12px", fontWeight: "555", color: 'gray', marginBottom: '10px' }}>Login to your account below</p>
          </div>
          <Form form={form} onFinish={onSubmit}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please enter your username!' }]}
            >
              <Input
                className="inputname"
                placeholder="Enter username"
                value={loginUserName}
                onChange={(e) => setLoginUserName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password
                className="inputpass"
                placeholder="Enter password"
                value={loginUserPass}
                onChange={(e) => setLoginUserPass(e.target.value)}
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <div className="loginbtns">
              <Button htmlType="submit" className="loginbtn" type="primary">
                Login
              </Button>
              <br />
              <br />
              <p>Don't have an account? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => window.location.href = '/sign'}>Sign Up</span></p>
            </div>
          </Form>
        </div>
      </div>
      <Modal title="" open={isModalOpen} footer={null} onCancel={() => { setIsModalOpen(false) }}>
        <div className='modal_content'>
          <IoWarning style={{ width: "70px", color: "red", height: "60px" }} />
          <h4>Incorrect Username or Password</h4>
          <p>The Username or Password you entered is incorrect. Please try again.</p>
        </div>
      </Modal>
    </>
  );
};

export default Login;
