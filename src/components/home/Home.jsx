import React, { useContext, useState } from 'react';
import SideBar from '../sidebar/SideBar';
import './home.css'
import DataContext from '../../context/DataContext';
import ReportChart from './ReportChart';
import { Modal } from 'antd';

const Dashboard = () => {
  const { loginUserName } = useContext(DataContext);
  const [transactions, setTransactions] = useState(JSON.parse(localStorage.getItem('transactions')) || []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateTotal = (type) => {

    const filteredTransactions = transactions.filter(i => i.type === type);

    const totalAmount = filteredTransactions.reduce((total, transaction) => {
      return total + parseFloat(transaction.amount);
    }, 0);

    return totalAmount.toFixed(2);
  };

  const income = calculateTotal("income")
  const expense = calculateTotal("expense")
  const balance = income - expense



  return (
    <>
      <div className="containre">

        <div className="sidebar">
          <SideBar />
        </div>

        <div className="dashboard">

          <header className="header">
            <h1 className='username' >Welcome {loginUserName}</h1>
            <button className="income-report" onClick={() => { setIsModalOpen(true); }}>Report</button>
          </header>

          <div className="balances">

            <div className="balance total">
              <h2>Total balance</h2>
              <p className="amount">₹ {isNaN(balance) ? "00.00" : balance.toFixed(2)}</p>
            </div>

            <div className="balance budgets">
              <h2>Monthly Budget</h2>
              <p className="amount"> ₹ 00.00 </p>
            </div>




          </div>
          <div className="main-content">

            <div className="balance income">
              <h2>Income</h2>
              <p className="amount">₹ {isNaN(income) ? "00.00" : income}</p>

            </div>

            <div className="balance expance">
              <h2>Expenses</h2>
              <p className="amount">₹ {isNaN(expense) ? "00.00" : expense}</p>

            </div>

          </div>

          <div className="transaction-table">
            <h2>Transaction History</h2>
            <div className="table_body">
              <table className='table' >
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={index} className={transaction.type}>
                        <td>{index + 1}</td>
                        <td>{transaction.category.toUpperCase()}</td>   
                        <td>{transaction.description.toUpperCase()}</td>   
                        <td>₹{parseFloat(transaction.amount).toFixed(2)}</td>
                        <td className="date">{transaction.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">
                        <h2>No Data To Display</h2>
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </div>

        </div>
        <div></div>
      </div>
      <Modal
        title="Report"
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); }}
        footer={null}
      >
        <ReportChart setIsModalOpen = {setIsModalOpen} />
      </Modal>
    </>
  );
};

export default Dashboard;
