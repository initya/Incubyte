import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sweetsApi } from '../api/sweets';
import SweetCard from '../components/SweetCard';

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { data: sweets = [], isLoading, error } = useQuery({
    queryKey: ['sweets', searchQuery, minPrice, maxPrice],
    queryFn: () =>
      sweetsApi.getAll(
        searchQuery || undefined,
        minPrice ? parseFloat(minPrice) : undefined,
        maxPrice ? parseFloat(maxPrice) : undefined,
      ),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-orange-50">
        <div className="text-2xl text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-orange-50">
        <div className="text-red-600 text-xl animate-fadeIn">
          Error loading sweets: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 relative overflow-hidden">
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
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Hero Banner */}
        <div className="mb-8 animate-fadeIn">
          <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/hero-banner.png"
              alt="Sweets Shop Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold merriweather text-gray-900 mb-2 animate-slideInLeft">
            Our Sweet Collection
          </h1>
          <p className="text-gray-600 animate-slideInRight">
            Handcrafted sweets made with love and finest ingredients
          </p>
        </div>

        {/* Search & Filters */}
        <div className="relative bg-gradient-to-br from-orange-50 to-white rounded-3xl shadow-xl p-8 mb-8 animate-fadeIn border-2 border-orange-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-300 rounded-full blur-3xl opacity-20 -ml-32 -mb-32"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
              <h2 className="text-2xl font-bold merriweather text-gray-800">Find Your Sweet</h2>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center">
                <span className="absolute left-5 text-orange-500 text-xl">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white border-2 border-orange-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 text-gray-700 font-medium shadow-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <span className="text-lg mr-2">💰</span>
                  Minimum Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-white border-2 border-orange-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 shadow-md hover:shadow-lg"
                  />
                </div>
              </div>
              <div className="relative group">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <span className="text-lg mr-2">💎</span>
                  Maximum Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="100.00"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-white border-2 border-orange-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 shadow-md hover:shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 animate-fadeIn">
          <p className="text-gray-700 font-medium">
            Showing <span className="text-orange-600 font-bold animate-pulse">{sweets.length}</span> products
          </p>
        </div>

        {/* Sweets Grid */}
        {sweets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-md animate-fadeIn">
            <p className="text-gray-600 text-xl">
              {searchQuery
                ? 'No sweets found matching your search.'
                : 'No sweets available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet, index) => (
              <div key={sweet.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <SweetCard sweet={sweet} />
              </div>
            ))}
          </div>
        )}

        {/* Copyright Bar */}
        <div className="mt-16 pt-8 border-t-2 border-orange-200">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4 py-6 px-6 bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg shadow-md">
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Just One More Bite</span> © 2025. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs">
              Made with ❤️ for all sweet lovers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
