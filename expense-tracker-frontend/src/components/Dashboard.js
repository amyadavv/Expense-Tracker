import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Wallet, Plus, LogOut, Search, Filter, 
    TrendingDown, Calendar, CreditCard, PieChart, 
    AlertTriangle, RefreshCw, Sparkles
} from 'lucide-react';
import AddExpense from './AddExpense';
import ExpenseList from './ExpenseList';

const CATEGORIES = ['Food', 'Utilities', 'Entertainment', 'Travel', 'Shopping', 'Other'];
const CATEGORY_COLORS = {
    Food: '#f59e0b',
    Utilities: '#3b82f6',
    Entertainment: '#a855f7',
    Travel: '#06b6d4',
    Shopping: '#ec4899',
    Other: '#94a3b8'
};

const Dashboard = () => {
    const { user, logout, api } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    // UI States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('date-desc');
    const [budgetLimit, setBudgetLimit] = useState(30000); // Editable default budget
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [newBudget, setNewBudget] = useState(budgetLimit);

    const fetchExpenses = useCallback(async (showRefreshIndicator = false) => {
        if (showRefreshIndicator) setRefreshing(true);
        try {
            const response = await api.get('/expenses');
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [api]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    // Filter and Sort Logic
    useEffect(() => {
        let result = [...expenses];

        // Search
        if (searchQuery.trim() !== '') {
            result = result.filter(exp => 
                exp.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category Filter
        if (categoryFilter !== 'All') {
            result = result.filter(exp => exp.category === categoryFilter);
        }

        // Sort
        if (sortBy === 'date-desc') {
            result.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'date-asc') {
            result.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortBy === 'amount-desc') {
            result.sort((a, b) => b.amount - a.amount);
        } else if (sortBy === 'amount-asc') {
            result.sort((a, b) => a.amount - b.amount);
        }

        setFilteredExpenses(result);
    }, [expenses, searchQuery, categoryFilter, sortBy]);

    // Calculate Stats
    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const averageExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;
    const transactionsCount = expenses.length;
    
    // Category Breakdown
    const categoryBreakdown = expenses.reduce((acc, exp) => {
        const cat = exp.category || 'Other';
        acc[cat] = (acc[cat] || 0) + exp.amount;
        return acc;
    }, {});

    const budgetUsagePercentage = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;

    const handleSaveBudget = (e) => {
        e.preventDefault();
        const parsed = parseFloat(newBudget);
        if (!isNaN(parsed) && parsed > 0) {
            setBudgetLimit(parsed);
            setIsEditingBudget(false);
        }
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar Navigation */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo">
                    <Wallet className="brand-icon-logo" size={28} />
                    <span className="brand-logo-text">SpendWise</span>
                </div>

                <nav className="sidebar-nav">
                    <button className="nav-item active">
                        <PieChart size={18} />
                        <span>Overview</span>
                    </button>
                </nav>

                <div className="sidebar-profile">
                    <div className="profile-info">
                        <span className="profile-name">{user?.username || 'User'}</span>
                        <span className="profile-email">{user?.email || 'user@example.com'}</span>
                    </div>
                    <button onClick={logout} className="btn-logout">
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Dashboard */}
            <main className="dashboard-main">
                {/* Header */}
                <div className="dashboard-header-section">
                    <div className="dashboard-title-wrapper">
                        <h1>Financial Command Center</h1>
                        <p>Welcome back, {user?.username}! Track and separate your costs smoothly.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                            onClick={() => fetchExpenses(true)} 
                            className="btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 16px' }}
                            disabled={refreshing}
                        >
                            <RefreshCw className={refreshing ? "animate-spin" : ""} size={16} />
                            Sync
                        </button>
                        <button 
                            onClick={() => setIsAddModalOpen(true)} 
                            className="btn-action-primary"
                        >
                            <Plus size={18} />
                            Add Expense
                        </button>
                    </div>
                </div>

                {/* Budget Alerts */}
                {budgetUsagePercentage >= 100 ? (
                    <div className="alert-card danger">
                        <AlertTriangle size={20} />
                        <div>
                            <h4>Budget Limit Exceeded!</h4>
                            <p>You have spent ₹{totalSpent.toFixed(2)} which exceeds your monthly threshold of ₹{budgetLimit.toFixed(2)}.</p>
                        </div>
                    </div>
                ) : budgetUsagePercentage >= 85 ? (
                    <div className="alert-card warning">
                        <AlertTriangle size={20} />
                        <div>
                            <h4>Budget Warning Threshold Met!</h4>
                            <p>You've utilized {budgetUsagePercentage.toFixed(1)}% of your monthly budget (₹{totalSpent.toFixed(2)} / ₹{budgetLimit.toFixed(2)}).</p>
                        </div>
                    </div>
                ) : null}

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon-wrapper primary">
                            <TrendingDown size={22} />
                        </div>
                        <span className="stat-label">Total Outflow</span>
                        <h2 className="stat-value">₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper success">
                            <CreditCard size={22} />
                        </div>
                        <span className="stat-label">Active Limit</span>
                        {isEditingBudget ? (
                            <form onSubmit={handleSaveBudget} style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                <input
                                    type="number"
                                    value={newBudget}
                                    onChange={(e) => setNewBudget(e.target.value)}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-hover)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        padding: '4px 8px',
                                        width: '100px',
                                        fontSize: '14px'
                                    }}
                                    autoFocus
                                />
                                <button type="submit" className="btn-action-primary" style={{ padding: '4px 8px', fontSize: '12px' }}>Save</button>
                            </form>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '4px' }}>
                                <h2 className="stat-value">₹{budgetLimit.toLocaleString('en-IN')}</h2>
                                <button 
                                    onClick={() => { setNewBudget(budgetLimit); setIsEditingBudget(true); }}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper warning">
                            <Calendar size={22} />
                        </div>
                        <span className="stat-label">Average Transaction</span>
                        <h2 className="stat-value">₹{averageExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
                            <Sparkles size={22} />
                        </div>
                        <span className="stat-label">Total Logs</span>
                        <h2 className="stat-value">{transactionsCount}</h2>
                    </div>
                </div>

                {/* Charts & Analytics Visualizer */}
                <div className="analytics-section">
                    {/* Budget progress bar card */}
                    <div className="chart-card">
                        <h3 className="chart-title">
                            Budget Utilization
                            <span style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
                                {budgetUsagePercentage.toFixed(1)}% Used
                            </span>
                        </h3>
                        <div style={{ padding: '10px 0 25px 0' }}>
                            <div className="category-bar-track" style={{ height: '16px', borderRadius: '8px', marginBottom: '12px' }}>
                                <div 
                                    className="category-bar-fill" 
                                    style={{ 
                                        width: `${Math.min(budgetUsagePercentage, 100)}%`,
                                        background: budgetUsagePercentage >= 100 
                                            ? 'var(--danger-color)' 
                                            : budgetUsagePercentage >= 85 
                                                ? 'var(--warning-color)' 
                                                : 'linear-gradient(to right, var(--primary-color), var(--success-color))',
                                        borderRadius: '8px'
                                    }}
                                ></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                <span>Spent: ₹{totalSpent.toFixed(2)}</span>
                                <span>Remaining: ₹{Math.max(0, budgetLimit - totalSpent).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Categories Breakdown progress lists */}
                    <div className="chart-card">
                        <h3 className="chart-title">Categories Allocation</h3>
                        <div className="category-bars-list">
                            {CATEGORIES.map(cat => {
                                const amount = categoryBreakdown[cat] || 0;
                                const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                                return (
                                    <div key={cat} className="category-bar-item">
                                        <div className="category-bar-header">
                                            <span className="category-bar-label">
                                                <span 
                                                    className="category-indicator-dot" 
                                                    style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                                                ></span>
                                                {cat}
                                            </span>
                                            <span>₹{amount.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                                        </div>
                                        <div className="category-bar-track">
                                            <div 
                                                className="category-bar-fill" 
                                                style={{ 
                                                    width: `${percentage}%`, 
                                                    backgroundColor: CATEGORY_COLORS[cat] 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Expenses List Board */}
                <div className="expenses-board-card">
                    <div className="board-tools-panel">
                        {/* Search */}
                        <div className="search-box-wrapper">
                            <Search className="search-icon" size={18} />
                            <input
                                type="text"
                                className="search-box-input"
                                placeholder="Search by description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="filters-group">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
                                <select 
                                    className="select-filter-custom"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="All">All Categories</option>
                                    {CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <select 
                                className="select-filter-custom"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="amount-desc">Amount: High to Low</option>
                                <option value="amount-asc">Amount: Low to High</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
                            <div className="loader-spinner"></div>
                        </div>
                    ) : (
                        <ExpenseList 
                            expenses={filteredExpenses} 
                            setExpenses={setExpenses} 
                            api={api} 
                        />
                    )}
                </div>
            </main>

            {/* Modal for adding/editing expense */}
            {isAddModalOpen && (
                <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
                    <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
                        <AddExpense 
                            onClose={() => setIsAddModalOpen(false)} 
                            setExpenses={setExpenses}
                            api={api}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
