import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const IncomeReport = ({ setIsModalOpen2, setIsModalOpen }) => {
  const [data, setData] = useState([]);

  const calculateTotal = (transactions) => {
    const filteredTransactions = transactions;

    const categoryTotals = {};

    filteredTransactions.forEach((i) => {
      if (!categoryTotals[i.category]) {
        categoryTotals[i.category] = { Income: 0, descriptions: [] };
      }
      categoryTotals[i.category].Income += parseFloat(i.amount);
      categoryTotals[i.category].descriptions.push(i.description);
    });

    const data = Object.keys(categoryTotals).map(category => ({
      name: category,
      Income: categoryTotals[category].Income,
      descriptions: categoryTotals[category].descriptions.join(', ')
    }));

    return data;
  };

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

  useEffect(() => {
    const fetchIncomeData = async () => {
      const userIdString = localStorage.getItem('userId');
      const userId = parseInt(userIdString, 10);

      if (isNaN(userId)) {
        console.error('Invalid user ID:', userIdString);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/income/${userId}`);
        const initialIncomes = calculateTotal(response.data);
        setData(initialIncomes);
      } catch (error) {
        console.error('Error fetching income data:', error);
      }
    };

    fetchIncomeData();
  }, []);

  const navigate = useNavigate();

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
            <Bar dataKey="Income" barSize={20} fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="message-container">
          <p>No Data to Display</p>
          <button className="add_button" onClick={() => { setIsModalOpen2(false); setIsModalOpen(true) }}>Add Incomes</button>
        </div>
      )}
    </div>
  );
};

export default IncomeReport;
