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

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold playfair text-gray-900">
              Admin Panel
            </h1>
            <p className="text-gray-600 mt-1">Manage your sweet inventory</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingSweet(null);
              resetForm();
            }}
            className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-md"
          >
            {showAddForm ? 'Cancel' : 'Add New Sweet'}
          </button>
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-orange-500">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sweets.map((sweet) => (
                <tr key={sweet.id} className="hover:bg-orange-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{sweet.name}</td>
                  <td className="px-6 py-4 text-gray-600">{sweet.category}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">${sweet.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {sweet.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(sweet)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(sweet.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                      <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={restockData[sweet.id] || ''}
                        onChange={(e) => setRestockData({ ...restockData, [sweet.id]: e.target.value })}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                      <button
                        onClick={() => handleRestock(sweet.id)}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Restock
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
