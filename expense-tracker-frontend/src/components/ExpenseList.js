import React from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';

const ExpenseList = ({ expenses, setExpenses, api }) => {
    
    const deleteExpense = async (id) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        try {
            await api.delete(`/expenses/${id}`);
            // Optimistic update of local UI list
            setExpenses(prev => prev.filter(expense => expense._id !== id));
        } catch (error) {
            console.error('Error deleting expense', error);
            alert(error.response?.data?.message || 'Failed to delete expense.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const getCategoryBadgeClass = (category) => {
        const cat = (category || 'Other').toLowerCase();
        return `expense-category-badge badge-${cat}`;
    };

    if (expenses.length === 0) {
        return (
            <div className="empty-table-state">
                <ShoppingBag className="empty-state-icon" size={48} />
                <h3>No transactions recorded</h3>
                <p>Add some expenses or clear your search queries to see updates.</p>
            </div>
        );
    }

    return (
        <div className="expenses-table-wrapper">
            <table className="expenses-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense._id}>
                            <td className="expense-row-description">
                                {expense.description}
                            </td>
                            <td>
                                <span className={getCategoryBadgeClass(expense.category)}>
                                    {expense.category || 'Other'}
                                </span>
                            </td>
                            <td className="expense-row-date">
                                {formatDate(expense.date)}
                            </td>
                            <td className="expense-row-amount" style={{ color: 'var(--text-primary)' }}>
                                ₹{expense.amount.toFixed(2)}
                            </td>
                            <td className="expense-actions-cell">
                                <button 
                                    onClick={() => deleteExpense(expense._id)} 
                                    className="btn-row-action delete"
                                    title="Delete transaction"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseList;
