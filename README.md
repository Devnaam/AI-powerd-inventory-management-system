# 🤖 Inventory AI - Smart Inventory Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-v22.18.0-brightgreen)
![MongoDB](https://img.shields.io/badge/mongodb-v7.0-green)
![React](https://img.shields.io/badge/react-v18.3-blue)
![Python](https://img.shields.io/badge/python-v3.11-yellow)

A modern, AI-powered inventory management system with real-time analytics, intelligent insights, and responsive design.

---

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based secure authentication
- Role-based access control (Admin, Manager, Staff)
- Protected routes and API endpoints

### 📦 Product Management

- Complete CRUD operations for products
- Advanced search and filtering
- Category-based organization
- Real-time stock status tracking
- Low stock and out-of-stock alerts

### 🔄 Transaction Tracking

- Stock IN/OUT operations
- Transaction history with filters
- Automatic inventory updates
- User attribution for all transactions

### 📊 Analytics Dashboard

- Real-time inventory statistics
- Interactive charts (Bar, Pie, Line)
- Stock value calculations
- Today's activity summary
- Low stock alerts

### 📈 Reports & Export

- Inventory reports (daily/weekly/monthly)
- Transaction reports with date ranges
- CSV export functionality
- PDF export with customizable layouts
- Report preview before download

### 🤖 AI-Powered Assistant

- Natural language query interface
- Intelligent inventory insights
- Predictive analytics
- Conversational chatbot UI
- Context-aware responses

### 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Hamburger menu for mobile navigation
- Adaptive layouts

### 🔔 Notifications

- Real-time low stock alerts
- Bell icon with badge counter
- Clickable notifications
- Product-specific alerts

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 18.3 + Vite
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS v3.4
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **PDF Generation:** jsPDF
- **State Management:** React Context API

### Backend

- **Runtime:** Node.js v22.18
- **Framework:** Express.js v4.21
- **Database:** MongoDB v7.0
- **ODM:** Mongoose v8.8
- **Authentication:** JWT (jsonwebtoken + bcryptjs)
- **CORS:** cors middleware

### AI Service

- **Framework:** FastAPI
- **Language:** Python 3.11
- **Server:** Uvicorn
- **HTTP Client:** Requests

---

## 📁 Project Structure

inventory-ai-mvp/
├── backend/ # Node.js Express Backend
│ ├── src/
│ │ ├── config/ # Database configuration
│ │ ├── controllers/ # Request handlers
│ │ ├── middleware/ # Auth & role middleware
│ │ ├── models/ # Mongoose schemas
│ │ ├── routes/ # API routes
│ │ └── utils/ # Helper functions
│ ├── .env # Environment variables
│ ├── server.js # Entry point
│ └── package.json
│
├── frontend/ # React + Vite Frontend
│ ├── src/
│ │ ├── components/
│ │ │ ├── common/ # Reusable UI components
│ │ │ ├── layout/ # Navbar, Sidebar, Footer
│ │ │ ├── products/ # Product-specific components
│ │ │ └── ProtectedRoute.jsx
│ │ ├── context/ # React Context (Auth)
│ │ ├── hooks/ # Custom React hooks
│ │ ├── pages/ # Page components
│ │ ├── utils/ # API utilities
│ │ ├── App.jsx # Root component
│ │ └── main.jsx # Entry point
│ ├── .env # Environment variables
│ ├── tailwind.config.js # Tailwind configuration
│ └── package.json
│
└── ai-service/ # Python FastAPI AI Service
├── ai_engine.py # AI logic and analysis
├── main.py # FastAPI application
├── requirements.txt # Python dependencies
└── .env # Environment variables

text

---

## 🚀 Getting Started

### Prerequisites

- Node.js v22.18.0 or higher
- MongoDB v7.0 or higher (local or Atlas)
- Python 3.11 or higher
- npm or yarn package manager

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/inventory-ai-mvp.git
cd inventory-ai-mvp
```

#### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_ai_mvp
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
AI_SERVICE_URL=http://localhost:8001
EOL

# Start backend server
npm run dev
```

#### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create .env file
cat > .env << EOL
VITE_API_URL=http://localhost:5000/api
EOL

# Start frontend development server
npm run dev
```

#### 4. AI Service Setup

```bash
cd ../ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOL
PORT=8001
NODE_BACKEND_URL=http://localhost:5000/api
OPENAI_API_KEY=your_openai_key_optional
EOL

# Start AI service
python main.py
```

---

## 🔑 Environment Variables

### Backend (.env)

```
PORT=5000 # Server port
MONGODB_URI=mongodb://localhost:27017/inventory_ai_mvp # Database connection
JWT_SECRET=your_secret_key # JWT signing key
JWT_EXPIRE=7d # Token expiration
NODE_ENV=development # Environment
AI_SERVICE_URL=http://localhost:8001 # AI service URL
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api # Backend API URL
```

### AI Service (.env)

```
PORT=8001 # Service port
NODE_BACKEND_URL=http://localhost:5000/api # Backend URL
OPENAI_API_KEY=optional_key # OpenAI key (optional)
```

---

## 🎨 Color Palette

```css
/* Primary Colors */
--deep-indigo-blue: #1e40af; /* Primary brand color */
--slate-blue: #3b82f6; /* Hover states, highlights */
--navy-ink: #1e3a8a; /* Sidebar, navbar backgrounds */

/* Accent Colors */
--electric-violet: #7c3aed; /* Modern accent for graphs */

/* Functional Colors */
--success: #10b981; /* Emerald Green */
--warning: #f59e0b; /* Amber Gold */
--danger: #ef4444; /* Crimson Red */
--info: #0ea5e9; /* Sky Blue */

/* Neutral Colors */
--background-dark: #0f172a; /* Charcoal Blue */
--background-light: #f9fafb; /* Cloud Gray */
--card-background: #ffffff; /* White */
--border: #e5e7eb; /* Mist Gray */
```

---

## 📚 API Documentation

#### Authentication Endpoints

```http
# Register User
POST /api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "staff"
}

# Login
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}

# Get Current User
GET /api/auth/me
Authorization: Bearer <token>
```

### Product Endpoints

#### Get All Products

GET /api/products?search=laptop&category=Electronics
Authorization: Bearer <token>

text

#### Create Product

POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
"productId": "PROD001",
"name": "Laptop Dell XPS 15",
"sku": "DELL-XPS-15-2024",
"category": "Electronics",
"price": 1500,
"quantity": 50,
"supplier": "Dell Inc.",
"reorderLevel": 10,
"description": "High-performance laptop"
}

text

#### Update Product

PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

text

#### Delete Product

DELETE /api/products/:id
Authorization: Bearer <token>

text

### Transaction Endpoints

#### Get All Transactions

GET /api/transactions?type=IN&startDate=2025-01-01
Authorization: Bearer <token>

text

#### Create Transaction

POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
"product": "product_id",
"type": "IN",
"quantity": 20,
"notes": "Purchase order #12345"
}

text

### AI Assistant Endpoint

#### Ask AI

POST /api/ai/ask
Authorization: Bearer <token>
Content-Type: application/json

{
"message": "Which products are low on stock?"
}

text

---

## 👥 Default Users

For testing purposes, create these users:

### Admin User

Email: admin@inventory.com
Password: admin123
Role: admin

text

### Manager User

Email: manager@inventory.com
Password: manager123
Role: manager

text

### Staff User

Email: staff@inventory.com
Password: staff123
Role: staff

text

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication

- [ ] User registration works
- [ ] User login returns JWT token
- [ ] Protected routes require authentication
- [ ] Logout clears token

#### Products

- [ ] Create product (admin/manager only)
- [ ] View all products
- [ ] Search products by name/SKU
- [ ] Filter by category
- [ ] Edit product (admin/manager only)
- [ ] Delete product (admin only)

#### Transactions

- [ ] Record stock IN
- [ ] Record stock OUT
- [ ] View transaction history
- [ ] Filter transactions by type/date

#### Dashboard

- [ ] Display correct statistics
- [ ] Charts render properly
- [ ] Low stock alerts appear
- [ ] Recent transactions show

#### Reports

- [ ] Generate inventory report
- [ ] Generate transaction report
- [ ] Export to CSV
- [ ] Export to PDF

#### AI Assistant

- [ ] Ask about low stock items
- [ ] Query best-selling products
- [ ] Get inventory value
- [ ] Natural language queries work

---

## 🐛 Known Issues

1. **MongoDB Deprecation Warnings:** Remove `useNewUrlParser` and `useUnifiedTopology` in db.js
2. **CORS in Production:** Configure allowed origins properly
3. **AI Service Timeout:** Increase timeout for complex queries

---

## 🚀 Deployment

### Production Checklist

- [ ] Update environment variables
- [ ] Use MongoDB Atlas for database
- [ ] Enable HTTPS
- [ ] Set secure JWT secret
- [ ] Configure CORS origins
- [ ] Build optimized frontend
- [ ] Enable rate limiting
- [ ] Set up error logging
- [ ] Configure backup strategy

### Recommended Platforms

- **Frontend:** Vercel, Netlify
- **Backend:** Render, Railway, Heroku
- **AI Service:** Render, Railway
- **Database:** MongoDB Atlas

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for utility-first styling
- MongoDB team for the flexible database
- FastAPI for the modern Python framework
- Recharts for beautiful visualizations

---

## 📞 Support

For support, email your.email@example.com or open an issue on GitHub.

---

## 🗺️ Roadmap

### Version 1.1 (Planned)

- [ ] OpenAI GPT integration for advanced AI
- [ ] Product image uploads
- [ ] Bulk CSV import/export
- [ ] Email notifications
- [ ] Dark mode theme
- [ ] Advanced analytics

### Version 2.0 (Future)

- [ ] Mobile app (React Native)
- [ ] Barcode scanning
- [ ] Multi-warehouse support
- [ ] Supplier management
- [ ] Purchase orders
- [ ] Invoice generation

---

Made with ❤️ using React, Node.js, MongoDB, and Python
