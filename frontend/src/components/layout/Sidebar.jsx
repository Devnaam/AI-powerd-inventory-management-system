import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'manager', 'staff'] },
    { path: '/products', label: 'Products', icon: '📦', roles: ['admin', 'manager', 'staff'] },
    { path: '/transactions', label: 'Transactions', icon: '🔄', roles: ['admin', 'manager', 'staff'] },
    { path: '/reports', label: 'Reports', icon: '📈', roles: ['admin', 'manager'] },
    // Removed AI Chat from sidebar since it's now a floating widget
    { path: '/users', label: 'Users', icon: '👥', roles: ['admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="bg-sidebar text-text-inverse w-64 min-h-screen p-4 hidden md:block">
      <div className="space-y-2">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-inverse hover:bg-gray-700'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* AI Assistant Info Badge */}
      <div className="mt-8 p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-primary/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🤖</span>
          <span className="text-sm font-bold">AI Assistant</span>
        </div>
        <p className="text-xs text-text-inverse/80">
          Click the floating button to chat with AI!
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
