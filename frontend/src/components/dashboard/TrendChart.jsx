import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const TrendChart = ({ data }) => {
  const COLORS = {
    in: '#10B981',
    out: '#EF4444'
  };

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-text-primary">7-Day Trend</h3>
        <p className="text-sm text-text-muted">Stock IN vs OUT transactions</p>
      </div>
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
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="stockIn" 
            stroke={COLORS.in} 
            strokeWidth={3}
            dot={{ fill: COLORS.in, r: 5 }}
            activeDot={{ r: 7 }}
            name="Stock IN"
          />
          <Line 
            type="monotone" 
            dataKey="stockOut" 
            stroke={COLORS.out} 
            strokeWidth={3}
            dot={{ fill: COLORS.out, r: 5 }}
            activeDot={{ r: 7 }}
            name="Stock OUT"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TrendChart;
