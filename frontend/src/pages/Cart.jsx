import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { sweetsApi } from '../api/sweets';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('Cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call the purchase API
      await sweetsApi.purchaseMultiple(cartItems);
      
      // Clear cart and show success
      setOrderPlaced(true);
      clearCart();
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      console.error('Purchase error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Sweet Doodles Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-10 left-10 text-6xl animate-bounce-slow">🍬</div>
        <div className="absolute top-20 right-20 text-5xl animate-pulse">🍭</div>
        <div className="absolute bottom-20 left-20 text-7xl animate-bounce-slow">🍫</div>
        <div className="absolute bottom-10 right-10 text-6xl animate-pulse">🧁</div>
        <div className="absolute top-1/3 left-1/4 text-5xl animate-bounce-slow">🍩</div>
        <div className="absolute top-2/3 right-1/4 text-6xl animate-pulse">🍪</div>
        <div className="absolute top-1/2 left-10 text-5xl animate-bounce-slow">🍰</div>
        <div className="absolute top-1/4 right-1/3 text-6xl animate-pulse">🎂</div>
        <div className="absolute bottom-1/3 left-1/3 text-5xl animate-bounce-slow">🍮</div>
        <div className="absolute top-3/4 right-20 text-6xl animate-pulse">🍡</div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold merriweather text-gray-900 mb-2">🛒 Shopping Cart</h1>
          <p className="text-gray-600">
            You have <span className="font-bold text-orange-600">{getCartItemCount()}</span> item(s) in your cart
          </p>
        </div>

        {/* Order Placed Success */}
        {orderPlaced && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 mb-8 text-center animate-fadeIn">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</h2>
            <p className="text-green-700 mb-4">Thank you for your purchase. Your inventory has been updated.</p>
            <p className="text-green-600">Redirecting to dashboard...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 text-red-700 animate-fadeIn">
            {error}
          </div>
        )}

        {/* Empty Cart */}
        {cartItems.length === 0 && !orderPlaced && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center animate-fadeIn">
            <div className="text-6xl mb-4">🛍️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start adding some delicious sweets from our collection!</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* Cart Items */}
        {cartItems.length > 0 && !orderPlaced && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border-2 border-orange-100 rounded-xl hover:border-orange-300 transition-all duration-300"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=500&h=300&fit=crop'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <p className="text-orange-600 font-bold mt-2">₹{(item.price * 80).toFixed(0)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 font-bold text-gray-700 hover:bg-white rounded transition-colors"
                        >
                          −
                        </button>
                        <span className="px-4 py-1 font-semibold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 font-bold text-gray-700 hover:bg-white rounded transition-colors"
                          disabled={item.quantity >= item.quantity}
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-[100px]">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{(item.price * item.quantity * 80).toFixed(0)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 text-sm font-semibold hover:text-red-800 mt-2 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-20 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-orange-200 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Subtotal ({getCartItemCount()} items)</span>
                    <span className="font-semibold">₹{(getCartTotal() * 80).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="border-t-2 border-orange-100 pt-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{(getCartTotal() * 80).toFixed(0)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || cartItems.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? '⏳ Processing...' : '💳 Buy Now'}
                </button>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors duration-300"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
