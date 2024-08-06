import React, { useState, useEffect } from 'react';
import SideBar from '../sidebar/SideBar';
import { useNavigate } from 'react-router-dom';
import './income.css';
import { Modal } from 'antd';
import IncomeReport from './IncomeReport';
import axios from 'axios';

const Income = () => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [income, setIncome] = useState([]);
  const [filteredIncome, setFilteredIncome] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [editIncomeId, setEditIncomeId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchIncome = async () => {
    const userId = localStorage.getItem('userId');
    console.log('Retrieved userId:', userId);

    if (isNaN(userId)) {
      console.error('Invalid user ID:', userId);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/income/${userId}`);
      
      setTimeout(() => {
        setIncome(response.data);
        setFilteredIncome(response.data);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching income:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  useEffect(() => {
    if (filterCategory.trim() === '') {
      setFilteredIncome(income);
    } else {
      const filtered = income.filter(i => i.category.toLowerCase().includes(filterCategory.toLowerCase()));
      setFilteredIncome(filtered);
    }
  }, [filterCategory, income]);

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

    const newIncome = { amount, category, description, date, user_id: userId };
    try {
      const response = await axios.post('http://localhost:5000/api/income', newIncome);
      const updatedIncome = [...income, response.data];
      
      setTimeout(() => {
        setIncome(updatedIncome);
        setFilteredIncome(updatedIncome);
        setLoading(false);
      }, 1000);
      
      setIsModalOpen(false);
      setCategory('');
      setDescription('');
      setAmount('');
      setDate('');
    } catch (error) {
      console.error('Error adding income:', error);
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userIdString = localStorage.getItem('userId');
    const userId = parseInt(userIdString, 10);

    if (isNaN(userId)) {
      console.error('Invalid user ID:', userIdString);
      setLoading(false);
      return;
    }

    const updatedIncome = { amount, category, description, date, user_id: userId };
    try {
      const response = await axios.put(`http://localhost:5000/api/income/${editIncomeId}`, updatedIncome);
      const updatedIncomeList = income.map(i => (i.id === editIncomeId ? { ...i, ...updatedIncome } : i));
      
      setTimeout(() => {
        setIncome(updatedIncomeList);
        setFilteredIncome(updatedIncomeList);
        setLoading(false);
      }, 1000);
      
      setIsEditModalOpen(false);
      setCategory('');
      setDescription('');
      setAmount('');
      setDate('');
    } catch (error) {
      console.error('Error updating income:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/income/${id}`);
      const updatedIncome = income.filter(i => i.id !== id);
      
      setTimeout(() => {
        setIncome(updatedIncome);
        setFilteredIncome(updatedIncome);
        setLoading(false);
      }, 1000);

      
    } catch (error) {
      console.error('Error deleting income:', error);
      setLoading(false);
    }
  };

  const openEditModal = (income) => {
    setEditIncomeId(income.id);
    setCategory(income.category);
    setDescription(income.description);
    setAmount(income.amount);
    setDate(income.date);
    setIsEditModalOpen(true);
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
              onCancel={() => setIsModalOpen(false)}
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
                    <label className="label ">Amount:</label>
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
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="add_button">Add Income</button>
                </form>
              </div>
            </Modal>

            <Modal
              title="Edit Income"
              open={isEditModalOpen}
              onCancel={() => setIsEditModalOpen(false)}
              footer={null}
            >
              <div className="modal">
                <form className="form" onSubmit={handleEditSubmit}>
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
                    <label className="label ">Amount:</label>
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
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="add_button">Update Income</button>
                </form>
              </div>
            </Modal>

            <h1>Personal Income Manager</h1>
            <div className="controlers">
              <div className="buttons">
                <button className="add-income" onClick={() => setIsModalOpen(true)}>Add Income</button>
                <button className="income-report" onClick={() => setIsModalOpen2(true)}>Income Report</button>
              </div>
              <div className="searchdiv">
                <input
                  type="text"
                  placeholder="Search by Category"
                  className="search-input"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                />
                <button className="filter-button" onClick={(e) => setFilterCategory("")} >Clear</button>
              </div>
            </div>
            <div className="income_table_div">
              <table>
                <thead>
                  <tr>
                    <th>NO</th>
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
                    filteredIncome.length > 0 ? [...filteredIncome].reverse().map((i, index) => (
                      <tr key={i.id}>
                        <td>{index + 1}</td>
                        <td className='income_des'>{i.category.toUpperCase()}</td>
                        <td className='income_des'>{i.description.toUpperCase()}</td>
                        <td className='income_amt'>₹{parseFloat(i.amount).toFixed(2)}</td>
                        <td>{i.date}</td>
                        <td>
                          <button className="edit-button" onClick={() => openEditModal(i)}>Edit</button>
                          <button className="delete-button" onClick={() => handleDelete(i.id)}>Delete</button>
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
        onCancel={() => setIsModalOpen2(false)}
        footer={null}
      >
        <IncomeReport setIsModalOpen2={setIsModalOpen2} setIsModalOpen={setIsModalOpen} />
      </Modal>
    </>
  );
};

export default Income;
