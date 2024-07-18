import React, { useState, useEffect } from 'react';
import SideBar from '../sidebar/SideBar';
import { Card, Space, Progress } from 'antd';
import './budget.css';

const Budget = () => {
    const [budgetItems, setBudgetItems] = useState([]);
    const [percentages, setPercentages] = useState({});

    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem('budgetItems')) || [];
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        setBudgetItems(storedItems);

        // Calculate percentages for each budget item
        const calculatePercentages = () => {
            let percentageMap = {};
            storedItems.forEach(budgetItem => {
                const totalExpenses = transactions
                    .filter(transaction => transaction.category === budgetItem.category && transaction.type === 'expense')
                    .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
                const percentage = ((totalExpenses / budgetItem.amount) * 100).toFixed(2);
                percentageMap[budgetItem.id] = {
                    percentage: parseFloat(percentage),
                    totalExpenses: totalExpenses,
                    exceedsBudget: totalExpenses > budgetItem.amount,
                };
            });
            setPercentages(percentageMap);
        };

        calculatePercentages();

        // Recalculate percentages whenever transactions change
        window.addEventListener('storage', calculatePercentages);

        return () => {
            window.removeEventListener('storage', calculatePercentages);
        };
    }, []);

    const addBudgetItem = (item) => {
        const newItem = {
            id: budgetItems.length + 1,
            category: item.category,
            description: item.description,
            amount: item.amount,
            type: item.type,
        };
        const updatedItems = [...budgetItems, newItem];
        setBudgetItems(updatedItems);
        localStorage.setItem('budgetItems', JSON.stringify(updatedItems));
    };

    const BudgetForm = ({ addBudgetItem }) => {
        const [category, setCategory] = useState('');
        const [description, setDescription] = useState('');
        const [amount, setAmount] = useState('');
        const [type, setType] = useState('Expense');

        const handleSubmit = (e) => {
            e.preventDefault();
            const newItem = {
                category,
                description,
                amount: parseFloat(amount),
                type,
            };
            addBudgetItem(newItem);
            setCategory('');
            setDescription('');
            setAmount('');
            setType('Expense'); // Reset type to default after submission
        };

        return (
            <form className="budget-form" onSubmit={handleSubmit}>
                <h2>Add Budget</h2>
                <div>
                    <label>Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Add Item</button>
            </form>
        );

    };
    const totalbudget = budgetItems.reduce((total, item) => total + parseFloat(item.amount), 0);


    return (
        <>
            <div className="container">
                <div className="sidebar">
                    <SideBar />
                </div>
                <div className="budget_content_container">
                    <h1>Budget Page</h1>
                    <h3 className='btotal' >Total budget: {isNaN(totalbudget) ? "00.00" : totalbudget}</h3>
                    <div className="budget_container">
                        <div className="budget_form">
                            <BudgetForm addBudgetItem={addBudgetItem} />
                        </div>


                        <div className="budget_item">

                            <BudgetList items={budgetItems} percentages={percentages} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const BudgetList = ({ items, percentages }) => (
    <div className="budget-list">

        <ul>
            {items.length > 0 ? items.map(item => (
                <li key={item.id}>
                    <Space direction="vertical" size={16}>
                        <Card
                            title={item.category}
                            style={{
                                width: 370,
                            }}
                        >
                            <p>${item.amount.toFixed(2)} ({item.type})</p>
                            <p>{item.description}</p>
                            <p>Total Expenses: ${percentages[item.id]?.totalExpenses.toFixed(2) || 0}</p>
                            <Progress
                                percent={percentages[item.id]?.percentage || 0}
                                status={percentages[item.id]?.exceedsBudget ? 'exception' : 'active'}
                                strokeColor={percentages[item.id]?.exceedsBudget ? 'red' : undefined}
                            />
                        </Card>
                    </Space>
                </li>
            )) : <h2>No Data To Display</h2>}
        </ul>
    </div>
);

export default Budget;
