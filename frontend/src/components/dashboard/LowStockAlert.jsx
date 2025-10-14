import Card from '../common/Card';
import { useNavigate } from 'react-router-dom';

const LowStockAlert = ({ items }) => {
  const navigate = useNavigate();

  return (
    <Card className="border-l-4 border-warning">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Low Stock Alert
          </h3>
          <p className="text-sm text-gray-500">Requires immediate attention</p>
        </div>
        {items.length > 0 && (
          <span className="px-3 py-1 bg-warning text-white rounded-full text-sm font-bold animate-pulse">
            {items.length}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-success mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold text-success mb-2">All Good!</p>
          <p className="text-gray-500">All products are well stocked</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
          {items.map((item, index) => (
            <div 
              key={item._id}
              className="group bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200 hover:border-warning hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate('/products')}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-warning text-white text-xs font-bold">
                      {index + 1}
                    </span>
                    <p className="font-bold text-gray-900 group-hover:text-warning transition-colors">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 font-mono mt-1 ml-8">{item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-warning">{item.quantity}</p>
                  <p className="text-xs text-gray-600">units left</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Current Stock</span>
                  <span>Reorder at: {item.reorderLevel}</span>
                </div>
                <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-warning rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((item.quantity / item.reorderLevel) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Hint */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">Click to view product</span>
                <svg className="w-4 h-4 text-warning opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default LowStockAlert;
