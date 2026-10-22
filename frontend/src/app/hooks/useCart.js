"use client";

import { useSyncExternalStore } from "react";

import {
  addToCart,
  clearCart,
  getCartSnapShot,
  getServerCartSnapshot,
  refreshCartItem,
  removeFromCart,
  subscribe,
  updateCartQuantity,
} from "../lib/cartStore";

function useCart() {
  const cart = useSyncExternalStore(
    subscribe,
    getCartSnapShot,
    getServerCartSnapshot,
  );

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const uniqueProductCount = cart.length;

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return {
    cart,
    itemCount,
    uniqueProductCount,
    subtotal,
    addToCart,
    refreshCartItem,
    updateQuantity: updateCartQuantity,
    removeFromCart,
    clearCart,
  };
}

export default useCart;
