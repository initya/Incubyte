import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sweetsApi } from '../api/sweets';

function AdminPanel() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    imageUrl: '',
  });
  const [restockData, setRestockData] = useState({});

  const queryClient = useQueryClient();

  const { data: sweets = [], isLoading } = useQuery({
    queryKey: ['sweets'],
    queryFn: () => sweetsApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: sweetsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      setShowAddForm(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => sweetsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      setEditingSweet(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: sweetsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
    },
  });

  const restockMutation = useMutation({
    mutationFn: ({ id, quantity }) => sweetsApi.restock(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      setRestockData({});
    },
  });

  const resetForm = () => {
    setFormData({ name: '', category: '', price: '', quantity: '', imageUrl: '' });
  };

  const handleAdd = () => {
    createMutation.mutate({
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      imageUrl: formData.imageUrl || undefined,
    });
  };

  const handleUpdate = () => {
    updateMutation.mutate({
      id: editingSweet.id,
      data: {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        imageUrl: formData.imageUrl || undefined,
      },
    });
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      imageUrl: sweet.imageUrl || '',
    });
    setShowAddForm(true);
  };

  const handleRestock = (sweetId) => {
    const quantity = parseInt(restockData[sweetId] || '0');
    if (quantity > 0) {
      restockMutation.mutate({ id: sweetId, quantity });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-orange-50">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Calculate summary stats
  const totalProducts = sweets.length;
  const totalStock = sweets.reduce((sum, sweet) => sum + sweet.quantity, 0);
  const lowStockItems = sweets.filter(sweet => sweet.quantity > 0 && sweet.quantity <= 50).length;
  const categories = new Set(sweets.map(sweet => sweet.category)).size;

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: '❌' };
    if (quantity <= 50) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: '✅' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold playfair text-gray-900 mb-2">
              📊 Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage your sweet inventory with ease</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingSweet(null);
              resetForm();
            }}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {showAddForm ? '❌ Cancel' : '➕ Add New Sweet'}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Products Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
            <p className="text-xs text-blue-600 mt-4">Active items in catalog</p>
          </div>

          {/* Total Stock Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Total Stock</p>
                <p className="text-3xl font-bold text-gray-900">{totalStock}</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
            <p className="text-xs text-green-600 mt-4">Units available</p>
          </div>

          {/* Low Stock Items Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Low Stock Items</p>
                <p className="text-3xl font-bold text-gray-900">{lowStockItems}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
            <p className="text-xs text-yellow-600 mt-4">Needs attention</p>
          </div>

          {/* Categories Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Categories</p>
                <p className="text-3xl font-bold text-gray-900">{categories}</p>
              </div>
              <div className="text-4xl">🏷️</div>
            </div>
            <p className="text-xs text-purple-600 mt-4">Product types</p>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold playfair text-gray-900 mb-6">
              {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Sweet name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <button
              onClick={editingSweet ? handleUpdate : handleAdd}
              className="mt-6 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              {editingSweet ? 'Update Sweet' : 'Add Sweet'}
            </button>
          </div>
        )}

        {/* Sweets Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-orange-500 to-orange-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Stock Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {sweets.map((sweet) => {
                  const stockInfo = getStockStatus(sweet.quantity);
                  return (
                    <tr
                      key={sweet.id}
                      className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-300 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {sweet.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{sweet.name}</p>
                            <p className="text-xs text-gray-500">ID: {sweet.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {sweet.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">${sweet.price.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${stockInfo.color}`}>
                          {stockInfo.icon} {sweet.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(sweet)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200 hover:scale-110"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteMutation.mutate(sweet.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200 hover:scale-110"
                            title="Delete"
                          >
                            🗑️
                          </button>
                          <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
                            <input
                              type="number"
                              placeholder="Qty"
                              min="1"
                              value={restockData[sweet.id] || ''}
                              onChange={(e) => setRestockData({ ...restockData, [sweet.id]: e.target.value })}
                              className="w-12 px-2 py-1 border-0 bg-transparent focus:outline-none text-sm font-medium text-gray-700"
                            />
                            <button
                              onClick={() => handleRestock(sweet.id)}
                              className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-all duration-200 hover:scale-110"
                              title="Restock"
                            >
                              ➕
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {sweets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No sweets found. Add some delicious items! 🍬</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
