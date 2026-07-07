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

// MongoDB Connection
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

// Import Routes
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const authMiddleware = require('./middleware/auth');
const Expense = require('./models/Expense');

// Mount Routes
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);

// Root search alias to preserve backward compatibility if needed
app.get('/search', authMiddleware, async (req, res) => {
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

// Root check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Expense Tracker API is running' });
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
