const StatCard = ({ title, value, icon, trend, trendValue, color = 'blue' }) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    green: {
      bg: 'from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    amber: {
      bg: 'from-amber-500 to-amber-600',
      lightBg: 'bg-amber-50',
      border: 'border-amber-100'
    },
    red: {
      bg: 'from-red-500 to-red-600',
      lightBg: 'bg-red-50',
      border: 'border-red-100'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${colors.border} p-6 hover:shadow-md transition-all duration-200 hover-lift`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} shadow-sm`}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1">
          <span className={`flex items-center gap-1 text-sm font-semibold ${
            trend === 'up' ? 'text-success' : 'text-danger'
          }`}>
            {trend === 'up' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {trendValue}
          </span>
          <span className="text-xs text-gray-400">vs last week</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
