import os
import requests
import google.generativeai as genai
from datetime import datetime, timedelta


class GeminiAIEngine:
    def __init__(self, backend_url):
        self.backend_url = backend_url
        self.api_key = os.getenv("GEMINI_API_KEY")
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        # System prompt for inventory context
        self.system_prompt = """You are an intelligent inventory management assistant. 
You help users manage their inventory by providing insights, analytics, and recommendations.
You have access to COMPLETE real-time inventory data including ALL products, stock levels, transactions, and suppliers.

When answering:
- Be concise and direct
- Use emojis to make responses friendly
- Provide actionable insights
- Format numbers clearly (use commas for thousands)
- When suggesting actions, be specific
- Always search through ALL products data provided
- If user asks about a specific product, search by name (case-insensitive)
- If user asks for recent transactions, provide the exact number requested
- When user asks to add/modify stock, explain they should use the transaction feature in the UI

Your tone should be professional yet friendly, like a helpful colleague."""


    def get_headers(self, token):
        return {"Authorization": f"Bearer {token}"}
    
    def fetch_inventory_data(self, token):
        """Fetch all relevant inventory data"""
        try:
            products_response = requests.get(
                f"{self.backend_url}/products",
                headers=self.get_headers(token),
                timeout=10
            )
            
            dashboard_response = requests.get(
                f"{self.backend_url}/dashboard",
                headers=self.get_headers(token),
                timeout=10
            )
            
            transactions_response = requests.get(
                f"{self.backend_url}/transactions",
                headers=self.get_headers(token),
                timeout=10
            )
            
            return {
                'products': products_response.json().get('data', []) if products_response.status_code == 200 else [],
                'dashboard': dashboard_response.json().get('data', {}) if dashboard_response.status_code == 200 else {},
                'transactions': transactions_response.json().get('data', []) if transactions_response.status_code == 200 else []
            }
        except Exception as e:
            print(f"Error fetching inventory data: {e}")
            return {'products': [], 'dashboard': {}, 'transactions': []}
    
    def format_transaction_line(self, t):
        """Format a single transaction line"""
        try:
            trans_date = datetime.fromisoformat(t.get('transactionDate', '').replace('Z', '+00:00'))
            date_str = trans_date.strftime('%Y-%m-%d %H:%M')
        except:
            date_str = 'Unknown date'
        
        product_name = t.get('product', {}).get('name', 'Unknown')
        performed_by = t.get('performedBy', {}).get('name', 'Unknown')
        trans_type = t.get('type', 'Unknown')
        quantity = t.get('quantity', 0)
        notes = t.get('notes', '')
        
        line = f"- {date_str}: {trans_type} {quantity} units of {product_name} by {performed_by}"
        if notes:
            line += f" (Notes: {notes})"
        
        return line
    
    def format_inventory_context(self, data):
        """Format COMPLETE inventory data for AI context"""
        products = data.get('products', [])
        dashboard = data.get('dashboard', {})
        transactions = data.get('transactions', [])
        
        # Product summary
        total_products = len(products)
        low_stock = [p for p in products if 0 < p.get('quantity', 0) <= p.get('reorderLevel', 0)]
        out_of_stock = [p for p in products if p.get('quantity', 0) == 0]
        
        # Calculate total stock value
        total_stock_value = sum(p.get('price', 0) * p.get('quantity', 0) for p in products)
        
        # Category breakdown
        categories = {}
        for p in products:
            cat = p.get('category', 'Other')
            if cat not in categories:
                categories[cat] = 0
            categories[cat] += 1
        
        # Build COMPLETE product list for AI
        all_products_list = "\n".join([
            f"- {p.get('name')} (SKU: {p.get('sku')})\n"
            f"  Category: {p.get('category')}, Price: ₹{p.get('price', 0):,.2f}, "
            f"Current Stock: {p.get('quantity')}, Reorder Level: {p.get('reorderLevel')}, "
            f"Status: {'OUT OF STOCK' if p.get('quantity', 0) == 0 else 'LOW STOCK' if p.get('quantity', 0) <= p.get('reorderLevel', 0) else 'IN STOCK'}"
            for p in products
        ])
        
        # Build COMPLETE transaction list (last 100)
        recent_transactions = transactions[:100]
        transactions_list = "\n".join([
            self.format_transaction_line(t) for t in recent_transactions
        ])
        
        context = f"""
=== COMPLETE INVENTORY DATABASE ===

SUMMARY STATISTICS:
- Total Products: {total_products}
- Total Stock Value: ₹{total_stock_value:,.2f}
- Low Stock Items: {len(low_stock)}
- Out of Stock Items: {len(out_of_stock)}
- Categories: {', '.join([f"{k} ({v})" for k, v in categories.items()])}

=== ALL PRODUCTS (Complete List) ===
{all_products_list}

=== LOW STOCK ALERTS ===
{chr(10).join([f"- {p.get('name')}: Current {p.get('quantity')} units (Reorder at: {p.get('reorderLevel')})" for p in low_stock]) if low_stock else 'None'}

=== OUT OF STOCK ITEMS ===
{chr(10).join([f"- {p.get('name')} (SKU: {p.get('sku')})" for p in out_of_stock]) if out_of_stock else 'None'}

=== RECENT TRANSACTIONS (Last {len(recent_transactions)}) ===
{transactions_list if transactions else 'No transactions recorded yet'}

IMPORTANT INSTRUCTIONS:
- When user asks about a product, search through ALL products listed above
- Product names are case-insensitive (e.g., "iphone 15 pro" matches "iPhone 15 Pro")
- When user asks for recent transactions, count from the transaction list above
- You can perform calculations and analysis on any product or transaction data
- Always provide specific numbers and product names from the data above
- If user asks to add stock or perform transactions, politely explain they should use the "Perform Transaction" button in the product details page
"""
        return context
    
    async def chat(self, user_message, token, conversation_history=None):
        """
        Process user message with Gemini AI
        """
        try:
            # Fetch real-time inventory data
            inventory_data = self.fetch_inventory_data(token)
            inventory_context = self.format_inventory_context(inventory_data)
            
            # Build conversation with context
            conversation = []
            
            # Add system prompt
            conversation.append({
                "role": "user",
                "parts": [self.system_prompt]
            })
            conversation.append({
                "role": "model",
                "parts": ["I understand. I'm your inventory management assistant with access to COMPLETE real-time data. How can I help you today?"]
            })
            
            # Add COMPLETE inventory context
            conversation.append({
                "role": "user",
                "parts": [f"Here's the COMPLETE inventory database:\n{inventory_context}"]
            })
            conversation.append({
                "role": "model",
                "parts": ["I've received the complete inventory data including all products and transactions. I can now answer any question about your inventory. What would you like to know?"]
            })
            
            # Add conversation history if exists
            if conversation_history and len(conversation_history) > 0:
                for msg in conversation_history[-6:]:
                    if msg.get('role') in ['user', 'assistant']:
                        conversation.append({
                            "role": "user" if msg['role'] == 'user' else "model",
                            "parts": [msg.get('content', '')]
                        })
            
            # Add current user message
            conversation.append({
                "role": "user",
                "parts": [user_message]
            })
            
            # Generate response
            response = self.model.generate_content(conversation)
            
            return {
                "answer": response.text,
                "context_used": True,
                "model": "gemini-2.0-flash-exp"
            }
            
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            return {
                "answer": f"I apologize, but I encountered an error processing your request. Please try rephrasing your question. Error: {str(e)}",
                "context_used": False,
                "model": "fallback"
            }
