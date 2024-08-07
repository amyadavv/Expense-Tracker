import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://expense-tracker-backend-km1u.onrender.com';

const AddExpense = ({ setExpenses, setTotal }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/expenses`, { description, amount: parseFloat(amount) });
            setExpenses(prev => [...prev, response.data]);
            setTotal(prev => prev + response.data.amount);
            setDescription('');
            setAmount('');
            alert('Expense added successfully!');
        } catch (error) {
            console.error('Error adding expense', error);
        }
    };

    return (
        <div>
            <h2>Add Expense</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Amount:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Expense</button>
            </form>
        </div>
    );
};

export default AddExpense;
