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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingSweet(null);
            resetForm();
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          {showAddForm ? 'Cancel' : '+ Add Sweet'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="px-4 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="px-4 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="Price"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="px-4 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="px-4 py-2 border rounded"
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="px-4 py-2 border rounded col-span-2"
            />
          </div>
          <button
            onClick={editingSweet ? handleUpdate : handleAdd}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {editingSweet ? 'Update' : 'Add'} Sweet
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sweets.map((sweet) => (
              <tr key={sweet.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {sweet.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sweet.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${sweet.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sweet.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(sweet)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(sweet.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                  <div className="inline-flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={restockData[sweet.id] || ''}
                      onChange={(e) =>
                        setRestockData({
                          ...restockData,
                          [sweet.id]: e.target.value,
                        })
                      }
                      className="w-16 px-2 py-1 border rounded text-sm"
                    />
                    <button
                      onClick={() => handleRestock(sweet.id)}
                      className="text-green-600 hover:text-green-900 text-sm"
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
  );
}

export default AdminPanel;

