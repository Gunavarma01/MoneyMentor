import React from 'react'
import SideBar from '../sidebar/SideBar';
import ExpenseReport from '../expense/ExpenseReport';

const Settings = () => {

    
    return (
        <>
            <div className="containre">

                <div className="sidebar">
                    <SideBar />
                </div>
                <div className="content_container">
                    <center><h1>Settings</h1></center>
                    {/* <ExpenseReport/> */}
                </div>
                <div></div>
            </div>
        </>
    )
}

export default Settings

