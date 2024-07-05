import React from 'react'
import SideBar from '../sidebar/SideBar';
import ReportChart from '../home/ReportChart';

const Reports = () => {
  return (
    <>
      <div className="containre">

        <div className="sidebar">
          <SideBar/>
        </div>
        <div className="content_container">
          <center><h1>Reports</h1></center>
        </div>
        <div></div>
      </div>
    </>
  )
}

export default Reports