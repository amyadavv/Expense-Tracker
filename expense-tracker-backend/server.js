require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

// Middleware
app.use(cors());

app.use(bodyParser.json());

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('Connected to MongoDB');
    } catch (primaryError) {
        console.error('Primary MongoDB connection failed:', primaryError.message);
        throw primaryError;
    }
};

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

const startServer = async () => {
    try {
        await connectToMongo();
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Server failed to start because MongoDB is unavailable.');
        process.exit(1);
    }
};

startServer();
