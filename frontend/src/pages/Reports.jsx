import { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import Layout from "../components/layout/Layout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Reports = () => {
	const [reportType, setReportType] = useState("inventory");
	const [dateRange, setDateRange] = useState("today");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [reportData, setReportData] = useState([]);
	const [loading, setLoading] = useState(false);

	const generateReport = async () => {
		setLoading(true);
		try {
			if (reportType === "inventory") {
				const response = await api.get("/products");
				setReportData(response.data.data);
			} else if (reportType === "transactions") {
				let url = "/transactions";
				if (dateRange === "custom" && startDate && endDate) {
					url += `?startDate=${startDate}&endDate=${endDate}`;
				} else if (dateRange === "today") {
					const today = new Date().toISOString().split("T")[0];
					url += `?startDate=${today}&endDate=${today}`;
				} else if (dateRange === "week") {
					const today = new Date();
					const weekAgo = new Date(today.setDate(today.getDate() - 7))
						.toISOString()
						.split("T")[0];
					url += `?startDate=${weekAgo}`;
				} else if (dateRange === "month") {
					const today = new Date();
					const monthAgo = new Date(today.setMonth(today.getMonth() - 1))
						.toISOString()
						.split("T")[0];
					url += `?startDate=${monthAgo}`;
				}
				const response = await api.get(url);
				setReportData(response.data.data);
			}
			toast.success("Report generated successfully");
		} catch (error) {
			toast.error("Failed to generate report");
		} finally {
			setLoading(false);
		}
	};

	const exportToCSV = () => {
		if (reportData.length === 0) {
			toast.error("No data to export");
			return;
		}

		let csvContent = "";

		if (reportType === "inventory") {
			// Headers
			csvContent =
				"Product ID,Name,SKU,Category,Price,Quantity,Supplier,Reorder Level,Status\n";

			// Data
			reportData.forEach((item) => {
				const status =
					item.quantity === 0
						? "Out of Stock"
						: item.quantity <= item.reorderLevel
						? "Low Stock"
						: "In Stock";
				csvContent += `${item.productId},"${item.name}",${item.sku},${item.category},${item.price},${item.quantity},"${item.supplier}",${item.reorderLevel},${status}\n`;
			});
		} else if (reportType === "transactions") {
			// Headers
			csvContent = "Date,Product,SKU,Type,Quantity,Performed By,Notes\n";

			// Data
			reportData.forEach((item) => {
				const date = new Date(item.transactionDate).toLocaleDateString("en-IN");
				csvContent += `${date},"${item.product?.name}",${item.product?.sku},${
					item.type
				},${item.quantity},"${item.performedBy?.name}","${item.notes || ""}"\n`;
			});
		}

		// Create download
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`${reportType}_report_${new Date().toISOString().split("T")[0]}.csv`
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast.success("CSV exported successfully");
	};

	const exportToPDF = () => {
		if (reportData.length === 0) {
			toast.error("No data to export");
			return;
		}

		const doc = new jsPDF();

		// Title
		doc.setFontSize(18);
		doc.text(
			`${reportType === "inventory" ? "Inventory" : "Transaction"} Report`,
			14,
			20
		);

		// Date
		doc.setFontSize(10);
		doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, 14, 28);

		if (reportType === "inventory") {
			const tableData = reportData.map((item) => [
				item.productId,
				item.name,
				item.sku,
				item.category,
				`₹${item.price}`,
				item.quantity,
				item.quantity === 0
					? "Out of Stock"
					: item.quantity <= item.reorderLevel
					? "Low Stock"
					: "In Stock",
			]);

			doc.autoTable({
				startY: 35,
				head: [["ID", "Name", "SKU", "Category", "Price", "Qty", "Status"]],
				body: tableData,
				theme: "grid",
				headStyles: { fillColor: [30, 64, 175] },
				styles: { fontSize: 8 },
			});
		} else if (reportType === "transactions") {
			const tableData = reportData.map((item) => [
				new Date(item.transactionDate).toLocaleDateString("en-IN"),
				item.product?.name || "N/A",
				item.type,
				item.quantity,
				item.performedBy?.name || "N/A",
			]);

			doc.autoTable({
				startY: 35,
				head: [["Date", "Product", "Type", "Quantity", "Performed By"]],
				body: tableData,
				theme: "grid",
				headStyles: { fillColor: [30, 64, 175] },
				styles: { fontSize: 8 },
			});
		}

		doc.save(
			`${reportType}_report_${new Date().toISOString().split("T")[0]}.pdf`
		);
		toast.success("PDF exported successfully");
	};

	return (
		<Layout>
			<div className="space-y-6">
				<h1 className="text-3xl font-bold text-text-primary">Reports</h1>

				{/* Report Configuration */}
				<Card title="Generate Report">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{/* Report Type */}
						<div>
							<label className="block text-text-secondary text-sm font-medium mb-2">
								Report Type
							</label>
							<select
								value={reportType}
								onChange={(e) => setReportType(e.target.value)}
								className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
							>
								<option value="inventory">Inventory Report</option>
								<option value="transactions">Transaction Report</option>
							</select>
						</div>

						{/* Date Range (for transactions) */}
						{reportType === "transactions" && (
							<div>
								<label className="block text-text-secondary text-sm font-medium mb-2">
									Date Range
								</label>
								<select
									value={dateRange}
									onChange={(e) => setDateRange(e.target.value)}
									className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="today">Today</option>
									<option value="week">Last 7 Days</option>
									<option value="month">Last 30 Days</option>
									<option value="custom">Custom Range</option>
								</select>
							</div>
						)}

						{/* Custom Date Range */}
						{reportType === "transactions" && dateRange === "custom" && (
							<>
								<div>
									<label className="block text-text-secondary text-sm font-medium mb-2">
										Start Date
									</label>
									<input
										type="date"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
										className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
								<div>
									<label className="block text-text-secondary text-sm font-medium mb-2">
										End Date
									</label>
									<input
										type="date"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
										className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
							</>
						)}

						{/* Generate Button */}
						<div className="flex items-end">
							<Button onClick={generateReport} disabled={loading} fullWidth>
								{loading ? "Generating..." : "Generate Report"}
							</Button>
						</div>
					</div>
				</Card>

				{/* Export Options */}
				{reportData.length > 0 && (
					<Card>
						<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
							<div>
								<p className="text-lg font-semibold text-text-primary">
									Report Generated: {reportData.length} records
								</p>
								<p className="text-sm text-text-muted">
									Export this report in your preferred format
								</p>
							</div>
							<div className="flex gap-3">
								<Button onClick={exportToCSV} variant="success">
									📄 Export CSV
								</Button>
								<Button onClick={exportToPDF} variant="primary">
									📑 Export PDF
								</Button>
							</div>
						</div>
					</Card>
				)}

				{/* Report Preview */}
				{reportData.length > 0 && (
					<Card title="Report Preview">
						<div className="overflow-x-auto max-h-96">
							{reportType === "inventory" ? (
								<table className="w-full">
									<thead className="sticky top-0 bg-white">
										<tr className="border-b-2 border-border">
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												Product ID
											</th>
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												Name
											</th>
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												Category
											</th>
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												Price
											</th>
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												Quantity
											</th>
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												Status
											</th>
										</tr>
									</thead>
									<tbody>
										{reportData.map((item) => (
											<tr key={item._id} className="border-b border-border">
												<td className="py-3 px-2">{item.productId}</td>
												<td className="py-3 px-2 font-medium">{item.name}</td>
												<td className="py-3 px-2">{item.category}</td>
												<td className="py-3 px-2">
													₹{item.price.toLocaleString()}
												</td>
												<td className="py-3 px-2">{item.quantity}</td>
												<td className="py-3 px-2">
													<span
														className={`px-2 py-1 rounded-full text-xs font-medium ${
															item.quantity === 0
																? "bg-red-100 text-red-700"
																: item.quantity <= item.reorderLevel
																? "bg-amber-100 text-amber-700"
																: "bg-green-100 text-green-700"
														}`}
													>
														{item.quantity === 0
															? "Out of Stock"
															: item.quantity <= item.reorderLevel
															? "Low Stock"
															: "In Stock"}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<table className="w-full">
									<thead className="sticky top-0 bg-white">
										<tr className="border-b-2 border-border">
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												Date
											</th>
											<th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">
												Product
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
										</tr>
									</thead>
									<tbody>
										{reportData.map((item) => (
											<tr key={item._id} className="border-b border-border">
												<td className="py-3 px-2 text-sm">
													{new Date(item.transactionDate).toLocaleDateString(
														"en-IN"
													)}
												</td>
												<td className="py-3 px-2 font-medium">
													{item.product?.name}
												</td>
												<td className="py-3 px-2">
													<span
														className={`px-2 py-1 rounded text-xs font-medium ${
															item.type === "IN"
																? "bg-green-100 text-green-700"
																: "bg-red-100 text-red-700"
														}`}
													>
														{item.type}
													</span>
												</td>
												<td className="py-3 px-2">{item.quantity}</td>
												<td className="py-3 px-2">{item.performedBy?.name}</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</Card>
				)}
			</div>
		</Layout>
	);
};

export default Reports;
