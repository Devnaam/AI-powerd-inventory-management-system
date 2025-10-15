import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import Layout from "../components/layout/Layout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import toast from "react-hot-toast";

// Add keyframes for fade-in animation
const fadeInStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
`;

// Add styles to head
if (typeof document !== "undefined") {
	const style = document.createElement("style");
	style.textContent = fadeInStyles;
	document.head.appendChild(style);
}

const Transactions = () => {
	const [transactions, setTransactions] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [filterType, setFilterType] = useState("");

	const [formData, setFormData] = useState({
		product: "",
		type: "IN",
		quantity: "",
		notes: "",
	});

	const fetchTransactions = useCallback(async () => {
		try {
			const params = filterType ? `?type=${filterType}` : "";
			const response = await api.get(`/transactions${params}`);
			setTransactions(response.data.data);
		} catch {
			toast.error("Failed to load transactions");
		} finally {
			setLoading(false);
		}
	}, [filterType]);

	const fetchProducts = useCallback(async () => {
		try {
			const response = await api.get("/products");
			setProducts(response.data.data);
		} catch {
			toast.error("Failed to load products");
		}
	}, []);

	useEffect(() => {
		fetchTransactions();
		fetchProducts();
	}, [fetchTransactions, fetchProducts]);

	const handleInputChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await api.post("/transactions", formData);
			toast.success("Transaction recorded successfully");
			closeModal();
			fetchTransactions();
		} catch (error) {
			toast.error(error.response?.data?.message || "Transaction failed");
		}
	};

	const closeModal = () => {
		setShowModal(false);
		setFormData({
			product: "",
			type: "IN",
			quantity: "",
			notes: "",
		});
	};

	return (
		<Layout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<h1 className="text-3xl font-bold text-text-primary">Transactions</h1>
					<Button onClick={() => setShowModal(true)}>+ New Transaction</Button>
				</div>

				{/* Filters */}
				<Card>
					<div className="flex flex-wrap gap-2 sm:gap-4">
						<button
							onClick={() => setFilterType("")}
							className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow ${
								filterType === ""
									? "bg-primary text-white shadow-primary/20"
									: "bg-gray-100 hover:bg-gray-200 text-text-primary"
							}`}
						>
							All
						</button>
						<button
							onClick={() => setFilterType("IN")}
							className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow ${
								filterType === "IN"
									? "bg-success text-white shadow-success/20"
									: "bg-gray-100 hover:bg-gray-200 text-text-primary"
							}`}
						>
							Stock IN
						</button>
						<button
							onClick={() => setFilterType("OUT")}
							className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow ${
								filterType === "OUT"
									? "bg-danger text-white shadow-danger/20"
									: "bg-gray-100 hover:bg-gray-200 text-text-primary"
							}`}
						>
							Stock OUT
						</button>
					</div>
				</Card>

				{/* Transactions List/Table */}
				<Card>
					{loading ? (
						<div className="space-y-4">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="animate-pulse">
									<div className="h-24 bg-gray-100 rounded-lg"></div>
								</div>
							))}
						</div>
					) : transactions.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-text-muted">No transactions found</p>
							<Button
								onClick={() => setShowModal(true)}
								variant="primary"
								className="mt-4"
							>
								Create New Transaction
							</Button>
						</div>
					) : (
						<>
							{/* Mobile View */}
							<div className="block md:hidden space-y-4">
								{transactions.map((transaction) => (
									<div
										key={transaction._id}
										className="bg-gray-50/50 rounded-lg p-4 space-y-3 border border-gray-100"
									>
										<div className="flex justify-between items-start gap-2">
											<div>
												<h3 className="font-semibold text-text-primary">
													{transaction.product?.name}
												</h3>
												<p className="text-sm text-text-muted">
													{transaction.product?.sku}
												</p>
											</div>
											<span
												className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
													transaction.type === "IN"
														? "bg-green-100 text-green-700"
														: "bg-red-100 text-red-700"
												}`}
											>
												{transaction.type}
											</span>
										</div>

										<div className="grid grid-cols-2 gap-3 text-sm">
											<div>
												<p className="text-text-muted">Quantity</p>
												<p className="font-semibold">{transaction.quantity}</p>
											</div>
											<div>
												<p className="text-text-muted">Date</p>
												<p>
													{new Date(
														transaction.transactionDate
													).toLocaleDateString("en-IN")}
												</p>
											</div>
											<div>
												<p className="text-text-muted">Time</p>
												<p>
													{new Date(
														transaction.transactionDate
													).toLocaleTimeString("en-IN")}
												</p>
											</div>
											<div>
												<p className="text-text-muted">By</p>
												<p>{transaction.performedBy?.name}</p>
											</div>
										</div>

										{transaction.notes && (
											<div className="text-sm">
												<p className="text-text-muted">Notes</p>
												<p className="text-text-primary">{transaction.notes}</p>
											</div>
										)}
									</div>
								))}
							</div>

							{/* Desktop View */}
							<div className="hidden md:block overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-border">
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												Date
											</th>
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												Product
											</th>
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												SKU
											</th>
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												Type
											</th>
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												Quantity
											</th>
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												Performed By
											</th>
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												Notes
											</th>
										</tr>
									</thead>
									<tbody>
										{transactions.map((transaction) => (
											<tr
												key={transaction._id}
												className="border-b border-border hover:bg-gray-50/50 transition-colors"
											>
												<td className="py-3 px-2 text-sm">
													{new Date(
														transaction.transactionDate
													).toLocaleDateString("en-IN")}
													<br />
													<span className="text-text-muted text-xs">
														{new Date(
															transaction.transactionDate
														).toLocaleTimeString("en-IN")}
													</span>
												</td>
												<td className="py-3 px-2 font-medium">
													{transaction.product?.name}
												</td>
												<td className="py-3 px-2 text-text-muted">
													{transaction.product?.sku}
												</td>
												<td className="py-3 px-2">
													<span
														className={`px-3 py-1 rounded-full text-xs font-medium ${
															transaction.type === "IN"
																? "bg-green-100 text-green-700"
																: "bg-red-100 text-red-700"
														}`}
													>
														{transaction.type}
													</span>
												</td>
												<td className="py-3 px-2 font-semibold">
													{transaction.quantity}
												</td>
												<td className="py-3 px-2">
													{transaction.performedBy?.name}
												</td>
												<td className="py-3 px-2 text-text-muted text-sm">
													{transaction.notes || "-"}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</>
					)}
				</Card>
			</div>

			{/* Transaction Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
					<div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-fadeIn">
						<div className="p-4 sm:p-6">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-xl sm:text-2xl font-bold text-text-primary">
									New Transaction
								</h2>
								<button
									onClick={closeModal}
									className="text-text-muted hover:text-text-primary text-2xl transition-colors"
								>
									×
								</button>
							</div>

							<form onSubmit={handleSubmit}>
								<div className="space-y-5">
									<div>
										<label className="block text-text-secondary text-sm font-medium mb-2">
											Product <span className="text-danger">*</span>
										</label>
										<select
											name="product"
											value={formData.product}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow bg-gray-50/50"
										>
											<option value="">Select Product</option>
											{products.map((product) => (
												<option key={product._id} value={product._id}>
													{product.name} - {product.sku} (Stock:{" "}
													{product.quantity})
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="block text-text-secondary text-sm font-medium mb-2">
											Type <span className="text-danger">*</span>
										</label>
										<div className="flex flex-wrap gap-4">
											<label className="flex-1 sm:flex-none">
												<input
													type="radio"
													name="type"
													value="IN"
													checked={formData.type === "IN"}
													onChange={handleInputChange}
													className="hidden peer"
												/>
												<div className="flex items-center justify-center px-4 py-2.5 border-2 border-success/20 bg-success/5 rounded-lg peer-checked:bg-success peer-checked:text-white cursor-pointer transition-all hover:shadow-sm">
													<span className="font-medium">Stock IN</span>
												</div>
											</label>
											<label className="flex-1 sm:flex-none">
												<input
													type="radio"
													name="type"
													value="OUT"
													checked={formData.type === "OUT"}
													onChange={handleInputChange}
													className="hidden peer"
												/>
												<div className="flex items-center justify-center px-4 py-2.5 border-2 border-danger/20 bg-danger/5 rounded-lg peer-checked:bg-danger peer-checked:text-white cursor-pointer transition-all hover:shadow-sm">
													<span className="font-medium">Stock OUT</span>
												</div>
											</label>
										</div>
									</div>

									<div>
										<label className="block text-text-secondary text-sm font-medium mb-2">
											Quantity <span className="text-danger">*</span>
										</label>
										<input
											type="number"
											name="quantity"
											value={formData.quantity}
											onChange={handleInputChange}
											required
											min="1"
											className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow bg-gray-50/50"
											placeholder="Enter quantity"
										/>
									</div>

									<div>
										<label className="block text-text-secondary text-sm font-medium mb-2">
											Notes
										</label>
										<textarea
											name="notes"
											value={formData.notes}
											onChange={handleInputChange}
											rows="3"
											placeholder="Enter transaction notes..."
											className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow bg-gray-50/50 resize-none"
										/>
									</div>

									<div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
										<Button
											type="button"
											variant="secondary"
											onClick={closeModal}
											fullWidth
										>
											Cancel
										</Button>
										<Button type="submit" fullWidth>
											Record Transaction
										</Button>
									</div>
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
