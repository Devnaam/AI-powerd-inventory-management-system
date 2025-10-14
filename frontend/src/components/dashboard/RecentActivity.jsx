import Card from '../common/Card';

const RecentActivity = ({ stats }) => {
  return (
    <Card
      title="Today's Activity"
      subtitle="Stock movements today"
    >
      <div className="space-y-4">
        {/* Stock IN */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success rounded-xl shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Stock In</p>
                <p className="text-xs text-gray-600">Products received</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-success">+{stats?.todayStockIn || 0}</p>
              <p className="text-xs text-gray-600">units</p>
            </div>
          </div>
        </div>

        {/* Stock OUT */}
        <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-danger rounded-xl shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Stock Out</p>
                <p className="text-xs text-gray-600">Products dispatched</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-danger">-{stats?.todayStockOut || 0}</p>
              <p className="text-xs text-gray-600">units</p>
            </div>
          </div>
        </div>

        {/* Net Movement */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <span className="font-semibold text-gray-900">Net Movement</span>
            </div>
            <span className={`text-2xl font-bold ${
              (stats?.todayStockIn || 0) - (stats?.todayStockOut || 0) >= 0 
                ? 'text-success' 
                : 'text-danger'
            }`}>
              {(stats?.todayStockIn || 0) - (stats?.todayStockOut || 0) >= 0 ? '+' : ''}
              {(stats?.todayStockIn || 0) - (stats?.todayStockOut || 0)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RecentActivity;
