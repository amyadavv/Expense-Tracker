const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://amyadav319:%404Placement010213@cluster0.mnvyrz1.mongodb.net/');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Expense schema and model
const expenseSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    date: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);


// Add Expense
app.post('/expenses', async (req, res) => {
    const { description, amount } = req.body;
    try {
        const newExpense = new Expense({ description, amount });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get All Expenses
app.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Edit Expense dout still
app.put('/expenses/:id', async (req, res) => {
    const { id } = req.params;
    const { description, amount } = req.body;
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(id, { description, amount }, { new: true });
        if (!updatedExpense) return res.status(404).json({ message: 'Expense not found' });
        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Expense
app.delete('/expenses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedExpense = await Expense.findByIdAndDelete(id);
        if (!deletedExpense) return res.status(404).json({ message: 'Expense not found' });
        res.status(200).json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search Expenses by Description
app.get('/search', async (req, res) => {
    const { q } = req.query;
    try {
        const expenses = await Expense.find({
            description: new RegExp(q, 'i') 
        });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
