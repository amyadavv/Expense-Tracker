import React from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ExpenseList = ({ expenses, setExpenses, setTotal }) => {

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${API_URL}/expenses/${id}`);
            const updatedExpenses = expenses.filter(expense => expense._id !== id);
            setExpenses(updatedExpenses);
            const totalAmount = updatedExpenses.reduce((acc, expense) => acc + expense.amount, 0);
            setTotal(totalAmount);
        } catch (error) {
            console.error('Error deleting expense', error);
        }
    };

    return (
        <ul>
            {expenses.map(expense => (
                <li key={expense._id}>
                    {expense.description}: ₹{expense.amount.toFixed(2)}
                    <button onClick={() => deleteExpense(expense._id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
};

export default ExpenseList;
