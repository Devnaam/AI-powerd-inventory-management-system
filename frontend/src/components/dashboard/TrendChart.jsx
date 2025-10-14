import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const TrendChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{payload[0].payload.day}</p>
          <div className="space-y-1">
            <p className="text-success font-bold flex items-center gap-2">
              <span className="w-3 h-3 bg-success rounded-full"></span>
              Stock IN: {payload[0].value}
            </p>
            <p className="text-danger font-bold flex items-center gap-2">
              <span className="w-3 h-3 bg-danger rounded-full"></span>
              Stock OUT: {payload[1].value}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="7-Day Trend"
      subtitle="Stock IN vs OUT transactions"
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="day" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="stockIn" 
            stroke="#10B981" 
            strokeWidth={3}
            dot={{ fill: '#10B981', r: 5 }}
            activeDot={{ r: 7 }}
            name="Stock IN"
          />
          <Line 
            type="monotone" 
            dataKey="stockOut" 
            stroke="#EF4444" 
            strokeWidth={3}
            dot={{ fill: '#EF4444', r: 5 }}
            activeDot={{ r: 7 }}
            name="Stock OUT"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TrendChart;
