import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sweetsApi } from '../api/sweets';
import { useAuth } from '../context/AuthContext';

function SweetCard({ sweet }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: (quantity) => sweetsApi.purchase(sweet.id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
    },
  });

  const handlePurchase = () => {
    if (sweet.quantity > 0) {
      purchaseMutation.mutate(1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {sweet.imageUrl && (
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={sweet.imageUrl}
            alt={sweet.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{sweet.name}</h3>
        <p className="text-gray-600 mb-2">Category: {sweet.category}</p>
        <p className="text-2xl font-bold text-purple-600 mb-2">
          ${sweet.price.toFixed(2)}
        </p>
        <p
          className={`mb-4 ${
            sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          Stock: {sweet.quantity}
        </p>
        <button
          onClick={handlePurchase}
          disabled={sweet.quantity === 0 || purchaseMutation.isPending}
          className={`w-full py-2 px-4 rounded font-semibold ${
            sweet.quantity > 0
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {purchaseMutation.isPending
            ? 'Purchasing...'
            : sweet.quantity > 0
            ? 'Purchase'
            : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

export default SweetCard;

