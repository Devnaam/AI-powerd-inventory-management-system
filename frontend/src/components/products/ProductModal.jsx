import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const ProductModal = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    sku: '',
    category: '',
    price: '',
    quantity: '',
    supplier: '',
    reorderLevel: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        productId: product.productId,
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        supplier: product.supplier,
        reorderLevel: product.reorderLevel,
        description: product.description || ''
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product) {
        await api.put(`/products/${product._id}`, formData);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', formData);
        toast.success('Product created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary-light/10 to-accent/10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                {product ? '✏️ Edit Product' : '➕ Add New Product'}
              </h2>
              <p className="text-text-muted text-sm mt-1">
                {product ? 'Update product information' : 'Fill in the details to add a new product'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-danger text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 transition-all"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product ID */}
            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-2">
                Product ID <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                required
                disabled={product}
                placeholder="e.g., PROD001"
                className="w-full px-4 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-2">
                Product Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Laptop Dell XPS 15"
                className="w-full px-4 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-2">
                SKU <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                required
                disabled={product}
                placeholder="e.g., DELL-XPS-15-2024"
                className="w-full px-4 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-2">
                Category <span className="text-danger">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="">Select Category</option>
                <option value="Electronics">📱 Electronics</option>
                <option value="Furniture">🪑 Furniture</option>
                <option value="Food">🍔 Food</option>
                <option value="Clothing">👕 Clothing</option>
                <option value="Other">📦 Other</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-2">
                Price (₹) <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted font-semibold">
                  ₹
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="1500"
                  className="w-full pl-8 pr-4 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-2">
                Quantity <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="50"
                className="w-full px-4 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-2">
                Supplier <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                required
                placeholder="e.g., Dell Inc."
                className="w-full px-4 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Reorder Level */}
            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-2">
                Reorder Level <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="10"
                className="w-full px-4 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Description (Full Width) */}
          <div className="mt-4">
            <label className="block text-text-secondary text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Enter product description (optional)"
              className="w-full px-4 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full sm:w-auto"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {product ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                <span>{product ? '✓ Update Product' : '+ Create Product'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
