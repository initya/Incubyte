import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (sweet) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === sweet.id);
      
      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map(item =>
          item.id === sweet.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...sweet, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (sweetId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== sweetId));
  };

  const updateQuantity = (sweetId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sweetId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === sweetId
            ? { ...item, quantity: Math.min(quantity, item.quantity_available) }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
