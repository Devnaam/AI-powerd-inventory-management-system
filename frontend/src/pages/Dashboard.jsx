import { useState, useEffect } from 'react';
import api from '../utils/api';
import Card from '../components/common/Card';
import Layout from '../components/layout/Layout';
import toast from 'react-hot-toast';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [stockStatusData, setStockStatusData] = useState([]);

  const COLORS = {
    primary: '#1E40AF',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    accent: '#7C3AED',
    info: '#0EA5E9'
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, productsRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/products')
      ]);
      
      setStats(dashboardRes.data.data);
      processChartData(productsRes.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (products) => {
    // Category-wise product count
    const categoryMap = {};
    const statusMap = { inStock: 0, lowStock: 0, outOfStock: 0 };

    products.forEach(product => {
      // Category data
      categoryMap[product.category] = (categoryMap[product.category] || 0) + 1;

      // Stock status data
      if (product.quantity === 0) {
        statusMap.outOfStock++;
      } else if (product.quantity <= product.reorderLevel) {
        statusMap.lowStock++;
      } else {
        statusMap.inStock++;
      }
    });

    // Format for charts
    const categoryChartData = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      count: value
    }));

    const statusChartData = [
      { name: 'In Stock', value: statusMap.inStock, color: COLORS.success },
      { name: 'Low Stock', value: statusMap.lowStock, color: COLORS.warning },
      { name: 'Out of Stock', value: statusMap.outOfStock, color: COLORS.danger }
    ];

    setCategoryData(categoryChartData);
    setStockStatusData(statusChartData);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Products</p>
                <p className="text-3xl font-bold text-primary">{stats?.totalProducts || 0}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Stock Value</p>
                <p className="text-3xl font-bold text-success">₹{stats?.totalStockValue?.toLocaleString() || 0}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Low Stock Items</p>
                <p className="text-3xl font-bold text-warning">{stats?.lowStockCount || 0}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Out of Stock</p>
                <p className="text-3xl font-bold text-danger">{stats?.outOfStockCount || 0}</p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution Bar Chart */}
          <Card title="Products by Category">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Stock Status Pie Chart */}
          <Card title="Stock Status Overview">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Today's Activity & Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Today's Activity">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-text-secondary">Stock In</span>
                <span className="text-xl font-bold text-success">+{stats?.todayStockIn || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-text-secondary">Stock Out</span>
                <span className="text-xl font-bold text-danger">-{stats?.todayStockOut || 0}</span>
              </div>
            </div>
          </Card>

          <Card title="Low Stock Alert" className="border-l-4 border-warning">
            {stats?.lowStockItems?.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {stats.lowStockItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                    <div>
                      <p className="font-medium text-text-primary">{item.name}</p>
                      <p className="text-sm text-text-muted">{item.sku}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-warning font-bold text-lg">{item.quantity}</span>
                      <p className="text-xs text-text-muted">Reorder: {item.reorderLevel}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-text-muted">All products are well stocked</p>
              </div>
            )}
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card title="Recent Transactions">
          {stats?.recentTransactions?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-text-secondary text-sm">Product</th>
                    <th className="text-left py-2 text-text-secondary text-sm">Type</th>
                    <th className="text-left py-2 text-text-secondary text-sm">Quantity</th>
                    <th className="text-left py-2 text-text-secondary text-sm">Performed By</th>
                    <th className="text-left py-2 text-text-secondary text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions.map((transaction) => (
                    <tr key={transaction._id} className="border-b border-border hover:bg-gray-50">
                      <td className="py-3 font-medium">{transaction.product?.name}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td>{transaction.quantity}</td>
                      <td className="text-text-muted">{transaction.performedBy?.name}</td>
                      <td className="text-text-muted text-sm">
                        {new Date(transaction.transactionDate).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-text-muted text-center py-4">No recent transactions</p>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
