// // App.jsx

import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Home from './components/home/Home';
import Income from './components/income/Income';
import Expense from './components/expense/Expense';
import Budget from './components/budget/Budget';
import Reports from './components/reports/Reports';
import SideBar from './components/sidebar/SideBar';
import AdminLogin from './components/admin_login/AdminLogin';
import AdminRegister from './components/admin_register/AdminRegister';
import AdminDashboard from './components/admin_dashboard/AdminDashboard';
import { DataProvider } from './context/DataContext';
import Saving from './components/saving/Saving';
import Settings from './components/settings/Settings';

const App = () => {
  const [toggle, setToggle] = useState(false);
  

  return (
    <>
      <div>
        <DataProvider>
          <Routes>
            <Route path='/' element={<Login  />} />
            <Route path='/sign' element={<Register />} />
            <Route path='/home' element={<Home  />} />
            <Route path='/budget' element={<Budget />} />
            <Route path='/income' element={<Income />} />
            <Route path='/expenses' element={<Expense />} />
            <Route path='/saving' element={<Saving />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/settings' element={<Settings />} />
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
