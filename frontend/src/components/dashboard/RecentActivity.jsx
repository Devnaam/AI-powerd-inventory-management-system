import Card from '../common/Card';

const RecentActivity = ({ stats }) => {
  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-text-primary">Today's Activity</h3>
        <p className="text-sm text-text-muted">Stock movements today</p>
      </div>

      <div className="space-y-4">
        {/* Stock IN */}
        <div className="group relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-success/20 hover:border-success/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success rounded-xl shadow-lg">
                <span className="text-2xl">📥</span>
              </div>
              <div>
                <p className="text-text-secondary font-medium">Stock In</p>
                <p className="text-xs text-text-muted">Products received</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-success">+{stats?.todayStockIn || 0}</p>
              <p className="text-xs text-text-muted">units</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 h-2 bg-green-200 rounded-full overflow-hidden">
            <div className="h-full bg-success rounded-full w-2/3 animate-pulse"></div>
          </div>
        </div>

        {/* Stock OUT */}
        <div className="group relative overflow-hidden bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-xl border-2 border-danger/20 hover:border-danger/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-danger rounded-xl shadow-lg">
                <span className="text-2xl">📤</span>
              </div>
              <div>
                <p className="text-text-secondary font-medium">Stock Out</p>
                <p className="text-xs text-text-muted">Products dispatched</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-danger">-{stats?.todayStockOut || 0}</p>
              <p className="text-xs text-text-muted">units</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 h-2 bg-red-200 rounded-full overflow-hidden">
            <div className="h-full bg-danger rounded-full w-1/2 animate-pulse"></div>
          </div>
        </div>

        {/* Net Movement */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚖️</span>
              <span className="font-semibold text-text-secondary">Net Movement</span>
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
