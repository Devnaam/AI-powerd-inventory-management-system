import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import api from "../utils/api";
import toast from "react-hot-toast";

// Transaction Modal Component (inline for brevity)
// Transaction Modal Component (inline for brevity)
const TransactionModal = ({ product, onClose, onSuccess }) => {
	const [type, setType] = useState("IN");
	const [quantity, setQuantity] = useState("");
	const [reference, setReference] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await api.post(`/transactions`, {
				product: product._id, // ✅ Changed from productId to product
				type,
				quantity: Number(quantity),
				notes: reference, // ✅ Changed from reference to notes
			});
			toast.success("Transaction recorded!");
			onSuccess();
		} catch (err) {
			console.error("Transaction error:", err);
			toast.error("Failed to record transaction");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
			<div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 space-y-5">
				<div className="flex justify-between items-center mb-2">
					<h3 className="font-bold text-lg">Perform Transaction</h3>
					<button className="p-2" onClick={onClose}>
						<svg
							className="w-5 h-5 text-gray-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M6 18L18 6M6 6l12 12"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
							/>
						</svg>
					</button>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="flex gap-4">
						<Button
							type="button"
							variant={type === "IN" ? "primary" : "secondary"}
							onClick={() => setType("IN")}
						>
							Stock IN
						</Button>
						<Button
							type="button"
							variant={type === "OUT" ? "primary" : "secondary"}
							onClick={() => setType("OUT")}
						>
							Stock OUT
						</Button>
					</div>
					<Input
						label="Quantity"
						type="number"
						value={quantity}
						onChange={(e) => setQuantity(e.target.value)}
						required
						min={1}
					/>
					<Input
						label="Reference (optional)"
						value={reference}
						onChange={(e) => setReference(e.target.value)}
					/>
					<div className="flex gap-2 justify-end">
						<Button variant="secondary" type="button" onClick={onClose}>
							Cancel
						</Button>
						<Button variant="primary" type="submit" loading={loading}>
							{type === "IN" ? "Add Stock" : "Remove Stock"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

const ProductDetails = () => {
	const { productId } = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const [editing, setEditing] = useState(false);
	const [editData, setEditData] = useState({});
	const [loading, setLoading] = useState(true);
	const [saveLoading, setSaveLoading] = useState(false);

	// Transactions State
	const [transactions, setTransactions] = useState([]);
	const [showTxnModal, setShowTxnModal] = useState(false);

	useEffect(() => {
		fetchProduct();
		// eslint-disable-next-line
	}, [productId]);

	const fetchProduct = async () => {
		setLoading(true);
		try {
			const res = await api.get(`/products/${productId}`);
			setProduct(res.data.data);
			setEditData(res.data.data);
			fetchProductTransactions(res.data.data._id);
		} catch (error) {
			toast.error("Product not found");
			navigate("/products");
		} finally {
			setLoading(false);
		}
	};

	const fetchProductTransactions = async (id) => {
		try {
			// You may need to adjust your backend to handle this query!
			const res = await api.get(`/transactions?productId=${id || productId}`);
			setTransactions(res.data.data);
		} catch (err) {
			setTransactions([]);
		}
	};

	const handleEditChange = (e) => {
		setEditData({ ...editData, [e.target.name]: e.target.value });
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		setSaveLoading(true);
		try {
			await api.put(`/products/${productId}`, {
				...editData,
				price: Number(editData.price),
				quantity: Number(editData.quantity),
				reorderLevel: Number(editData.reorderLevel),
			});
			toast.success("Product updated!");
			setEditing(false);
			fetchProduct();
		} catch {
			toast.error("Failed to update. Please try again.");
		} finally {
			setSaveLoading(false);
		}
	};

	if (loading)
		return (
			<div className="flex items-center justify-center h-64">
				<div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
			</div>
		);

	if (!product) return null;

	return (
		<div className="max-w-3xl mx-auto py-8 space-y-6">
			{/* Breadcrumb or back */}
			<div>
				<Button
					variant="secondary"
					size="sm"
					onClick={() => navigate("/products")}
				>
					← Back to Products
				</Button>
			</div>
			{/* Card */}
			<Card>
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
					{!editing && (
						<Button variant="primary" onClick={() => setEditing(true)}>
							Edit
						</Button>
					)}
				</div>

				{/* Product Fields or Edit form */}
				{!editing ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<div className="mb-2 text-gray-500 text-xs">Name</div>
							<div className="text-lg font-medium">{product.name}</div>
						</div>
						<div>
							<div className="mb-2 text-gray-500 text-xs">SKU</div>
							<div className="text-lg font-medium">{product.sku}</div>
						</div>
						<div>
							<div className="mb-2 text-gray-500 text-xs">Category</div>
							<div className="text-lg font-medium">{product.category}</div>
						</div>
						<div>
							<div className="mb-2 text-gray-500 text-xs">Price</div>
							<div className="text-lg font-medium">₹{product.price}</div>
						</div>
						<div>
							<div className="mb-2 text-gray-500 text-xs">Quantity</div>
							<div className="text-lg font-medium">{product.quantity}</div>
						</div>
						<div>
							<div className="mb-2 text-gray-500 text-xs">Reorder Level</div>
							<div className="text-lg font-medium">{product.reorderLevel}</div>
						</div>
						<div className="md:col-span-2">
							<div className="mb-2 text-gray-500 text-xs">Description</div>
							<div className="text-base text-gray-800">
								{product.description || "—"}
							</div>
						</div>
					</div>
				) : (
					<form onSubmit={handleEditSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								label="Name"
								name="name"
								value={editData.name}
								onChange={handleEditChange}
								required
							/>
							<Input
								label="SKU"
								name="sku"
								value={editData.sku}
								onChange={handleEditChange}
								required
							/>
							<Input
								label="Category"
								name="category"
								value={editData.category}
								onChange={handleEditChange}
								required
							/>
							<Input
								label="Price"
								name="price"
								type="number"
								value={editData.price}
								onChange={handleEditChange}
								required
							/>
							<Input
								label="Quantity"
								name="quantity"
								type="number"
								value={editData.quantity}
								onChange={handleEditChange}
								required
							/>
							<Input
								label="Reorder Level"
								name="reorderLevel"
								type="number"
								value={editData.reorderLevel}
								onChange={handleEditChange}
								required
							/>
						</div>
						<Input
							label="Description"
							name="description"
							value={editData.description}
							onChange={handleEditChange}
						/>
						<div className="flex gap-2 justify-end">
							<Button
								variant="secondary"
								type="button"
								onClick={() => setEditing(false)}
							>
								Cancel
							</Button>
							<Button variant="primary" type="submit" loading={saveLoading}>
								Save Changes
							</Button>
						</div>
					</form>
				)}
			</Card>

			{/* Product Transactions */}
			<Card>
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-xl font-bold text-gray-900">
						Product Transactions
					</h3>
					<Button variant="primary" onClick={() => setShowTxnModal(true)}>
						Perform Transaction
					</Button>
				</div>
				{transactions.length === 0 ? (
					<div className="text-gray-500 py-6 text-center">
						No transactions yet for this product.
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-gray-50">
									<th className="px-4 py-2">Date</th>
									<th className="px-4 py-2">Type</th>
									<th className="px-4 py-2">Quantity</th>
									<th className="px-4 py-2">By</th>
									<th className="px-4 py-2">Reference</th>
								</tr>
							</thead>
							<tbody>
								{transactions.map((txn) => (
									<tr key={txn._id} className="border-b">
										<td className="px-4 py-2">
											{new Date(txn.transactionDate).toLocaleString()}
										</td>
										<td className="px-4 py-2">
											<span
												className={`px-2 py-1 rounded-xl font-semibold ${
													txn.type === "IN"
														? "bg-green-100 text-green-700"
														: "bg-red-100 text-red-700"
												}`}
											>
												{txn.type}
											</span>
										</td>
										<td className="px-4 py-2 font-bold">{txn.quantity}</td>
										<td className="px-4 py-2">
											{txn.performedBy?.name || "-"}
										</td>
										<td className="px-4 py-2">{txn.reference || "-"}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Transaction Modal */}
				{showTxnModal && (
					<TransactionModal
						product={product}
						onClose={() => setShowTxnModal(false)}
						onSuccess={() => {
							setShowTxnModal(false);
							fetchProduct();
							fetchProductTransactions();
						}}
					/>
				)}
			</Card>
		</div>
	);
};

export default ProductDetails;
