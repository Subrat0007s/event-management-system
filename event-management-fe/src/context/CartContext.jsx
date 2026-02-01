import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const handleBookEvent = (event) => {
    const existingItem = cartItems.find(
      (item) => item.eventId === event.eventId,
    );

    if (existingItem) {
      alert("This event is already in your cart!");
      return;
    }

    setCartItems([...cartItems, { ...event, quantity: 1 }]);
    setShowCart(true);
  };

  const removeFromCart = (eventId) => {
    setCartItems(cartItems.filter((item) => item.eventId !== eventId));
  };

  const updateQuantity = (eventId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(eventId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.eventId === eventId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setShowCart(false);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        showCart,
        setShowCart,
        handleBookEvent,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
