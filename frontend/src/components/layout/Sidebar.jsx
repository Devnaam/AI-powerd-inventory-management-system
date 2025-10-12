import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'manager', 'staff'] },
    { path: '/products', label: 'Products', icon: '📦', roles: ['admin', 'manager', 'staff'] },
    { path: '/transactions', label: 'Transactions', icon: '🔄', roles: ['admin', 'manager', 'staff'] },
    { path: '/reports', label: 'Reports', icon: '📈', roles: ['admin', 'manager'] },
    { path: '/ai-chat', label: 'AI Assistant', icon: '🤖', roles: ['admin', 'manager', 'staff'] },  // NEW
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
    </aside>
  );
};

export default Sidebar;
