const StatCard = ({ title, value, icon, trend, trendValue, gradientFrom, gradientTo, iconBg }) => {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
      {/* Gradient Background Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-text-muted text-sm font-medium mb-1">{title}</p>
            <p className="text-4xl font-bold text-text-primary">{value}</p>
          </div>
          
          <div className={`p-4 rounded-xl bg-gradient-to-br ${iconBg} text-white shadow-lg`}>
            <span className="text-3xl">{icon}</span>
          </div>
        </div>
        
        {/* Trend Indicator */}
        {trend && (
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 text-sm font-semibold ${
              trend === 'up' ? 'text-success' : 'text-danger'
            }`}>
              {trend === 'up' ? '↑' : '↓'}
              {trendValue}
            </span>
            <span className="text-xs text-text-muted">vs last week</span>
          </div>
        )}
      </div>
      
      {/* Bottom Accent */}
      <div className={`h-1 bg-gradient-to-r ${gradientFrom} ${gradientTo}`}></div>
    </div>
  );
};

export default StatCard;
