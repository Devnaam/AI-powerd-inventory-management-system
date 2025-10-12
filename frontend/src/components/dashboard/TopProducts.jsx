import Card from '../common/Card';

const TopProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <Card>
        <h3 className="text-xl font-bold text-text-primary mb-4">Top 5 Products</h3>
        <div className="text-center py-8">
          <span className="text-4xl">📊</span>
          <p className="text-text-muted mt-2">No products yet</p>
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...products.map(p => p.value));

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-text-primary">Top 5 Products</h3>
        <p className="text-sm text-text-muted">By stock value</p>
      </div>
      
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                    {product.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {product.quantity} units × ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <span className="font-bold text-success">
                ₹{product.value.toLocaleString()}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
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
