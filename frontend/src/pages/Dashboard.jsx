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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl">Loading sweets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-2xl">
          Error loading sweets: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🍬 Sweet Shop Dashboard
        </h1>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search sweets by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="100.00"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {sweets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-xl">
            {searchQuery
              ? 'No sweets found matching your search.'
              : 'No sweets available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweets.map((sweet) => (
            <SweetCard key={sweet.id} sweet={sweet} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

