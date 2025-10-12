import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const StockStatusChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-xl border-2 border-primary/20">
          <p className="font-semibold text-text-primary">{payload[0].name}</p>
          <p className="font-bold text-lg" style={{ color: payload[0].payload.color }}>
            {payload[0].value} products
          </p>
          <p className="text-xs text-text-muted">
            {((payload[0].value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label if too small

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const totalProducts = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-text-primary">Stock Status Overview</h3>
        <p className="text-sm text-text-muted">Current inventory health</p>
      </div>

      {totalProducts === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <span className="text-6xl mb-4">📊</span>
          <p className="text-text-muted">No stock data available</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm font-medium text-text-secondary">
                  {entry.name}: <span className="font-bold">{entry.value}</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default StockStatusChart;
