import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4 relative overflow-hidden">
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
        <div className="absolute top-40 left-1/2 text-5xl animate-bounce-slow">🍨</div>
        <div className="absolute bottom-40 right-1/3 text-6xl animate-pulse">🧇</div>
        <div className="absolute top-60 right-40 text-5xl animate-bounce-slow">🍦</div>
        <div className="absolute bottom-60 left-40 text-6xl animate-pulse">🥧</div>
        <div className="absolute top-1/4 left-1/2 text-5xl animate-bounce-slow">🍯</div>
        <div className="absolute bottom-1/4 right-1/2 text-6xl animate-pulse">🧈</div>
        <div className="absolute top-1/2 right-1/4 text-5xl animate-bounce-slow">🥮</div>
        <div className="absolute bottom-1/2 left-1/4 text-6xl animate-pulse">🍥</div>
        <div className="absolute top-16 left-1/3 text-5xl animate-bounce-slow">🍧</div>
        <div className="absolute bottom-16 right-2/3 text-6xl animate-pulse">🥠</div>
        <div className="absolute top-2/3 left-16 text-5xl animate-bounce-slow">🍢</div>
        <div className="absolute bottom-2/3 right-16 text-6xl animate-pulse">🍬</div>
        <div className="absolute top-1/3 right-1/2 text-5xl animate-bounce-slow">🍭</div>
        <div className="absolute bottom-1/3 left-1/2 text-6xl animate-pulse">🍫</div>
      </div>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fadeIn">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Just One More Bite Logo" className="h-24 w-24 object-contain animate-bounce-slow" />
          </div>
          <h2 className="text-4xl font-bold merriweather text-gray-900 mb-2">
            Join Just One More Bite
          </h2>
          <p className="text-gray-600">Create your account today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn border-2 border-orange-100">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-fadeIn">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <span className="text-lg mr-2">👤</span>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <span className="text-lg mr-2">📧</span>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <span className="text-lg mr-2">🔒</span>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-2">
                Minimum 6 characters
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Creating account...' : '✨ Create Account'}
            </button>
          </form>
          
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
