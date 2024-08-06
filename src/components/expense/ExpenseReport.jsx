import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpenseReport = ({ setIsModalOpen2, setIsModalOpen }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateTotal = (expenses) => {
    const filteredExpenses = expenses; // Directly use the fetched expenses
    
    const categoryTotals = {};
    
    filteredExpenses.forEach((i) => {
      if (!categoryTotals[i.category]) {
        categoryTotals[i.category] = { Expense: 0, descriptions: [] };
      }
      categoryTotals[i.category].Expense += parseFloat(i.amount);
      categoryTotals[i.category].descriptions.push(i.description);
    });
    
    const data = Object.keys(categoryTotals).map(category => ({
      name: category,
      Expense: categoryTotals[category].Expense,
      descriptions: categoryTotals[category].descriptions.join(', ')
    }));
    
    return data;
  };

  const fetchExpenses = async () => {
    const userId = localStorage.getItem('userId');
    
    if (isNaN(userId)) {
      console.error('Invalid user ID:', userId);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/expense/${userId}`);
      const initialExpenses = calculateTotal(response.data);
      setData(initialExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label.toUpperCase()} : ${payload[0].value.toFixed(2)}`}</p>
          <p className="intro">{payload[0].payload.descriptions.toUpperCase()}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} margin={{ top: 90, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Expense" barSize={20} fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="message-container">
          <p>No Data to Display </p>
          <button className="add_button" onClick={() => { setIsModalOpen2(false); setIsModalOpen(true) }}>Add Expenses</button>
        </div>
      )}
    </div>
  );
};

export default ExpenseReport;
