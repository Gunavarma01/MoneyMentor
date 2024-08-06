import React, { useEffect, useState } from 'react';
import SideBar from '../sidebar/SideBar';
import './home.css';
import axios from 'axios';
import ReportChart from './ReportChart';
import { Modal } from 'antd';

const Dashboard = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [username, setUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      console.log('Retrieved userId:', userId);

      if (isNaN(userId)) {
        console.error('Invalid user ID:', userId);
        return;
      }
      try {
        const userId = localStorage.getItem('userId');
        console.log(userId)
        // Fetch income data
        const incomeResponse = await axios.get(`http://localhost:5000/api/income/${userId}`);
        setIncomeData(incomeResponse.data);

        // Fetch expense data
        const expenseResponse = await axios.get(`http://localhost:5000/api/expense/${userId}`);
        setExpenseData(expenseResponse.data);

        // Fetch budget data
        const response = await axios.get(`http://localhost:5000/api/budget/${userId}`);
        setBudgetData(response.data);

        // Fetch user data by ID
        if (userId) {
          const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`);
          const userData = userResponse.data;
          console.log(userData, 'usersss')
          
          setTimeout(() => {
            setUsername(userData.username);
            
            setLoading(false);
          }, 1000);

        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);

      }
    };

    fetchData();
  }, []);


  const calculateTotal = (data) => {
    const totalAmount = data.reduce((total, transaction) => {
      return total + parseFloat(transaction.amount);
    }, 0);
    return totalAmount.toFixed(2);
  };

  const calculabudget = (data) => {
    const totalbudget = data.reduce((total, budget) => {
      return total + parseFloat(budget.amount);
    }, 0);
    return totalbudget.toFixed(2);
  };

  const income = parseFloat(calculateTotal(incomeData));
  const expense = parseFloat(calculateTotal(expenseData));
  const balance = income - expense;

  const totalbudget = parseFloat(calculabudget(budgetData))

  const combinedTransactions = [
    ...[...incomeData].reverse().map(item => ({ ...item, type: 'income' })),
    ...[...expenseData].reverse().map(item => ({ ...item, type: 'expense' }))
  ];

  return (
    <>
      <div className="container">
        <div className="sidebar">
          <SideBar />
        </div>

        <div className="dashboard">
          <header className="header">
            <h1 className='username'>Welcome {username}</h1>
            <button className="income-report" onClick={() => { setIsModalOpen(true); }}>Report</button>
          </header>

          <div className="balances">
            <div className="balance total">
              <h2>Total Balance</h2>
              <p className="amount">₹ {isNaN(balance) ? "00.00" : balance.toFixed(2)}</p>
            </div>

            <div className="balance budgets">
              <h2>Monthly Budget</h2>
              <p className="amount">₹ {isNaN(totalbudget) ? "00.00" : totalbudget.toFixed(2)}</p>
            </div>
          </div>

          <div className="main-content">
            <div className="balance incomeh">
              <h2>Total Income</h2>
              <p className="amount">₹ {isNaN(income) ? "00.00" : income.toFixed(2)}</p>
            </div>

            <div className="balance expance">
              <h2>Total Expenses</h2>
              <p className="amount">₹ {isNaN(expense) ? "00.00" : expense.toFixed(2)}</p>
            </div>
          </div>

          <div className="transaction-table">
            <h2>Transaction History</h2>
            <div className="table_body">
              <table className='table'>
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
                  {loading ? (
                    <div className="holoading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading...</p>
                    </div>
                  ) :
                    combinedTransactions.length > 0 ? (
                      combinedTransactions.map((transaction, index) => (
                        <tr key={transaction.id} className={transaction.type}>
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
      </div>
      {/* <Modal
        title="Report"
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); }}
        footer={null}
      >
        <ReportChart setIsModalOpen={setIsModalOpen} />
      </Modal> */}
      <Modal
        title="Report"
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); }}
        footer={null}
      >
        <ReportChart incomeData={incomeData} expenseData={expenseData} />
      </Modal>
    </>
  );
};

export default Dashboard;
