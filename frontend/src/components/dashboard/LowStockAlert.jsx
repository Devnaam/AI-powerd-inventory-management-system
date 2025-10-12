import Card from '../common/Card';
import { useNavigate } from 'react-router-dom';

const LowStockAlert = ({ items }) => {
  const navigate = useNavigate();

  return (
    <Card className="border-l-4 border-warning">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Low Stock Alert
          </h3>
          <p className="text-sm text-text-muted">Requires immediate attention</p>
        </div>
        {items.length > 0 && (
          <span className="px-3 py-1 bg-warning text-white rounded-full text-sm font-bold animate-pulse">
            {items.length}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-lg font-semibold text-success mb-2">All Good!</p>
          <p className="text-text-muted">All products are well stocked</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item, index) => (
            <div 
              key={item._id}
              className="group bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border-2 border-warning/20 hover:border-warning/60 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate('/products')}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-warning">#{index + 1}</span>
                    <p className="font-bold text-text-primary group-hover:text-warning transition-colors">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-sm text-text-muted font-mono mt-1">{item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-warning">{item.quantity}</p>
                  <p className="text-xs text-text-muted">units left</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-text-muted mb-1">
                  <span>Current</span>
                  <span>Reorder: {item.reorderLevel}</span>
                </div>
                <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-warning rounded-full transition-all duration-500"
                    style={{ width: `${(item.quantity / item.reorderLevel) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <button className="mt-3 w-full py-2 bg-warning/10 hover:bg-warning hover:text-white text-warning text-sm font-semibold rounded-lg transition-all">
                Reorder Now →
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default LowStockAlert;
