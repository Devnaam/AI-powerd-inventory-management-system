import { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('');

  const [formData, setFormData] = useState({
    product: '',
    type: 'IN',
    quantity: '',
    notes: ''
  });

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, [filterType]);

  const fetchTransactions = async () => {
    try {
      const params = filterType ? `?type=${filterType}` : '';
      const response = await api.get(`/transactions${params}`);
      setTransactions(response.data.data);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to load products');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', formData);
      toast.success('Transaction recorded successfully');
      closeModal();
      fetchTransactions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transaction failed');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      product: '',
      type: 'IN',
      quantity: '',
      notes: ''
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-text-primary">Transactions</h1>
          <Button onClick={() => setShowModal(true)}>
            + New Transaction
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex gap-4">
            <button
              onClick={() => setFilterType('')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === '' ? 'bg-primary text-white' : 'bg-gray-200 text-text-primary'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('IN')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'IN' ? 'bg-success text-white' : 'bg-gray-200 text-text-primary'
              }`}
            >
              Stock IN
            </button>
            <button
              onClick={() => setFilterType('OUT')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'OUT' ? 'bg-danger text-white' : 'bg-gray-200 text-text-primary'
              }`}
            >
              Stock OUT
            </button>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-center text-text-muted py-8">No transactions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Date</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Product</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">SKU</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Type</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Quantity</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Performed By</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="border-b border-border hover:bg-gray-50">
                      <td className="py-3 px-2 text-sm">
                        {new Date(transaction.transactionDate).toLocaleDateString('en-IN')}
                        <br />
                        <span className="text-text-muted text-xs">
                          {new Date(transaction.transactionDate).toLocaleTimeString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-medium">{transaction.product?.name}</td>
                      <td className="py-3 px-2 text-text-muted">{transaction.product?.sku}</td>
                      <td className="py-3 px-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'IN' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-semibold">{transaction.quantity}</td>
                      <td className="py-3 px-2">{transaction.performedBy?.name}</td>
                      <td className="py-3 px-2 text-text-muted text-sm">{transaction.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">New Transaction</h2>
                <button
                  onClick={closeModal}
                  className="text-text-muted hover:text-text-primary text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Product <span className="text-danger">*</span>
                  </label>
                  <select
                    name="product"
                    value={formData.product}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} - {product.sku} (Stock: {product.quantity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Type <span className="text-danger">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="IN"
                        checked={formData.type === 'IN'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-success font-medium">Stock IN</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="OUT"
                        checked={formData.type === 'OUT'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-danger font-medium">Stock OUT</span>
                    </label>
                  </div>
                </div>

                <Input
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="1"
                />

                <div className="mb-4">
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter transaction notes..."
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <Button type="button" variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Record Transaction
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Transactions;
