import { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ProductModal from '../components/products/ProductModal';
import ProductTable from '../components/products/ProductTable';
import ProductCard from '../components/products/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useAuth();

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

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleModalSuccess = () => {
    fetchProducts();
    handleModalClose();
  };

  const canModify = ['admin', 'manager'].includes(user?.role);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Products</h1>
            <p className="text-text-muted text-sm mt-1">Manage your inventory products</p>
          </div>
          {canModify && (
            <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
              <span className="text-lg mr-2">+</span>
              Add Product
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card className="bg-gradient-to-r from-primary-light/10 to-accent/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted text-xl">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              <option value="">All Categories</option>
              <option value="Electronics">📱 Electronics</option>
              <option value="Furniture">🪑 Furniture</option>
              <option value="Food">🍔 Food</option>
              <option value="Clothing">👕 Clothing</option>
              <option value="Other">📦 Other</option>
            </select>
          </div>
        </Card>

        {/* Products Display */}
        {loading ? (
          <Card>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
              <p className="text-text-muted mt-4">Loading products...</p>
            </div>
          </Card>
        ) : products.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <div className="text-8xl mb-6">📦</div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">No products found</h3>
              <p className="text-text-muted mb-6">
                {search || category ? 'Try adjusting your filters' : 'Start by adding your first product'}
              </p>
              {canModify && !search && !category && (
                <Button onClick={() => setShowModal(true)}>
                  <span className="text-lg mr-2">+</span>
                  Add Your First Product
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canModify={canModify}
                userRole={user?.role}
              />
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canModify={canModify}
                  userRole={user?.role}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </Layout>
  );
};

export default Products;
