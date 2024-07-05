import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IncomeReport = ({setIsModalOpen2, setIsModalOpen}) => {
  const calculateTotal = (type) => {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const filteredTransactions = transactions.filter(i => i.type === type);
    
    const categoryTotals = {};
    
    filteredTransactions.forEach((i) => {
      if (!categoryTotals[i.category]) {
        categoryTotals[i.category] = { amount: 0, descriptions: [] };
      }
      categoryTotals[i.category].amount += parseFloat(i.amount);
      categoryTotals[i.category].descriptions.push(i.description);
    });
    
    const data = Object.keys(categoryTotals).map(category => ({
      name: category,
      amount: categoryTotals[category].amount,
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

  const [data, setData] = useState([]);
  
  useEffect(() => {
    const initialIncomes = calculateTotal("income"); 
    setData(initialIncomes);
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
          <p>No Data to Display </p>
          <button className="add_button" onClick={()=>{setIsModalOpen2(false); setIsModalOpen(true)}} >Add Incomes</button> 
        </div>
      )}
    </div>
  );
};

export default IncomeReport;
