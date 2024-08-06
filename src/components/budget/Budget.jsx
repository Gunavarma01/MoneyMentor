import React, { useState, useEffect } from 'react';
import SideBar from '../sidebar/SideBar';
import { useNavigate } from 'react-router-dom';
import { Modal, Progress, Card, Space } from 'antd';
import axios from 'axios';
import './budget.css';

const API_BASE_URL = 'http://localhost:5000/api';

const Budget = () => {
    const [budgetItems, setBudgetItems] = useState([]);
    const [percentages, setPercentages] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log('Retrieved userId:', userId);
        setLoading(true);


        if (isNaN(userId)) {
            console.error('Invalid user ID:', userId);
            setLoading(false);

            return;
        }
        const fetchBudgetItems = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/budget/${userId}`);
                setBudgetItems(response.data);
            } catch (error) {
                console.error('Error fetching budget items:', error);
                setLoading(false);

            }
        };

        const fetchTransactionsAndCalculatePercentages = async () => {

            try {
                const [budgetResponse, transactionResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/budget/${userId}`),
                    axios.get(`${API_BASE_URL}/expense/${userId}`)
                ]);

                const fetchedBudgetItems = budgetResponse.data;
                const transactions = transactionResponse.data;


                setTimeout(() => {
                    setBudgetItems(fetchedBudgetItems);

                    setLoading(false);
                }, 1000);

                let percentageMap = {};
                fetchedBudgetItems.forEach(budgetItem => {
                    const totalExpenses = transactions
                        .filter(transaction => transaction.category === budgetItem.category)
                        .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
                    const percentage = ((totalExpenses / budgetItem.amount) * 100).toFixed(2);
                    percentageMap[budgetItem.id] = {
                        percentage: parseFloat(percentage),
                        totalExpenses: totalExpenses,
                        exceedsBudget: totalExpenses > budgetItem.amount,
                    };
                });
                setPercentages(percentageMap);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);

            }
        };

        fetchBudgetItems();
        fetchTransactionsAndCalculatePercentages();
    }, []);

    const handleAddBudgetItem = async (e) => {
        e.preventDefault();
        setLoading(true);


        const newItem = {
            category,
            description,
            amount: parseFloat(amount),
            user_id: localStorage.getItem('userId')
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/budget`, newItem);

            setTimeout(() => {
                setBudgetItems([...budgetItems, response.data]);

                setLoading(false);
            }, 1000);

            setIsModalOpen(false);
            setCategory('');
            setDescription('');
            setAmount('');
        } catch (error) {
            console.error('Error adding budget item:', error);
            setLoading(false);

        }
    };


    const handleEditBudgetItem = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedItem = {
            category,
            description,
            amount: parseFloat(amount)
        };

        try {
            const response = await axios.put(`${API_BASE_URL}/budget/${editItemId}`, updatedItem);
            setIsModalOpen(false);
            setTimeout(() => {
                setBudgetItems(budgetItems.map(item => (item.id === editItemId ? { ...item, ...updatedItem } : item)));
                setLoading(false);
            }, 1000);
            window.location.reload();
            // navigate('/home')
            setCategory('');
            setDescription('');
            setAmount('');
        } catch (error) {
            console.error('Error updating budget item:', error);
            setLoading(false);

        }
    };

    const handleDelete = async (id) => {
        setLoading(true);

        try {
            await axios.delete(`${API_BASE_URL}/budget/${id}`);

            setTimeout(() => {
                setBudgetItems(budgetItems.filter(item => item.id !== id));

                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error deleting budget item:', error);
            setLoading(false);

        }
    };

    const openEditModal = (item) => {
        setEditItemId(item.id);
        setCategory(item.category);
        setDescription(item.description);
        setAmount(item.amount);
        setIsModalOpen(true);
    };

    const totalBudget = budgetItems.reduce((total, item) => total + parseFloat(item.amount), 0);

    return (
        <>
            <div className="container">
                <div className="sidebar">
                    <SideBar />
                </div>

                <div className="budget-container">
                    <Modal
                        title={editItemId ? "Edit Budget Item" : "Add Budget Item"}
                        open={isModalOpen}
                        onCancel={() => { setIsModalOpen(false); }}
                        footer={null}
                        className="budget-modal"
                    >
                        <form className="budget-form" onSubmit={editItemId ? handleEditBudgetItem : handleAddBudgetItem}>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Amount</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-button">{editItemId ? "Update Item" : "Add Item"}</button>
                        </form>
                    </Modal>

                    <div className="bdata">
                        <h1 className="page-title">Budget Page</h1>
                        <h3 className="total-budget">Total Budget: {isNaN(totalBudget) ? "$00.00" : `$${totalBudget.toFixed(2)}`}</h3>
                        <div className="budget-controls">
                            <button onClick={() => setIsModalOpen(true)} className="add-item-button">Add Budget Item</button>
                        </div>
                        <div className="budget-list">
                            <ul>
                                {loading ? (
                                    <div className="budloading-container">
                                        <div className="loading-spinner"></div>
                                        <p>Loading...</p>
                                    </div>
                                ) :
                                    budgetItems.length > 0 ? budgetItems.map(item => (
                                        <li key={item.id} className="budget-item">
                                            <Card
                                                title={item.category}
                                                className="budget-card"
                                            >
                                                <p className="item-amount">${item.amount.toFixed(2)}</p>
                                                <p className="item-description">{item.description}</p>
                                                <p className="item-expenses">Total Expenses: ${percentages[item.id]?.totalExpenses.toFixed(2) || "0.00"}</p>
                                                <Progress
                                                    percent={percentages[item.id]?.percentage || 0}
                                                    status={percentages[item.id]?.exceedsBudget ? 'exception' : 'active'}
                                                    strokeColor={percentages[item.id]?.exceedsBudget ? 'red' : undefined}
                                                    className="budget-progress"
                                                />
                                                <div className="card-actions">
                                                    <button onClick={() => openEditModal(item)} className="edit-button">Edit</button>
                                                    <button onClick={() => handleDelete(item.id)} className="delete-button">Delete</button>
                                                </div>
                                            </Card>
                                        </li>
                                    )) : <h2 className="no-data">No Data To Display</h2>}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Budget;
