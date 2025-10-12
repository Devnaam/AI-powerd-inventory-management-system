const express = require('express');
const {
  getTransactions,
  createTransaction
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getTransactions)
  .post(protect, createTransaction);

module.exports = router;
