const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    // Total products
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Total stock value
    const products = await Product.find({ isActive: true });
    const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    // Low stock items
    const lowStockItems = products.filter(p => p.quantity <= p.reorderLevel);

    // Out of stock items
    const outOfStockItems = products.filter(p => p.quantity === 0);

    // Recent transactions (last 10)
    const recentTransactions = await Transaction.find()
      .populate('product', 'name sku')
      .populate('performedBy', 'name')
      .sort({ transactionDate: -1 })
      .limit(10);

    // Total IN/OUT today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTransactions = await Transaction.find({
      transactionDate: { $gte: today }
    });

    const todayStockIn = todayTransactions
      .filter(t => t.type === 'IN')
      .reduce((sum, t) => sum + t.quantity, 0);

    const todayStockOut = todayTransactions
      .filter(t => t.type === 'OUT')
      .reduce((sum, t) => sum + t.quantity, 0);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalStockValue,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length,
        todayStockIn,
        todayStockOut,
        lowStockItems: lowStockItems.slice(0, 5),
        recentTransactions
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = { getDashboardStats };
