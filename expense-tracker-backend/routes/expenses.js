const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Apply auth middleware to all expense routes
router.use(auth);

// Get All Expenses for Logged in User
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add Expense
router.post('/', async (req, res) => {
    const { description, amount, category, date } = req.body;
    
    if (!description || amount === undefined) {
        return res.status(400).json({ message: 'Description and amount are required' });
    }

    try {
        const newExpense = new Expense({
            userId: req.user.id,
            description,
            amount: parseFloat(amount),
            category: category || 'Other',
            date: date || new Date()
        });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Edit Expense
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { description, amount, category, date } = req.body;
    
    try {
        // Find expense and make sure it belongs to the user
        const expense = await Expense.findOne({ _id: id, userId: req.user.id });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or unauthorized' });
        }

        if (description !== undefined) expense.description = description;
        if (amount !== undefined) expense.amount = parseFloat(amount);
        if (category !== undefined) expense.category = category;
        if (date !== undefined) expense.date = date;

        const updatedExpense = await expense.save();
        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Expense
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found or unauthorized' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search Expenses by Description for Logged in User
router.get('/search', async (req, res) => {
    const { q } = req.query;
    try {
        const queryOptions = { userId: req.user.id };
        if (q) {
            queryOptions.description = new RegExp(q, 'i');
        }
        const expenses = await Expense.find(queryOptions).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
