import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sweetsApi } from '../api/sweets';

function SweetCard({ sweet }) {
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
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2 hover:scale-105 animate-fadeIn">
      <div className="relative w-full h-64 bg-white overflow-hidden">
        <img
          src={sweet.imageUrl || 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=500&h=300&fit=crop'}
          alt={sweet.name}
          className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=500&h=300&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      
      <div className="p-5 bg-white">
        <div className="mb-2 transform group-hover:translate-x-1 transition-transform duration-300">
          <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide animate-pulse">
            {sweet.category}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-orange-600 transition-colors duration-300">
          {sweet.name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline transform group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl font-bold text-orange-600 animate-bounce-slow">
              ₹{(sweet.price * 80).toFixed(0)}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              (${sweet.price.toFixed(2)})
            </span>
          </div>
          <div className={`text-xs font-semibold transition-all duration-300 transform group-hover:scale-110 ${
            sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {sweet.quantity > 0 ? `Stock: ${sweet.quantity}` : 'Out of Stock'}
          </div>
        </div>
        
        <button
          onClick={handlePurchase}
          disabled={sweet.quantity === 0 || purchaseMutation.isPending}
          className={`w-full py-3 font-semibold rounded transition-all duration-500 transform ${
            sweet.quantity > 0
              ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-2xl hover:scale-105 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {purchaseMutation.isPending
            ? 'Adding...'
            : sweet.quantity > 0
            ? 'Add to Cart'
            : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

export default SweetCard;
