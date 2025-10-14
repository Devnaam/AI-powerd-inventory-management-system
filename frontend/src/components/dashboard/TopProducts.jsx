import Card from '../common/Card';

const TopProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <Card
        title="Top 5 Products"
        subtitle="By stock value"
      >
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-gray-500">No products yet</p>
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...products.map(p => p.value));

  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

  return (
    <Card
      title="Top 5 Products"
      subtitle="By stock value"
    >
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{medals[index]}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {product.quantity} units × ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <span className="font-bold text-success text-sm">
                ₹{product.value.toLocaleString()}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(product.value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopProducts;
