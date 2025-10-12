import { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useAuth();

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

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      
      const response = await api.get(`/products?${params}`);
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
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
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', formData);
        toast.success('Product created successfully');
      }
      closeModal();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
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
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
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
  };

  const canModify = ['admin', 'manager'].includes(user?.role);

  const getStockBadge = (product) => {
    if (product.quantity === 0) {
      return <span className="px-2 py-1 bg-danger text-white text-xs rounded-full">Out of Stock</span>;
    }
    if (product.quantity <= product.reorderLevel) {
      return <span className="px-2 py-1 bg-warning text-white text-xs rounded-full">Low Stock</span>;
    }
    return <span className="px-2 py-1 bg-success text-white text-xs rounded-full">In Stock</span>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-text-primary">Products</h1>
          {canModify && (
            <Button onClick={() => setShowModal(true)}>
              + Add Product
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<span>🔍</span>}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Food">Food</option>
              <option value="Clothing">Clothing</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </Card>

        {/* Products Table */}
        <Card>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-text-muted py-8">No products found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Product ID</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Name</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">SKU</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Category</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Price</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Quantity</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Status</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-border hover:bg-gray-50">
                      <td className="py-3 px-2">{product.productId}</td>
                      <td className="py-3 px-2 font-medium">{product.name}</td>
                      <td className="py-3 px-2 text-text-muted">{product.sku}</td>
                      <td className="py-3 px-2">{product.category}</td>
                      <td className="py-3 px-2">₹{product.price.toLocaleString()}</td>
                      <td className="py-3 px-2">{product.quantity}</td>
                      <td className="py-3 px-2">{getStockBadge(product)}</td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          {canModify && (
                            <>
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-primary hover:text-primary-dark text-sm font-medium"
                              >
                                Edit
                              </button>
                              {user?.role === 'admin' && (
                                <button
                                  onClick={() => handleDelete(product._id)}
                                  className="text-danger hover:text-red-700 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-text-muted hover:text-text-primary text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Product ID"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    required
                    disabled={editingProduct}
                  />
                  <Input
                    label="Product Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="SKU"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                    disabled={editingProduct}
                  />
                  <div className="mb-4">
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Food">Food</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <Input
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Reorder Level"
                    name="reorderLevel"
                    type="number"
                    value={formData.reorderLevel}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <Button type="button" variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProduct ? 'Update Product' : 'Create Product'}
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

export default Products;
