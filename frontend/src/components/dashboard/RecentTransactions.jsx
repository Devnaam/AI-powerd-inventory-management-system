import Card from '../common/Card';
import { useNavigate } from 'react-router-dom';

const RecentTransactions = ({ transactions }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-text-primary">Recent Transactions</h3>
          <p className="text-sm text-text-muted">Latest inventory movements</p>
        </div>
        <button 
          onClick={() => navigate('/transactions')}
          className="px-4 py-2 bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-semibold rounded-lg transition-all"
        >
          View All →
        </button>
      </div>

      {!transactions || transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔄</div>
          <p className="text-text-muted">No transactions yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary-light/10 to-accent/10 border-b-2 border-primary">
                <th className="text-left py-3 px-4 text-text-primary text-sm font-bold">Product</th>
                <th className="text-left py-3 px-4 text-text-primary text-sm font-bold">Type</th>
                <th className="text-left py-3 px-4 text-text-primary text-sm font-bold">Quantity</th>
                <th className="text-left py-3 px-4 text-text-primary text-sm font-bold">Performed By</th>
                <th className="text-left py-3 px-4 text-text-primary text-sm font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr 
                  key={transaction._id} 
                  className={`border-b border-border hover:bg-primary-light/5 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-text-primary">{transaction.product?.name}</p>
                      <p className="text-xs text-text-muted font-mono">{transaction.product?.sku}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      transaction.type === 'IN' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-danger/20 text-danger'
                    }`}>
                      {transaction.type === 'IN' ? '📥 IN' : '📤 OUT'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-lg text-primary">{transaction.quantity}</span>
                  </td>
                  <td className="py-4 px-4 text-text-secondary">{transaction.performedBy?.name}</td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <p className="text-text-primary">
                        {new Date(transaction.transactionDate).toLocaleDateString('en-IN')}
                      </p>
                      <p className="text-xs text-text-muted">
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
