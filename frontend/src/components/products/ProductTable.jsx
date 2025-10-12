import Card from '../common/Card';

const ProductTable = ({ products, onEdit, onDelete, canModify, userRole }) => {
  const getStockBadge = (product) => {
    if (product.quantity === 0) {
      return (
        <span className="px-3 py-1 bg-danger text-white text-xs font-semibold rounded-full shadow-sm">
          Out of Stock
        </span>
      );
    }
    if (product.quantity <= product.reorderLevel) {
      return (
        <span className="px-3 py-1 bg-warning text-white text-xs font-semibold rounded-full shadow-sm">
          Low Stock
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-success text-white text-xs font-semibold rounded-full shadow-sm">
        In Stock
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Electronics: '📱',
      Furniture: '🪑',
      Food: '🍔',
      Clothing: '👕',
      Other: '📦'
    };
    return icons[category] || '📦';
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary-light/10 to-accent/10">
            <tr className="border-b-2 border-primary-light">
              <th className="text-left py-4 px-4 text-text-primary text-sm font-bold">Product ID</th>
              <th className="text-left py-4 px-4 text-text-primary text-sm font-bold">Name</th>
              <th className="text-left py-4 px-4 text-text-primary text-sm font-bold">SKU</th>
              <th className="text-left py-4 px-4 text-text-primary text-sm font-bold">Category</th>
              <th className="text-left py-4 px-4 text-text-primary text-sm font-bold">Price</th>
              <th className="text-left py-4 px-4 text-text-primary text-sm font-bold">Quantity</th>
              <th className="text-left py-4 px-4 text-text-primary text-sm font-bold">Status</th>
              <th className="text-left py-4 px-4 text-text-primary text-sm font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product._id}
                className={`border-b border-border hover:bg-primary-light/5 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="py-4 px-4 font-mono text-sm text-primary font-semibold">
                  {product.productId}
                </td>
                <td className="py-4 px-4 font-semibold text-text-primary">{product.name}</td>
                <td className="py-4 px-4 text-text-muted font-mono text-sm">{product.sku}</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1 text-sm">
                    <span>{getCategoryIcon(product.category)}</span>
                    <span>{product.category}</span>
                  </span>
                </td>
                <td className="py-4 px-4 font-semibold text-success">
                  ₹{product.price.toLocaleString()}
                </td>
                <td className="py-4 px-4 font-bold text-lg text-primary">
                  {product.quantity}
                </td>
                <td className="py-4 px-4">{getStockBadge(product)}</td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    {canModify && (
                      <>
                        <button
                          onClick={() => onEdit(product)}
                          className="px-3 py-1.5 bg-primary-light text-white text-sm font-medium rounded-lg hover:bg-primary transition-all shadow-sm"
                        >
                          Edit
                        </button>
                        {userRole === 'admin' && (
                          <button
                            onClick={() => onDelete(product._id)}
                            className="px-3 py-1.5 bg-danger text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-all shadow-sm"
                          >
                            Delete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ProductTable;
