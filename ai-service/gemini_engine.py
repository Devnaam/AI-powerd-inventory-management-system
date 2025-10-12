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
You have access to real-time inventory data including products, stock levels, transactions, and suppliers.

When answering:
- Be concise and direct
- Use emojis to make responses friendly
- Provide actionable insights
- Format numbers clearly (use commas for thousands)
- When suggesting actions, be specific
- Always base answers on the provided data

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
    
    def format_inventory_context(self, data):
        """Format inventory data for AI context"""
        products = data.get('products', [])
        dashboard = data.get('dashboard', {})
        transactions = data.get('transactions', [])
        
        # Product summary
        total_products = len(products)
        low_stock = [p for p in products if 0 < p.get('quantity', 0) <= p.get('reorderLevel', 0)]
        out_of_stock = [p for p in products if p.get('quantity', 0) == 0]
        
        # Category breakdown
        categories = {}
        for p in products:
            cat = p.get('category', 'Other')
            if cat not in categories:
                categories[cat] = 0
            categories[cat] += 1
        
        # Recent transactions
        recent_in = sum(1 for t in transactions[:10] if t.get('type') == 'IN')
        recent_out = sum(1 for t in transactions[:10] if t.get('type') == 'OUT')
        
        context = f"""
CURRENT INVENTORY STATUS:
- Total Products: {total_products}
- Total Stock Value: ₹{dashboard.get('totalStockValue', 0):,.2f}
- Low Stock Items: {len(low_stock)}
- Out of Stock Items: {len(out_of_stock)}
- Categories: {', '.join([f"{k} ({v})" for k, v in categories.items()])}

RECENT ACTIVITY (Last 10 transactions):
- Stock IN: {recent_in}
- Stock OUT: {recent_out}

LOW STOCK ALERTS:
{chr(10).join([f"- {p.get('name')} (Current: {p.get('quantity')}, Reorder Level: {p.get('reorderLevel')})" for p in low_stock[:5]])}

TOP 5 PRODUCTS BY STOCK:
{chr(10).join([f"- {p.get('name')}: {p.get('quantity')} units (₹{p.get('price', 0):,.2f} each)" for p in sorted(products, key=lambda x: x.get('quantity', 0), reverse=True)[:5]])}
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
                "parts": ["I understand. I'm your inventory management assistant with access to real-time data. How can I help you today?"]
            })
            
            # Add inventory context
            conversation.append({
                "role": "user",
                "parts": [f"Here's the current inventory data:\n{inventory_context}"]
            })
            conversation.append({
                "role": "model",
                "parts": ["I've received the inventory data. I'm ready to answer your questions."]
            })
            
            # Add conversation history if exists
            if conversation_history and len(conversation_history) > 0:
                for msg in conversation_history[-6:]:  # Last 3 exchanges
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
                "model": "gemini-2.0-flash"
            }
            
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            # Fallback to rule-based response
            return {
                "answer": f"I apologize, but I encountered an error processing your request. Please try rephrasing your question. Error: {str(e)}",
                "context_used": False,
                "model": "fallback"
            }
