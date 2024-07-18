import React from 'react'
import SideBar from '../sidebar/SideBar';
import ReportChart from '../home/ReportChart';
import './reports.css'


const Reports = () => {
  return (
    <>
      <div className="reports">
        <div className="sidebar">
          <SideBar />
        </div>

        <div  className="reports_content_container">
          <h1>Reports</h1>
          <div className='re_chart'>
            <ReportChart />
          </div>
        </div>
      </div>
    </>
  )
}

export default Reports
