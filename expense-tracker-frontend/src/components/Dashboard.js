import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseList from './ExpenseList';
import AddExpense from './AddExpense';
import SearchExpenses from './SearchExpenses';

const API_URL = process.env.REACT_APP_API_URL || 'https://expense-tracker-backend-km1u.onrender.com';

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(`${API_URL}/expenses`);
                setExpenses(response.data);
                const totalAmount = response.data.reduce((acc, expense) => acc + expense.amount, 0);
                setTotal(totalAmount);
            } catch (error) {
                console.error('Error fetching expenses', error);
            }
        };

        fetchExpenses();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Total Expenses: ₹{total.toFixed(2)}</h2>
            <AddExpense setExpenses={setExpenses} setTotal={setTotal} />
            <SearchExpenses setExpenses={setExpenses} />
            <ExpenseList expenses={expenses} setExpenses={setExpenses} setTotal={setTotal} />
        </div>
    );
};

export default Dashboard;
