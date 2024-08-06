import React, { useState, useEffect } from 'react';
import SideBar from '../sidebar/SideBar';
import { useNavigate } from 'react-router-dom';
import './expense.css';
import { Modal } from 'antd';
import ExpenseReport from './ExpenseReport';
import axios from 'axios';

const Expense = () => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [expense, setExpense] = useState([]);
  const [filteredExpense, setFilteredExpense] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchExpense = async () => {
      const userId = localStorage.getItem('userId');

      if (isNaN(userId)) {
        console.error('Invalid user ID:', userId);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/expense/${userId}`);
        const formattedData = response.data.map(exp => ({
          ...exp,
          date: formatDate(exp.date),
        }));
        setTimeout(() => {
          setExpense(formattedData);
          setFilteredExpense(formattedData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching expense:', error);
        setLoading(false);
      }
    };

    fetchExpense();
  }, []);

  useEffect(() => {
    const filtered = expense.filter(exp =>
      exp.category.toLowerCase().includes(filterCategory.toLowerCase())
    );
    setFilteredExpense(filtered);
  }, [filterCategory, expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userIdString = localStorage.getItem('userId');
    const userId = parseInt(userIdString, 10);

    if (isNaN(userId)) {
      console.error('Invalid user ID:', userIdString);
      setLoading(false);
      return;
    }

    const newExpense = { amount, category, description, date: formatDate(date), user_id: userId };
    try {
      const response = await axios.post('http://localhost:5000/api/expense', newExpense);

      const formattedDate = formatDate(date);
      const updatedExpenseItem = { ...newExpense, date: formattedDate };

      const updatedExpense = [...expense, updatedExpenseItem];

      setIsModalOpen(false);
      setTimeout(() => {
        setExpense(updatedExpense);
        setFilteredExpense(updatedExpense);
        setLoading(false);
      }, 1000);

      setCategory('');
      setDescription('');
      setAmount('');
      setDate('');
    } catch (error) {
      console.error('Error adding expense:', error);
      setLoading(false);
    }



  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const userIdString = localStorage.getItem('userId');
    const userId = parseInt(userIdString, 10);

    if (isNaN(userId)) {
      console.error('Invalid user ID:', userIdString);
      return;
    }

    const updatedExpense = { amount, category, description, date: formatDate(date), user_id: userId };
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/expense/${editExpenseId}`, updatedExpense);

      const updatedExpenseList = expense.map(e => (e.id === editExpenseId ? { ...e, ...updatedExpense } : e));

      setTimeout(() => {
        setExpense(updatedExpenseList);
        setFilteredExpense(updatedExpenseList);
        setLoading(false);
      }, 1000);

      setIsEditModalOpen(false);
      setCategory('');
      setDescription('');
      setAmount('');
      setDate('');
    } catch (error) {
      console.error('Error updating expense:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/expense/${id}`);
      const updatedExpense = expense.filter(e => e.id !== id);

      setTimeout(() => {
        setExpense(updatedExpense);
        setFilteredExpense(updatedExpense);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error deleting expense:', error);
      setLoading(false);
    }
  };

  const openEditModal = (expense) => {
    setEditExpenseId(expense.id);
    setCategory(expense.category);
    setDescription(expense.description);
    setAmount(expense.amount);
    setDate(expense.date);
    setIsEditModalOpen(true);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
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
              onCancel={() => setIsModalOpen(false)}
              footer={null}
            >
              <div className="modal">
                <form className="form" onSubmit={handleSubmit}>
                  <div className='expense_form_div_category'>
                    <label className="label">Category:</label>
                    <input
                      type="text"
                      className="input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                  </div>
                  <div className='expense_form_div'>
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
                    <label className="label">Amount:</label>
                    <input
                      type="number"
                      className="input"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Date:</label>
                    <input
                      type="date"
                      className="input"
                      value={date}
                      onChange={handleDateChange}
                    />
                  </div>
                  <button type="submit" className="add_button">Add Expense</button>
                </form>
              </div>
            </Modal>

            <Modal
              title="Edit Expense"
              open={isEditModalOpen}
              onCancel={() => setIsEditModalOpen(false)}
              footer={null}
            >
              <div className="modal">
                <form className="form" onSubmit={handleEditSubmit}>
                  <div className='expense_form_div_category'>
                    <label className="label">Category:</label>
                    <input
                      type="text"
                      className="input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                  </div>
                  <div className='expense_form_div'>
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
                    <label className="label">Amount:</label>
                    <input
                      type="number"
                      className="input"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Date:</label>
                    <input
                      type="date"
                      className="input"
                      value={date}
                      onChange={handleDateChange}
                    />
                  </div>
                  <button type="submit" className="add_button">Update Expense</button>
                </form>
              </div>
            </Modal>

            <h1>Personal Expense Manager</h1>
            <div className="controlers">
              <div className="buttons">
                <button className="add-expense" onClick={() => setIsModalOpen(true)}>Add Expense</button>
                <button className="expense-report" onClick={() => setIsModalOpen2(true)}>Expense Report</button>
              </div>
              <div className="searchdiv">
                <input
                  type="text"
                  placeholder="Search by Category"
                  className="search-input"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                />
                <button className="clear-button" onClick={() => setFilterCategory("")}>Clear</button>
              </div>
            </div>
            <div className="expense_table_div">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Action Item</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <div className="inloading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading...</p>
                    </div>
                  ) :
                    filteredExpense.length > 0 ? [...filteredExpense].reverse().map((e, index) => (
                      <tr key={e.id}>
                        <td>{index + 1}</td>
                        <td className='expense_des'>{e.category.toUpperCase()}</td>
                        <td className='expense_des'>{e.description.toUpperCase()}</td>
                        <td className='expense_amt'>₹{parseFloat(e.amount).toFixed(2)}</td>
                        <td>{e.date}</td>
                        <td>
                          <button className="edit-button" onClick={() => openEditModal(e)}>Edit</button>
                          <button className="delete-button" onClick={() => handleDelete(e.id)}>Delete</button>
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
        title="Expense Report"
        open={isModalOpen2}
        onCancel={() => setIsModalOpen2(false)}
        footer={null}
      >
        <ExpenseReport setIsModalOpen2={setIsModalOpen2} setIsModalOpen={setIsModalOpen} />
      </Modal>
    </>
  );
};

export default Expense;
