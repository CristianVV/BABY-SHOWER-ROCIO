"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import type { CartItem, CartState } from "@/types";

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (giftId: string) => void;
  updateItem: (giftId: string, updates: Partial<CartItem>) => void;
  setGuestInfo: (name: string, phone: string) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_ITEM"; payload: { giftId: string; updates: Partial<CartItem> } }
  | { type: "SET_GUEST_INFO"; payload: { name: string; phone: string } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState };

const initialState: CartState = {
  items: [],
  guestName: "",
  guestPhone: "",
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      // Check if item already exists
      const existingIndex = state.items.findIndex(
        (item) => item.giftId === action.payload.giftId
      );
      if (existingIndex >= 0) {
        // Update existing item
        const newItems = [...state.items];
        newItems[existingIndex] = action.payload;
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.giftId !== action.payload),
      };
    case "UPDATE_ITEM": {
      const index = state.items.findIndex(
        (item) => item.giftId === action.payload.giftId
      );
      if (index < 0) return state;
      const newItems = [...state.items];
      newItems[index] = { ...newItems[index], ...action.payload.updates };
      return { ...state, items: newItems };
    }
    case "SET_GUEST_INFO":
      return {
        ...state,
        guestName: action.payload.name,
        guestPhone: action.payload.phone,
      };
    case "CLEAR_CART":
      return initialState;
    case "LOAD_CART":
      return action.payload;
    default:
      return state;
  }
}

const STORAGE_KEY = "babyshower_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
      }
    } catch {
      // Ignore errors
    }
  }, []);

  // Save cart to sessionStorage on change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore errors
    }
  }, [state]);

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (giftId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: giftId });
  };

  const updateItem = (giftId: string, updates: Partial<CartItem>) => {
    dispatch({ type: "UPDATE_ITEM", payload: { giftId, updates } });
  };

  const setGuestInfo = (name: string, phone: string) => {
    dispatch({ type: "SET_GUEST_INFO", payload: { name, phone } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const totalAmount = state.items.reduce((sum, item) => sum + item.amount, 0);
  const itemCount = state.items.length;

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateItem,
        setGuestInfo,
        clearCart,
        totalAmount,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export { CartContext };
