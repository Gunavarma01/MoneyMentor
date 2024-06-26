// // // Login.jsx

import React, { useContext, useState } from 'react';
import { Input, Button, Modal, Form } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import "../login/login.css";
import loginimg from '../assert/login.jpg';
import mmlog from '../assert/mmlogo.jpeg';
import { IoWarning } from "react-icons/io5";
import DataContext from '../../context/DataContext';

const Login = ({ page }) => {
  const { loginUserName, setLoginUserName, loginUserPass, setLoginUserPass } = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const onSubmit = (values) => {
    if (values.username === loginUserName && values.password === '123') {
      page("/home");
    } else {
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
              </Button> <br /> <br />
              <p>Don't have an account? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => page('/sign')}>Sign Up</span></p>
            </div>
          </Form>
        </div>
      </div>
      <Modal title="" open={isModalOpen} footer={null} onCancel={() => {setIsModalOpen(false)}}>
        <div className='modal_content'>
          <IoWarning style={{ width: "70px", color: "red", height: "60px" }} />
          <h4>Incorrect Password</h4>
          <p>The Password you entered is incorrect. Please try again.</p>
        </div>
      </Modal>
    </>
  );
};

export default Login;
