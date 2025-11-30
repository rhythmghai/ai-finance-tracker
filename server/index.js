require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const txRoutes = require('./routes/transactions');
const subRoutes = require('./routes/subscriptions');
const billRoutes = require('./routes/bills');
const budgetRoutes = require('./routes/budget');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', txRoutes);
app.use('/api/subscriptions', subRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/budget', budgetRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_finance_tracker';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
