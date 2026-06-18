// import { createContext, useContext, useState } from 'react';
// import type { CartItem } from '../types';

// interface CartContextType {
//   items: CartItem[];
//   addItem: (item: CartItem) => void;
//   removeItem: (productId: string, type: string) => void;
//   updateQuantity: (productId: string, type: string, quantity: number) => void;
//   clearCart: () => void;
//   getTotalAmount: () => number;
//   getTotalItems: () => number;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// const CART_STORAGE_KEY = 'kilo-biryani-cart';

// const loadCartFromStorage = (): CartItem[] => {
//   if (typeof window === 'undefined') {
//     return [];
//   }

//   try {
//     const stored = window.localStorage.getItem(CART_STORAGE_KEY);
//     if (!stored) {
//       return [];
//     }
//     const parsed = JSON.parse(stored) as CartItem[];
//     return Array.isArray(parsed) ? parsed : [];
//   } catch {
//     return [];
//   }
// };

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);

//   const syncCartStorage = (nextItems: CartItem[]) => {
//     try {
//       window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
//     } catch {
//       // Ignore storage errors
//     }
//   };

//   const addItem = (newItem: CartItem) => {
//     setItems((prevItems) => {
//       const existingItem = prevItems.find(
//         (item) => item.productId === newItem.productId && item.type === newItem.type
//       );
//       const nextItems = existingItem
//         ? prevItems.map((item) =>
//             item.productId === newItem.productId && item.type === newItem.type
//               ? { ...item, quantity: item.quantity + newItem.quantity }
//               : item
//           )
//         : [...prevItems, newItem];

//       syncCartStorage(nextItems);
//       return nextItems;
//     });
//   };

//   const removeItem = (productId: string, type: string) => {
//     setItems((prevItems) => {
//       const nextItems = prevItems.filter((item) => !(item.productId === productId && item.type === type));
//       syncCartStorage(nextItems);
//       return nextItems;
//     });
//   };

//   const updateQuantity = (productId: string, type: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeItem(productId, type);
//       return;
//     }
//     setItems((prevItems) => {
//       const nextItems = prevItems.map((item) =>
//         item.productId === productId && item.type === type ? { ...item, quantity } : item
//       );
//       syncCartStorage(nextItems);
//       return nextItems;
//     });
//   };

//   const clearCart = () => {
//     const nextItems: CartItem[] = [];
//     syncCartStorage(nextItems);
//     setItems(nextItems);
//   };

//   const getTotalAmount = () => {
//     return items.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const getTotalItems = () => {
//     return items.reduce((total, item) => total + item.quantity, 0);
//   };

//   return (
//     <CartContext.Provider
//       value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotalAmount, getTotalItems }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within CartProvider');
//   }
//   return context;
// };

import { createContext, useContext, useState } from 'react';
import type { CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, type: string) => void;
  updateQuantity: (productId: string, type: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY      = 'kilo-biryani-cart';
const TIMESTAMP_KEY = 'kilo-biryani-cart-timestamp';
const TWELVE_HOURS  = 12 * 60 * 60 * 1000;

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    // Check age of cart
    const timestamp = window.localStorage.getItem(TIMESTAMP_KEY);
    if (timestamp && Date.now() - Number(timestamp) > TWELVE_HOURS) {
      window.localStorage.removeItem(CART_KEY);
      window.localStorage.removeItem(TIMESTAMP_KEY);
      return [];
    }

    const stored = window.localStorage.getItem(CART_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);

  const syncCartStorage = (nextItems: CartItem[]) => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(nextItems));
      window.localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
    } catch {
      // Ignore storage errors
    }
  };

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === newItem.productId && item.type === newItem.type
      );
      const nextItems = existingItem
        ? prevItems.map((item) =>
            item.productId === newItem.productId && item.type === newItem.type
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          )
        : [...prevItems, newItem];
      syncCartStorage(nextItems);
      return nextItems;
    });
  };

  const removeItem = (productId: string, type: string) => {
    setItems((prevItems) => {
      const nextItems = prevItems.filter(
        (item) => !(item.productId === productId && item.type === type)
      );
      syncCartStorage(nextItems);
      return nextItems;
    });
  };

  const updateQuantity = (productId: string, type: string, quantity: number) => {
    if (quantity <= 0) { removeItem(productId, type); return; }
    setItems((prevItems) => {
      const nextItems = prevItems.map((item) =>
        item.productId === productId && item.type === type ? { ...item, quantity } : item
      );
      syncCartStorage(nextItems);
      return nextItems;
    });
  };

  const clearCart = () => {
    window.localStorage.removeItem(CART_KEY);
    window.localStorage.removeItem(TIMESTAMP_KEY);
    setItems([]);
  };

  const getTotalAmount = () =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  const getTotalItems = () =>
    items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotalAmount, getTotalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};