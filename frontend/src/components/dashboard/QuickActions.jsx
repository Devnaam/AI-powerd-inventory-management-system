import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { 
      label: 'Add Product', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/products')
    },
    { 
      label: 'New Transaction', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      color: 'from-emerald-500 to-emerald-600',
      action: () => navigate('/transactions')
    },
    { 
      label: 'View Reports', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/reports')
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.action}
          className={`group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${action.color} text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105`}
        >
          <span className="group-hover:scale-110 transition-transform">
            {action.icon}
          </span>
          <span className="font-medium text-sm">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
