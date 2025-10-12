import requests
import os
from datetime import datetime, timedelta

class AIEngine:
    def __init__(self, backend_url):
        self.backend_url = backend_url
    
    def get_headers(self, token):
        return {"Authorization": f"Bearer {token}"}
    
    def fetch_products(self, token):
        """Fetch all products from backend"""
        try:
            response = requests.get(
                f"{self.backend_url}/products",
                headers=self.get_headers(token)
            )
            if response.status_code == 200:
                return response.json().get('data', [])
            return []
        except Exception as e:
            print(f"Error fetching products: {e}")
            return []
    
    def fetch_transactions(self, token, days=30):
        """Fetch recent transactions"""
        try:
            start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
            response = requests.get(
                f"{self.backend_url}/transactions?startDate={start_date}",
                headers=self.get_headers(token)
            )
            if response.status_code == 200:
                return response.json().get('data', [])
            return []
        except Exception as e:
            print(f"Error fetching transactions: {e}")
            return []
    
    def analyze_query(self, query, token):
        """Analyze user query and generate response"""
        query_lower = query.lower()
        
        # Fetch data
        products = self.fetch_products(token)
        transactions = self.fetch_transactions(token)
        
        # Low stock queries
        if any(word in query_lower for word in ['low stock', 'running out', 'shortage']):
            return self.handle_low_stock(products)
        
        # Out of stock queries
        if any(word in query_lower for word in ['out of stock', 'no stock']):
            return self.handle_out_of_stock(products)
        
        # Most sold/popular products
        if any(word in query_lower for word in ['most sold', 'popular', 'top selling']):
            return self.handle_most_sold(transactions)
        
        # Stock value queries
        if any(word in query_lower for word in ['stock value', 'total value', 'inventory value']):
            return self.handle_stock_value(products)
        
        # Category queries
        if 'category' in query_lower or 'categories' in query_lower:
            return self.handle_category_info(products)
        
        # Supplier queries
        if 'supplier' in query_lower or 'vendor' in query_lower:
            return self.handle_supplier_info(products, transactions)
        
        # Fastest moving products
        if any(word in query_lower for word in ['fastest', 'quick', 'moving fast']):
            return self.handle_fastest_moving(transactions)
        
        # Default response
        return self.handle_general_stats(products, transactions)
    
    def handle_low_stock(self, products):
        """Handle low stock queries"""
        low_stock = [p for p in products if 0 < p['quantity'] <= p['reorderLevel']]
        
        if not low_stock:
            return {
                "answer": "Great news! No products are currently at low stock levels. All inventory is well maintained.",
                "data": []
            }
        
        low_stock.sort(key=lambda x: x['quantity'])
        top_5 = low_stock[:5]
        
        answer = f"⚠️ **{len(low_stock)} products** are running low on stock:\n\n"
        for i, product in enumerate(top_5, 1):
            answer += f"{i}. **{product['name']}** (SKU: {product['sku']})\n"
            answer += f"   - Current Stock: **{product['quantity']}** | Reorder Level: {product['reorderLevel']}\n\n"
        
        if len(low_stock) > 5:
            answer += f"...and {len(low_stock) - 5} more items.\n\n"
        
        answer += "💡 **Recommendation:** Place orders soon to avoid stockouts!"
        
        return {"answer": answer, "data": top_5}
    
    def handle_out_of_stock(self, products):
        """Handle out of stock queries"""
        out_of_stock = [p for p in products if p['quantity'] == 0]
        
        if not out_of_stock:
            return {
                "answer": "✅ Excellent! No products are out of stock. Your inventory is fully stocked.",
                "data": []
            }
        
        answer = f"❌ **{len(out_of_stock)} products** are currently out of stock:\n\n"
        for i, product in enumerate(out_of_stock[:5], 1):
            answer += f"{i}. **{product['name']}** (SKU: {product['sku']})\n"
            answer += f"   - Supplier: {product['supplier']}\n\n"
        
        answer += "🚨 **Action Required:** Reorder these items immediately!"
        
        return {"answer": answer, "data": out_of_stock[:5]}
    
    def handle_most_sold(self, transactions):
        """Handle most sold product queries"""
        if not transactions:
            return {"answer": "No transaction data available yet.", "data": []}
        
        # Count OUT transactions per product
        product_sales = {}
        for trans in transactions:
            if trans['type'] == 'OUT' and trans.get('product'):
                prod_id = trans['product']['_id']
                prod_name = trans['product']['name']
                if prod_id not in product_sales:
                    product_sales[prod_id] = {'name': prod_name, 'quantity': 0}
                product_sales[prod_id]['quantity'] += trans['quantity']
        
        if not product_sales:
            return {"answer": "No sales recorded yet.", "data": []}
        
        sorted_products = sorted(product_sales.values(), key=lambda x: x['quantity'], reverse=True)
        top_5 = sorted_products[:5]
        
        answer = f"📈 **Top {len(top_5)} Best-Selling Products:**\n\n"
        for i, product in enumerate(top_5, 1):
            answer += f"{i}. **{product['name']}** - Sold: **{product['quantity']} units**\n"
        
        return {"answer": answer, "data": top_5}
    
    def handle_stock_value(self, products):
        """Calculate total stock value"""
        if not products:
            return {"answer": "No products in inventory.", "data": []}
        
        total_value = sum(p['price'] * p['quantity'] for p in products)
        total_items = sum(p['quantity'] for p in products)
        
        answer = f"💰 **Total Inventory Value:** ₹{total_value:,.2f}\n\n"
        answer += f"📦 **Total Items in Stock:** {total_items:,}\n"
        answer += f"📊 **Total Products:** {len(products)}\n"
        answer += f"📈 **Average Value per Product:** ₹{total_value/len(products):,.2f}"
        
        return {
            "answer": answer,
            "data": {
                "total_value": total_value,
                "total_items": total_items,
                "total_products": len(products)
            }
        }
    
    def handle_category_info(self, products):
        """Handle category information queries"""
        categories = {}
        for product in products:
            cat = product['category']
            if cat not in categories:
                categories[cat] = {'count': 0, 'value': 0}
            categories[cat]['count'] += 1
            categories[cat]['value'] += product['price'] * product['quantity']
        
        sorted_cats = sorted(categories.items(), key=lambda x: x[1]['count'], reverse=True)
        
        answer = f"📁 **Inventory by Category:**\n\n"
        for cat, data in sorted_cats:
            answer += f"• **{cat}**: {data['count']} products | Value: ₹{data['value']:,.2f}\n"
        
        return {"answer": answer, "data": dict(sorted_cats)}
    
    def handle_supplier_info(self, products, transactions):
        """Handle supplier information queries"""
        suppliers = {}
        for product in products:
            sup = product['supplier']
            if sup not in suppliers:
                suppliers[sup] = {'products': 0, 'stock_value': 0}
            suppliers[sup]['products'] += 1
            suppliers[sup]['stock_value'] += product['price'] * product['quantity']
        
        sorted_suppliers = sorted(suppliers.items(), key=lambda x: x[1]['products'], reverse=True)
        
        answer = f"🏢 **Suppliers Overview:**\n\n"
        for i, (supplier, data) in enumerate(sorted_suppliers[:5], 1):
            answer += f"{i}. **{supplier}**\n"
            answer += f"   - Products: {data['products']} | Value: ₹{data['stock_value']:,.2f}\n\n"
        
        return {"answer": answer, "data": dict(sorted_suppliers)}
    
    def handle_fastest_moving(self, transactions):
        """Identify fastest moving products"""
        if not transactions:
            return {"answer": "No transaction data available.", "data": []}
        
        # Recent 7 days OUT transactions
        recent_date = datetime.now() - timedelta(days=7)
        product_movement = {}
        
        for trans in transactions:
            if trans['type'] == 'OUT' and trans.get('product'):
                trans_date = datetime.fromisoformat(trans['transactionDate'].replace('Z', '+00:00'))
                if trans_date >= recent_date:
                    prod_id = trans['product']['_id']
                    prod_name = trans['product']['name']
                    if prod_id not in product_movement:
                        product_movement[prod_id] = {'name': prod_name, 'quantity': 0}
                    product_movement[prod_id]['quantity'] += trans['quantity']
        
        if not product_movement:
            return {"answer": "No recent sales in the last 7 days.", "data": []}
        
        sorted_products = sorted(product_movement.values(), key=lambda x: x['quantity'], reverse=True)
        top_3 = sorted_products[:3]
        
        answer = f"🚀 **Fastest Moving Products (Last 7 Days):**\n\n"
        for i, product in enumerate(top_3, 1):
            answer += f"{i}. **{product['name']}** - {product['quantity']} units moved\n"
        
        return {"answer": answer, "data": top_3}
    
    def handle_general_stats(self, products, transactions):
        """Provide general inventory statistics"""
        total_products = len(products)
        low_stock = sum(1 for p in products if 0 < p['quantity'] <= p['reorderLevel'])
        out_of_stock = sum(1 for p in products if p['quantity'] == 0)
        total_value = sum(p['price'] * p['quantity'] for p in products)
        
        recent_trans = len([t for t in transactions if 
                           datetime.fromisoformat(t['transactionDate'].replace('Z', '+00:00')) >= 
                           datetime.now() - timedelta(days=7)])
        
        answer = f"📊 **Inventory Overview:**\n\n"
        answer += f"• **Total Products:** {total_products}\n"
        answer += f"• **Low Stock Items:** {low_stock}\n"
        answer += f"• **Out of Stock:** {out_of_stock}\n"
        answer += f"• **Total Value:** ₹{total_value:,.2f}\n"
        answer += f"• **Recent Transactions (7 days):** {recent_trans}\n\n"
        answer += "💡 Ask me about:\n"
        answer += "- Low stock items\n"
        answer += "- Best selling products\n"
        answer += "- Category breakdown\n"
        answer += "- Supplier information"
        
        return {"answer": answer, "data": {}}
