import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';



const ReportChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    const calculateTotal = (type) => {
      const filteredTransactions = transactions.filter(i => i.type === type);
      const categoryTotals = {};

      filteredTransactions.forEach((i) => {
        if (!categoryTotals[i.category]) {
          categoryTotals[i.category] = { amount: 0, descriptions: [] };
        }
        categoryTotals[i.category].amount += parseFloat(i.amount);
        categoryTotals[i.category].descriptions.push(i.description);
      });

      return Object.keys(categoryTotals).map(category => ({
        name: category,
        [type === 'income' ? 'Income' : 'Expense']: categoryTotals[category].amount,
        descriptions: categoryTotals[category].descriptions.join(', ')
      }));
    };

    // const navigate = useNavigate();
    const income = calculateTotal("income");
    const expense = calculateTotal("expense");
    const initialData = [...income, ...expense];
    setData(initialData);
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

  return (
    <div className="reportchart_continer">
      
      {data.length ?
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Income" fill="#8884d8" />
            <Bar dataKey="Expense" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
        : (
          <div className="message-container">
            <p>No Data to Display</p>
            <p>Please Add Income or Expenses</p>
          </div>
        )
      }
    </div>
  );
};

export default ReportChart;
