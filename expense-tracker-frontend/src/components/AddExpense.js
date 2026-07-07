import React, { useState } from 'react';
import { X, Calendar, DollarSign, Tag, FileText, Loader2 } from 'lucide-react';

const CATEGORIES = ['Food', 'Utilities', 'Entertainment', 'Travel', 'Shopping', 'Other'];

const AddExpense = ({ onClose, setExpenses, api }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Please enter a valid amount greater than 0.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        const newExpenseData = {
            description,
            amount: parsedAmount,
            category,
            date: new Date(date).toISOString()
        };

        try {
            const response = await api.post('/expenses', newExpenseData);
            // Append the returned expense object to expenses state
            setExpenses(prev => [response.data, ...prev]);
            onClose(); // Close the modal on success
        } catch (err) {
            console.error('Error adding expense', err);
            setError(err.response?.data?.message || 'Failed to add expense. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="modal-header-panel">
                <h3>Log New Expense</h3>
                <button onClick={onClose} className="btn-close-modal">
                    <X size={18} />
                </button>
            </div>

            {error && (
                <div className="auth-error-alert" style={{ marginBottom: '16px' }}>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <div className="input-with-icon">
                        <FileText className="input-icon" size={18} />
                        <input
                            type="text"
                            id="description"
                            placeholder="What did you buy?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="amount">Amount (INR)</label>
                    <div className="input-with-icon">
                        <DollarSign className="input-icon" size={18} />
                        <input
                            type="number"
                            id="amount"
                            placeholder="0.00"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <div className="input-with-icon">
                        <Tag className="input-icon" size={18} />
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="date">Transaction Date</label>
                    <div className="input-with-icon">
                        <Calendar className="input-icon" size={18} />
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-actions-row">
                    <button type="button" onClick={onClose} className="btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn-action-submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <span className="btn-loading-content">
                                <Loader2 className="animate-spin" size={16} />
                                Adding...
                            </span>
                        ) : (
                            'Add Transaction'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddExpense;
