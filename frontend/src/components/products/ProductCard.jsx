import Card from '../common/Card';

const ProductCard = ({ product, onEdit, onDelete, canModify, userRole }) => {
  const getStockBadge = () => {
    if (product.quantity === 0) {
      return (
        <span className="px-3 py-1 bg-danger text-white text-xs font-semibold rounded-full">
          Out of Stock
        </span>
      );
    }
    if (product.quantity <= product.reorderLevel) {
      return (
        <span className="px-3 py-1 bg-warning text-white text-xs font-semibold rounded-full">
          Low Stock
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-success text-white text-xs font-semibold rounded-full">
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
    <Card className="hover:shadow-lg transition-all border-l-4 border-primary">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-text-primary">{product.name}</h3>
            <p className="text-sm text-text-muted font-mono">{product.sku}</p>
          </div>
          {getStockBadge()}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-border">
          <div>
            <p className="text-xs text-text-muted uppercase font-semibold">Product ID</p>
            <p className="font-mono text-sm font-semibold text-primary">{product.productId}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase font-semibold">Category</p>
            <p className="text-sm font-medium">
              {getCategoryIcon(product.category)} {product.category}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase font-semibold">Price</p>
            <p className="text-lg font-bold text-success">₹{product.price.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase font-semibold">Quantity</p>
            <p className="text-lg font-bold text-primary">{product.quantity}</p>
          </div>
        </div>

        {/* Supplier */}
        <div>
          <p className="text-xs text-text-muted uppercase font-semibold">Supplier</p>
          <p className="text-sm font-medium">{product.supplier}</p>
        </div>

        {/* Actions */}
        {canModify && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 px-4 py-2 bg-primary-light text-white font-medium rounded-lg hover:bg-primary transition-all shadow-sm"
            >
              ✏️ Edit
            </button>
            {userRole === 'admin' && (
              <button
                onClick={() => onDelete(product._id)}
                className="flex-1 px-4 py-2 bg-danger text-white font-medium rounded-lg hover:bg-red-600 transition-all shadow-sm"
              >
                🗑️ Delete
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
