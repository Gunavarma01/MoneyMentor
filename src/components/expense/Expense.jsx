import React, { useState } from 'react';
import SideBar from '../sidebar/SideBar';
import { useNavigate } from 'react-router-dom';
import './expense.css';
import { Modal } from 'antd';

const Expense = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      type: 'expense',
      description,
      amount,
      date: new Date().toLocaleString()
    };

    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    navigate('/home');
  };

  const calculateTotal = (type) => {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const filteredTransactions = transactions.filter(i => i.type === type);
    return filteredTransactions;
  };

  const initialExpenses = calculateTotal("expense");

  const [expenses, setExpenses] = useState(initialExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDelete = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <>
      <div className="container">
        <div className="sidebar">
          <SideBar />
        </div>

        <div className="expense_con">
          <div className="expense_container">

            <Modal
              title="Add Expense"
              open={isModalOpen}
              onCancel={() => { setIsModalOpen(false); }}
              footer={null}
            >
              <div className="modal">
                <form className="form" onSubmit={handleSubmit}>
                  <div className='expense_form_div'>
                    <label className="label">Description:</label>
                    <input
                      type="text"
                      className="input"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="label amount">Amount:</label>
                    <input
                      type="number"
                      className="input"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="add_button">Add Expense</button>
                </form>
              </div>
            </Modal>

            <h1>Personal Expense Manager</h1>
            <div className="controlers">
              <div className="buttons">
                <button className="add-expense" onClick={() => { setIsModalOpen(true); }}>Add Expense</button>
                <button className="expense-report">Expense Report</button>
              </div>
              <div className="searchdiv">
                <input type="text" placeholder="Search" className="search-input" />
                <button className="filter-button">Filter</button>
              </div>
            </div>
            <div className="expenses_table_div">
              <table className='expenses_table'>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>ExpenseDate</th>
                    <th>Action Item</th>
                  </tr>
                </thead>
                <tbody className='expenses_tbody' >
                  {expenses.length > 0 ? expenses.map((i, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className='expenses_des' >{i.description.toUpperCase()}</td>
                      <td className='expenses_amt'>₹{parseFloat(i.amount).toFixed(2)}</td>
                      <td>{i.date}</td>
                      <td>
                        <button className="edit-button">Edit</button>
                        <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
                      </td>
                    </tr>
                  )) : (
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
    </>
  );
};

export default Expense;
