const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { type, startDate, endDate, productId } = req.query;
    let query = {};

    if (type) query.type = type;
    if (productId) query.product = productId;
    
    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) query.transactionDate.$gte = new Date(startDate);
      if (endDate) query.transactionDate.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('product', 'name sku category')
      .populate('performedBy', 'name email')
      .sort({ transactionDate: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Create transaction (Stock IN/OUT)
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { product, type, quantity, notes } = req.body;

    // Get product
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Update product quantity
    if (type === 'IN') {
      productDoc.quantity += quantity;
    } else if (type === 'OUT') {
      if (productDoc.quantity < quantity) {
        return res.status(400).json({ 
          success: false, 
          message: 'Insufficient stock' 
        });
      }
      productDoc.quantity -= quantity;
    }

    await productDoc.save();

    // Create transaction
    const transaction = await Transaction.create({
      product,
      type,
      quantity,
      notes,
      performedBy: req.user.id
    });

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('product', 'name sku category')
      .populate('performedBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedTransaction
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  getTransactions,
  createTransaction
};
