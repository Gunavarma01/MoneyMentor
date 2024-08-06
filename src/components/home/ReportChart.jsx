import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import './reportChart.css'; 

const ReportChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      console.log('Retrieved userId:', userId);

      if (isNaN(userId)) {
        console.error('Invalid user ID:', userId);
        setLoading(false);
        return;
      }
      try {
        // Fetch income and expense data from the API
        const [incomeResponse, expenseResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/income/${userId}`),
          axios.get(`http://localhost:5000/api/expense/${userId}`),
        ]);

        const incomeData = incomeResponse.data;
        const expenseData = expenseResponse.data;

        // Function to calculate total by category
        const calculateTotal = (transactions, type) => {
          const categoryTotals = {};

          transactions.forEach((i) => {
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

        // Calculate totals for income and expense
        const income = calculateTotal(incomeData, "income");
        const expense = calculateTotal(expenseData, "expense");

        // Combine both income and expense data
        const combinedData = [...income, ...expense];

       
        setTimeout(() => {
          setData(combinedData);
          setLoading(false);
        }, 1000);

      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
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
    <div className="reportchart_container">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      ) : data.length ? (
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
            <Bar dataKey="Income" fill="#8884d8" animationDuration={1500} />
            <Bar dataKey="Expense" fill="#82ca9d" animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="message-container">
          <p>No Data to Display</p>
          <p>Please Add Income or Expenses</p>
        </div>
      )}
    </div>
  );
};

export default ReportChart;
