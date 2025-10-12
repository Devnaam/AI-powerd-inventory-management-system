import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import api from '../../utils/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
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

  return (
    <nav className="bg-primary-dark text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
            <h1 className="text-xl font-bold">Inventory AI</h1>
          </div>
          
          <div className="flex items-center gap-4">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
