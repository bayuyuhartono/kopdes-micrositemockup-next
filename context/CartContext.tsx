"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_TO_CART"; product: Product; qty: number }
  | { type: "REMOVE_FROM_CART"; id: string }
  | { type: "UPDATE_QUANTITY"; id: string; qty: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] };

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + action.qty }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { product: action.product, quantity: action.qty }],
      };
    }
    case "REMOVE_FROM_CART":
      return { items: state.items.filter((i) => i.product.id !== action.id) };
    case "UPDATE_QUANTITY":
      if (action.qty <= 0) {
        return { items: state.items.filter((i) => i.product.id !== action.id) };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === action.id ? { ...i, quantity: action.qty } : i
        ),
      };
    case "CLEAR_CART":
      return { items: [] };
    case "LOAD_CART":
      return { items: action.items };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage first — must finish before the save effect is allowed to write.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("simkopdes_cart");
      if (saved) {
        dispatch({ type: "LOAD_CART", items: JSON.parse(saved) });
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Only persist after the initial load is done, so we never overwrite a saved
  // cart with the empty initial state.
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("simkopdes_cart", JSON.stringify(state.items));
  }, [state.items, loaded]);

  const addToCart = (product: Product, qty: number) =>
    dispatch({ type: "ADD_TO_CART", product, qty });

  const removeFromCart = (id: string) =>
    dispatch({ type: "REMOVE_FROM_CART", id });

  const updateQuantity = (id: string, qty: number) =>
    dispatch({ type: "UPDATE_QUANTITY", id, qty });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
