// // App.jsx

import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Home from './components/home/Home';
import Income from './components/income/Income';
import Expense from './components/expense/Expense';
import Budget from './components/budget/Budget';
import SideBar from './components/sidebar/SideBar';
import AdminLogin from './components/admin_login/AdminLogin';
import AdminRegister from './components/admin_register/AdminRegister';
import AdminDashboard from './components/admin_dashboard/AdminDashboard';
import { DataProvider } from './context/DataContext';

const App = () => {
  const [toggle, setToggle] = useState(false);
  const page = useNavigate();

  return (
    <>
      <div>
        <DataProvider>
          <Routes>
            <Route path='/' element={<Login page={page} />} />
            <Route path='/sign' element={<Register />} />
            <Route path='/home' element={<Home />} />
            <Route path='/budget' element={<Budget />} />
            <Route path='/income' element={<Income />} />
            <Route path='/expense' element={<Expense />} />
            <Route path='/sidebar' element={<SideBar />} />
            <Route path='/admin_login' element={<AdminLogin />} />
            <Route path='/admin_register' element={<AdminRegister />} />
            <Route path='/admin_dashboard' element={<AdminDashboard />} />
          </Routes>
        </DataProvider>
      </div>
    </>
  );
}

export default App;
