import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://expense-tracker-backend-km1u.onrender.com';

const AddExpense = ({ setExpenses, setTotal }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const parsedAmount = parseFloat(amount);
        const tempId = `temp-${Date.now()}`;
        const optimisticExpense = {
            _id: tempId,
            description,
            amount: parsedAmount,
        };

        setIsSubmitting(true);
        setExpenses(prev => [...prev, optimisticExpense]);
        setTotal(prev => prev + parsedAmount);
        setDescription('');
        setAmount('');

        try {
            const response = await axios.post(`${API_URL}/expenses`, {
                description,
                amount: parsedAmount,
            });

            setExpenses(prev =>
                prev.map(expense => (expense._id === tempId ? response.data : expense))
            );
        } catch (error) {
            console.error('Error adding expense', error);
            setExpenses(prev => prev.filter(expense => expense._id !== tempId));
            setTotal(prev => prev - parsedAmount);
            setDescription(description);
            setAmount(amount);
        } finally {
            setIsSubmitting(false);
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
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add Expense'}
                </button>
            </form>
        </div>
    );
};

export default AddExpense;
