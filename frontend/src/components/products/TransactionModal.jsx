import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import api from "../../utils/api";
import toast from "react-hot-toast";

const TransactionModal = ({ product, onClose, onSuccess }) => {
  const [type, setType] = useState('IN');
  const [quantity, setQuantity] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/transactions`, {
        // Change productId to product and reference to notes
        product: product._id,
        type,
        quantity: Number(quantity),
        notes: reference
      });
      toast.success("Transaction recorded!");
      onSuccess();
    } catch (err) {
      toast.error("Failed to record transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 space-y-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg">Perform Transaction</h3>
          <button className="p-2" onClick={onClose}>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Button
              type="button"
              variant={type === 'IN' ? "primary" : "secondary"}
              onClick={() => setType('IN')}
            >
              Stock IN
            </Button>
            <Button
              type="button"
              variant={type === 'OUT' ? "primary" : "secondary"}
              onClick={() => setType('OUT')}
            >
              Stock OUT
            </Button>
          </div>
          <Input
            label="Quantity"
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            required
            min={1}
          />
          <Input
            label="Reference (optional)"
            value={reference}
            onChange={e => setReference(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" loading={loading}>
              {type === 'IN' ? 'Add Stock' : 'Remove Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
