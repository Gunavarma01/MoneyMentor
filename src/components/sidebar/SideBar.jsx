import React, { useContext, useState } from 'react';
import {
  FaTh,
  FaBars,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";
import { GrMoney } from "react-icons/gr";
import { MdOutlineSavings } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import mmlog from '../assert/mmlogo.jpeg';
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import './sidebar.css'
import DataContext from '../../context/DataContext';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const { loginUserName, page } = useContext(DataContext);
  const menuItem = [
    {
      path: "/home",
      name: "Dashboard",
      icon: <FaTh />
    },
    {
      path: "/income",
      name: "Income",
      icon: <FaMoneyCheckAlt />
    },
    
    {
      path: "/expenses",
      name: "Expenses",
      icon: <GrMoney />
    },
    {
      path: "/budget",
      name: "Budget",
      icon: <FcMoneyTransfer />
    },
    {
      path: "/saving",
      name: "Saving",
      icon: <MdOutlineSavings />
    },
    {
      path: "/reports",
      name: "Reports",
      icon: <TbReportAnalytics />
    }
    ,
    {
      path: "/settings",
      name: "Settings",
      icon: <IoSettings />
    }
  ]
  return (
    <div className="container">
      <div className="sidebar">
        <div className="top_section">
          <div className='logo_name' >
            <img className="logo" src={mmlog} alt={mmlog} />
            <div className='title' >
              <span className='money'>Money</span ><span className='mentor'>Mentor</span>
            </div>
          </div>

        </div>
        <div className='navlinks' >
          {
            menuItem.map((item, index) => (
              <NavLink to={item.path} key={index} className="link" activeclassName="active">
                <div className="icon">{item.icon}</div>
                <div className="link_text">{item.name}</div>
              </NavLink>
            ))
          }
        </div>
        {/* <div className='logout' onClick={()=>{page('/')}} > */}
        <div className='logout' onClick={() => { page('/'); }}>
          <BiLogOut className='outlogo' ></BiLogOut>
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;