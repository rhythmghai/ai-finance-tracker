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

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ai-finance-tracker-client.vercel.app",
    "https://ai-finance-tracker.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', txRoutes);
app.use('/api/subscriptions', subRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/budget', budgetRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
