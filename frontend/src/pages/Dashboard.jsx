import { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/layout/Layout';
import toast from 'react-hot-toast';
import StatCard from '../components/dashboard/StatCard';
import CategoryChart from '../components/dashboard/CategoryChart';
import StockStatusChart from '../components/dashboard/StockStatusChart';
import TrendChart from '../components/dashboard/TrendChart';
import TopProducts from '../components/dashboard/TopProducts';
import LowStockAlert from '../components/dashboard/LowStockAlert';
import RecentActivity from '../components/dashboard/RecentActivity';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import QuickActions from '../components/dashboard/QuickActions';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, productsRes, transactionsRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/products'),
        api.get('/transactions')
      ]);
      
      setStats(dashboardRes.data.data);
      setProducts(productsRes.data.data);
      setTransactions(transactionsRes.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryData = () => {
    const categoryMap = {};
    products.forEach(product => {
      categoryMap[product.category] = (categoryMap[product.category] || 0) + 1;
    });
    return Object.entries(categoryMap).map(([name, count]) => ({ name, count }));
  };

  const getStockStatusData = () => {
    const statusMap = { inStock: 0, lowStock: 0, outOfStock: 0 };
    products.forEach(product => {
      if (product.quantity === 0) statusMap.outOfStock++;
      else if (product.quantity <= product.reorderLevel) statusMap.lowStock++;
      else statusMap.inStock++;
    });
    return [
      { name: 'In Stock', value: statusMap.inStock, color: '#10B981' },
      { name: 'Low Stock', value: statusMap.lowStock, color: '#F59E0B' },
      { name: 'Out of Stock', value: statusMap.outOfStock, color: '#EF4444' }
    ];
  };

  const getTrendData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        stockIn: 0,
        stockOut: 0
      };
    });

    transactions.forEach(t => {
      const transDate = new Date(t.transactionDate);
      const diffDays = Math.floor((new Date() - transDate) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        const index = 6 - diffDays;
        if (t.type === 'IN') last7Days[index].stockIn += t.quantity;
        else last7Days[index].stockOut += t.quantity;
      }
    });

    return last7Days;
  };

  const getTopProducts = () => {
    return products
      .map(p => ({ ...p, value: p.price * p.quantity }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 border-navy-200 border-t-navy-900 rounded-full animate-spin"></div>
          <p className="text-navy-600 mt-4 font-medium">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy-900 mb-1">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-navy-500">Here's what's happening with your inventory today</p>
          </div>
          <QuickActions />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            trend="up"
            trendValue="+12%"
            color="blue"
          />
          <StatCard
            title="Stock Value"
            value={`₹${(stats?.totalStockValue || 0).toLocaleString()}`}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            trend="up"
            trendValue="+8%"
            color="green"
          />
          <StatCard
            title="Low Stock"
            value={stats?.lowStockCount || 0}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            trend="down"
            trendValue="-3%"
            color="amber"
          />
          <StatCard
            title="Out of Stock"
            value={stats?.outOfStockCount || 0}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
            trend="down"
            trendValue="-5%"
            color="red"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart data={getCategoryData()} />
          <StockStatusChart data={getStockStatusData()} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TrendChart data={getTrendData()} />
          </div>
          <TopProducts products={getTopProducts()} />
        </div>

        {/* Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity stats={stats} />
          <LowStockAlert items={stats?.lowStockItems || []} />
        </div>

        {/* Transactions */}
        <RecentTransactions transactions={stats?.recentTransactions || []} />
      </div>
    </Layout>
  );
};

export default Dashboard;
