import Card from '../common/Card';
import { useNavigate } from 'react-router-dom';

const RecentTransactions = ({ transactions }) => {
  const navigate = useNavigate();

  return (
    <Card
      title="Recent Transactions"
      subtitle="Latest inventory movements"
      headerAction={
        <button 
          onClick={() => navigate('/transactions')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-900 text-sm font-semibold rounded-xl transition-all duration-200"
        >
          View All →
        </button>
      }
      noPadding
    >
      {!transactions || transactions.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <p className="text-gray-500">No transactions yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-gray-700 text-sm font-bold">Product</th>
                <th className="text-left py-3 px-6 text-gray-700 text-sm font-bold">Type</th>
                <th className="text-left py-3 px-6 text-gray-700 text-sm font-bold">Quantity</th>
                <th className="text-left py-3 px-6 text-gray-700 text-sm font-bold">Performed By</th>
                <th className="text-left py-3 px-6 text-gray-700 text-sm font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr 
                  key={transaction._id} 
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.product?.name}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{transaction.product?.sku}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${
                      transaction.type === 'IN' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {transaction.type === 'IN' ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      )}
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-lg text-blue-600">{transaction.quantity}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{transaction.performedBy?.name}</td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <p className="text-gray-900 font-medium">
                        {new Date(transaction.transactionDate).toLocaleDateString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.transactionDate).toLocaleTimeString('en-IN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default RecentTransactions;
