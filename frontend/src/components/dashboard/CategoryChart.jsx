import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const CategoryChart = ({ data }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      Electronics: '📱',
      Furniture: '🪑',
      Food: '🍔',
      Clothing: '👕',
      Other: '📦'
    };
    return icons[category] || '📦';
  };

  // Add icons to data
  const dataWithIcons = data.map(item => ({
    ...item,
    displayName: `${getCategoryIcon(item.name)} ${item.name}`
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-xl border-2 border-primary/20">
          <p className="font-semibold text-text-primary">{payload[0].payload.name}</p>
          <p className="text-primary font-bold text-lg">{payload[0].value} products</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-text-primary">Products by Category</h3>
        <p className="text-sm text-text-muted">Distribution across categories</p>
      </div>
      
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <span className="text-6xl mb-4">📊</span>
          <p className="text-text-muted">No category data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataWithIcons}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="displayName" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="url(#colorGradient)" 
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={1}/>
                <stop offset="100%" stopColor="#1E40AF" stopOpacity={1}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default CategoryChart;
