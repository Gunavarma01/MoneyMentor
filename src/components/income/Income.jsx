import React, { useState } from 'react';
import SideBar from '../sidebar/SideBar';
import { useNavigate } from 'react-router-dom';
import './income.css'
import { Modal } from 'antd';
import IncomeReport from './IncomeReport';
const Income = () => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      type: 'income',
      category,
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
    return filteredTransactions
  };


  const initialExpenses = calculateTotal("income")
  const [income, setIncome] = useState(initialExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);


  const handleDelete = (id) => {
    setIncome(income.filter(i => i.id !== id));
  };

  return (
    <>
      <div className="container">
        <div className="sidebar">
          <SideBar />
        </div>

        <div className="income_con">
          <div className="income_container">

            <Modal
              title="Add Income"
              open={isModalOpen}
              onCancel={() => { setIsModalOpen(false) }}
              footer={null}
            >
              <div className="modal">
                <form className="form" onSubmit={handleSubmit}>
                  <div className='income_form_div_category'>
                    <label className="label">Category:</label>
                    <input
                      type="text"
                      className="input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                  </div>
                  <div className='income_form_div'>
                    <label className="label">Description:</label>
                    <input
                      type="text"
                      className="input"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="label amount">Amount:</label>
                    <input
                      type="number"
                      className="input"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="add_button">Add Income</button>
                </form>
              </div>
            </Modal>

            <h1>Personal Income Manager</h1>
            <div className="controlers">
              <div className="buttons">
                <button className="add-income" onClick={() => { setIsModalOpen(true); }} >Add Income</button>
                <button className="income-report" onClick={() => { setIsModalOpen2(true); }}  >Income Report</button>
              </div>
              <div className="searchdiv">
                <input type="text" placeholder="Search" className="search-input" />
                <button className="filter-button">Filter</button>
              </div>
            </div>
            <div className="income_table_div">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>IncomeDate</th>
                    <th>Action Item</th>
                  </tr>
                </thead>
                <tbody>
                  {income.length > 0 ? income.map((i, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className='income_des' >{i.category.toUpperCase()}</td>
                      <td className='income_des' >{i.description.toUpperCase()}</td>
                      <td className='income_amt'>₹{parseFloat(i.amount).toFixed(2)}</td>
                      <td>{i.date}</td>
                      <td>
                        <button className="edit-button">Edit</button>
                        <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6">
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
      <Modal
        title="Income Report"
        open={isModalOpen2}
        onCancel={() => { setIsModalOpen2(false); }}
        footer={null}
      >
        <IncomeReport setIsModalOpen2={setIsModalOpen2} setIsModalOpen={setIsModalOpen} />
      </Modal>
    </>
  );
};

export default Income;
