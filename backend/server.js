require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Inventory AI MVP API Server Running',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// API Routes (will be added in Phase 2)
// app.use('/api/auth', require('./src/routes/authRoutes'));
// app.use('/api/users', require('./src/routes/userRoutes'));
// app.use('/api/products', require('./src/routes/productRoutes'));
// app.use('/api/transactions', require('./src/routes/transactionRoutes'));
// app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
