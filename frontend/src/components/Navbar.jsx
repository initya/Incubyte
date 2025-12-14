import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const cartCount = getCartItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 border-b transition-all duration-700 ${
      scrolled 
        ? 'bg-orange-900/40 backdrop-blur-xl border-orange-800/30 shadow-lg' 
        : 'bg-orange-50/60 backdrop-blur-lg border-orange-100/50 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
            <h1 className={`text-3xl font-bold playfair transition-colors ${
              scrolled ? 'text-white' : 'text-gray-900'
            }`}>
              Just One More Bite
            </h1>
          </div>
          
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate('/dashboard')}
              className={`font-medium transition-colors ${
                scrolled ? 'text-white hover:text-orange-200' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            
            <button
              onClick={() => navigate('/contact')}
              className={`font-medium transition-colors ${
                scrolled ? 'text-white hover:text-orange-200' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Contact
            </button>
            
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className={`font-medium transition-colors ${
                  scrolled ? 'text-white hover:text-orange-200' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Admin
              </button>
            )}

            <button
              onClick={() => navigate('/cart')}
              className={`relative font-medium transition-colors flex items-center ${
                scrolled ? 'text-white hover:text-orange-200' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mr-2 -mt-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              scrolled ? 'bg-white/20 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm'
            }`}>
              <span className={`font-medium ${scrolled ? 'text-white' : 'text-gray-700'}`}>
                {user?.name}
              </span>
            </div>
            
            <button
              onClick={logout}
              className="px-6 py-2 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
