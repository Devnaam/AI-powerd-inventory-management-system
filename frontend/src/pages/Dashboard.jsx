import { useState, useEffect } from "react";
import api from "../utils/api";
import Layout from "../components/layout/Layout";
import toast from "react-hot-toast";
import StatCard from "../components/dashboard/StatCard";
import CategoryChart from "../components/dashboard/CategoryChart";
import StockStatusChart from "../components/dashboard/StockStatusChart";
import TrendChart from "../components/dashboard/TrendChart";
import TopProducts from "../components/dashboard/TopProducts";
import LowStockAlert from "../components/dashboard/LowStockAlert";
import RecentActivity from "../components/dashboard/RecentActivity";
import RecentTransactions from "../components/dashboard/RecentTransactions";

import { useAuth } from "../context/AuthContext";

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
				api.get("/dashboard"),
				api.get("/products"),
				api.get("/transactions"),
			]);

			setStats(dashboardRes.data.data);
			setProducts(productsRes.data.data);
			setTransactions(transactionsRes.data.data);
		} catch (error) {
			toast.error("Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	};

	// Process chart data
	const getCategoryData = () => {
		const categoryMap = {};
		products.forEach((product) => {
			categoryMap[product.category] = (categoryMap[product.category] || 0) + 1;
		});
		return Object.entries(categoryMap).map(([name, count]) => ({
			name,
			count,
		}));
	};

	const getStockStatusData = () => {
		const statusMap = { inStock: 0, lowStock: 0, outOfStock: 0 };
		products.forEach((product) => {
			if (product.quantity === 0) statusMap.outOfStock++;
			else if (product.quantity <= product.reorderLevel) statusMap.lowStock++;
			else statusMap.inStock++;
		});
		return [
			{ name: "In Stock", value: statusMap.inStock, color: "#10B981" },
			{ name: "Low Stock", value: statusMap.lowStock, color: "#F59E0B" },
			{ name: "Out of Stock", value: statusMap.outOfStock, color: "#EF4444" },
		];
	};

	const getTrendData = () => {
		const last7Days = [...Array(7)].map((_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - (6 - i));
			return {
				day: date.toLocaleDateString("en-IN", { weekday: "short" }),
				stockIn: 0,
				stockOut: 0,
			};
		});

		transactions.forEach((t) => {
			const transDate = new Date(t.transactionDate);
			const diffDays = Math.floor(
				(new Date() - transDate) / (1000 * 60 * 60 * 24)
			);
			if (diffDays < 7) {
				const index = 6 - diffDays;
				if (t.type === "IN") last7Days[index].stockIn += t.quantity;
				else last7Days[index].stockOut += t.quantity;
			}
		});

		return last7Days;
	};

	const getTopProducts = () => {
		return products
			.map((p) => ({ ...p, value: p.price * p.quantity }))
			.sort((a, b) => b.value - a.value)
			.slice(0, 5);
	};

	if (loading) {
		return (
			<Layout>
				<div className="flex flex-col items-center justify-center h-screen">
					<div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
					<p className="text-text-muted mt-4 font-medium">
						Loading dashboard...
					</p>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="space-y-6">
				{/* Header with Welcome */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent">
							Welcome back, {user?.name}! 👋
						</h1>
						<p className="text-text-muted mt-1">
							Here's what's happening with your inventory today.
						</p>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<StatCard
						title="Total Products"
						value={stats?.totalProducts || 0}
						icon="📦"
						trend="up"
						trendValue="+12%"
						gradientFrom="from-blue-500"
						gradientTo="to-indigo-600"
						iconBg="from-blue-500 to-indigo-600"
					/>
					<StatCard
						title="Stock Value"
						value={`₹${(stats?.totalStockValue || 0).toLocaleString()}`}
						icon="💰"
						trend="up"
						trendValue="+8%"
						gradientFrom="from-emerald-500"
						gradientTo="to-teal-600"
						iconBg="from-emerald-500 to-teal-600"
					/>
					<StatCard
						title="Low Stock"
						value={stats?.lowStockCount || 0}
						icon="⚠️"
						trend="down"
						trendValue="-3%"
						gradientFrom="from-amber-500"
						gradientTo="to-orange-600"
						iconBg="from-amber-500 to-orange-600"
					/>
					<StatCard
						title="Out of Stock"
						value={stats?.outOfStockCount || 0}
						icon="❌"
						trend="down"
						trendValue="-5%"
						gradientFrom="from-red-500"
						gradientTo="to-rose-600"
						iconBg="from-red-500 to-rose-600"
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

				{/* Transactions Table */}
				<RecentTransactions transactions={stats?.recentTransactions || []} />
			</div>
		</Layout>
	);
};

export default Dashboard;
