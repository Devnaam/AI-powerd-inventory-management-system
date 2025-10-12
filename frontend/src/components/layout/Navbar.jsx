import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import Button from '../common/Button';
import api from '../../utils/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/dashboard');
      const lowStockItems = response.data.data.lowStockItems || [];
      setNotifications(lowStockItems);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'manager', 'staff'] },
    { path: '/products', label: 'Products', icon: '📦', roles: ['admin', 'manager', 'staff'] },
    { path: '/transactions', label: 'Transactions', icon: '🔄', roles: ['admin', 'manager', 'staff'] },
    { path: '/reports', label: 'Reports', icon: '📈', roles: ['admin', 'manager'] },
    { path: '/ai-chat', label: 'AI Assistant', icon: '🤖', roles: ['admin', 'manager', 'staff'] },
    { path: '/users', label: 'Users', icon: '👥', roles: ['admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

  const handleMobileMenuClick = (path) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  return (
    <>
      <nav className="bg-primary-dark text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Side - Logo & Hamburger */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg hover:bg-primary transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {showMobileMenu ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>

              {/* Logo */}
              <div
                className="flex items-center cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                <h1 className="text-xl font-bold">Inventory AI</h1>
              </div>
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-primary rounded-full transition-colors"
                >
                  <span className="text-2xl">🔔</span>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-danger text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-border z-50">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold text-text-primary">Low Stock Alerts</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((item) => (
                          <div
                            key={item._id}
                            className="p-4 border-b border-border hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              navigate('/products');
                              setShowNotifications(false);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">⚠️</span>
                              <div className="flex-1">
                                <p className="font-medium text-text-primary">{item.name}</p>
                                <p className="text-sm text-text-muted">{item.sku}</p>
                                <p className="text-xs text-danger mt-1">
                                  Only {item.quantity} left (Reorder level: {item.reorderLevel})
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <span className="text-4xl">✅</span>
                          <p className="text-text-muted mt-2">No low stock alerts</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <span className="text-sm">
                Welcome, <span className="font-semibold">{user?.name}</span>
              </span>
              <span className="text-xs bg-accent px-2 py-1 rounded-full">
                {user?.role}
              </span>
              <Button variant="danger" onClick={logout} className="text-sm">
                Logout
              </Button>
            </div>

            {/* Right Side - Mobile (Notifications & Logout) */}
            <div className="md:hidden flex items-center gap-2">
              {/* Notification Bell - Mobile */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-primary rounded-full transition-colors"
                >
                  <span className="text-xl">🔔</span>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-danger text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Mobile Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-border z-50">
                    <div className="p-3 border-b border-border">
                      <h3 className="font-semibold text-text-primary text-sm">Low Stock Alerts</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((item) => (
                          <div
                            key={item._id}
                            className="p-3 border-b border-border hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              navigate('/products');
                              setShowNotifications(false);
                              setShowMobileMenu(false);
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-lg">⚠️</span>
                              <div className="flex-1">
                                <p className="font-medium text-text-primary text-sm">{item.name}</p>
                                <p className="text-xs text-text-muted">{item.sku}</p>
                                <p className="text-xs text-danger mt-1">
                                  Only {item.quantity} left
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center">
                          <span className="text-3xl">✅</span>
                          <p className="text-text-muted text-sm mt-2">No alerts</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={logout}
                className="p-2 hover:bg-danger rounded-lg transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-sidebar text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          showMobileMenu ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Menu</h2>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User Info */}
          <div className="mt-4 p-3 bg-gray-800 rounded-lg">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
            <span className="inline-block mt-2 text-xs bg-accent px-2 py-1 rounded-full">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Mobile Menu Items */}
        <div className="p-4 space-y-2">
          {filteredMenu.map((item) => (
            <button
              key={item.path}
              onClick={() => handleMobileMenuClick(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
