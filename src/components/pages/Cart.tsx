"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { getCartItems, calculateCartTotal, updateCartItemQuantity, removeFromCart } from '@/lib/supabase/cart';
import { supabase } from '@/lib/supabase/client';

interface CartItemDisplay {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_images: string[];
  quantity: number;
  selected_size: string;
  total_price: number;
}

interface CartTotals {
  subtotal: number;
  discount: number;
  total: number;
  promotion_text: string | null;
}

export function Cart() {
  const { user, isInitialized } = useAuthStore();
  const [cartItems, setCartItems] = useState<CartItemDisplay[]>([]);
  const [totals, setTotals] = useState<CartTotals>({ subtotal: 0, discount: 0, total: 0, promotion_text: null });
  const [loading, setLoading] = useState(true);

  // Refresh cart data function
  const refreshCart = async (userId: string) => {
    try {
      const cartData = await getCartItems(userId);
      setCartItems(cartData);

      const totalsData = await calculateCartTotal(userId);
      setTotals(totalsData);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  // Load cart items from backend with real-time subscription
  useEffect(() => {
    async function loadCart() {
      // Wait for auth to finish initializing
      if (!isInitialized) {
        return;
      }

      if (!user?.id) {
        setLoading(false);
        setCartItems([]);
        setTotals({ subtotal: 0, discount: 0, total: 0, promotion_text: null });
        return;
      }

      try {
        setLoading(true);
        
        // Initial fetch
        await refreshCart(user.id);

        // Subscribe to real-time changes on cart_items table
        const subscription = supabase
          .channel(`cart-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'cart_items',
              filter: `user_id=eq.${user.id}`,
            },
            (payload: any) => {
              console.log('Cart changed:', payload);
              refreshCart(user.id);
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    }

    const cleanup = loadCart();

    return () => {
      if (cleanup instanceof Promise) {
        cleanup.then(fn => fn?.());
      }
    };
  }, [user?.id, isInitialized]);

  const handleQuantityChange = async (productId: string, selectedSize: string, newQuantity: number) => {
    if (!user?.id) return;

    try {
      if (newQuantity <= 0) {
        await removeFromCart(user.id, productId, selectedSize);
      } else {
        await updateCartItemQuantity(user.id, productId, newQuantity, selectedSize);
      }
      
      // Reload cart data
      await refreshCart(user.id);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemove = async (productId: string, selectedSize: string) => {
    if (!user?.id) return;

    try {
      await removeFromCart(user.id, productId, selectedSize);
      
      // Reload cart data
      await refreshCart(user.id);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-500 mx-auto mb-6"></div>
          <p className="text-slate-600 dark:text-gray-300 text-lg font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <div className="inline-block bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 p-8 rounded-full">
              <ShoppingBag className="h-16 w-16 text-amber-500 mx-auto opacity-75" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-xl text-slate-600 dark:text-gray-300 mb-12 font-medium">
            Discover our curated collection of luxury fragrances and find your signature scent
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-lg hover:shadow-xl transition-all">
              <Link href="/collections/men">
                Browse Men's Collection
              </Link>
            </Button>
            <Button size="lg" asChild variant="secondary" className="border-2 border-amber-400 text-amber-600 dark:text-amber-400">
              <Link href="/collections/women">
                Browse Women's Collection
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <span className="text-amber-600 dark:text-amber-400 text-sm font-semibold tracking-widest uppercase">Shopping</span>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mt-2">
            Your Cart
          </h1>
          <p className="text-slate-600 dark:text-gray-300 mt-2 text-lg">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div 
                key={`${item.product_id}-${item.selected_size}`}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image */}
                  <div className="shrink-0">
                    <img
                      src={item.product_images[0] || '/placeholder.jpg'}
                      alt={item.product_name}
                      className="w-full md:w-32 h-32 object-cover rounded-lg bg-slate-100 dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product_id}`} className="block mb-3 group">
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {item.product_name}
                      </h3>
                    </Link>

                    {/* Size Badge */}
                    <div className="inline-flex items-center gap-3 mb-4">
                      <span className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 text-sm font-bold px-4 py-2 rounded-full border border-amber-200 dark:border-amber-800">
                        Size: {item.selected_size}
                      </span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold text-lg">
                        {formatPrice(item.product_price)}
                      </span>
                    </div>

                    {/* Quantity Controls & Price */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                          Qty:
                        </span>
                        <div className="flex items-center border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.selected_size, item.quantity - 1)}
                            className="px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold text-slate-900 dark:text-white"
                          >
                            −
                          </button>
                          <span className="px-6 py-2 min-w-[4rem] text-center font-bold text-slate-900 dark:text-white border-l border-r border-slate-300 dark:border-slate-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.selected_size, item.quantity + 1)}
                            className="px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold text-slate-900 dark:text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="text-right">
                          <p className="text-3xl font-bold text-slate-900 dark:text-white">
                            {formatPrice(item.total_price)}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
                            {formatPrice(item.product_price)} × {item.quantity}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(item.product_id, item.selected_size)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors rounded-lg p-3"
                          title="Remove item from cart"
                        >
                          <Trash2 className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-7 border-2 border-amber-200 dark:border-amber-900/30 sticky top-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
                <span className="text-2xl mr-3">💳</span>
                Order Summary
              </h2>

              <div className="space-y-4 pb-6 border-b-2 border-slate-300 dark:border-slate-700">
                <div className="flex justify-between text-slate-700 dark:text-gray-300 font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatPrice(totals.subtotal)}</span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <span>Discount</span>
                    <span>-{formatPrice(totals.discount)}</span>
                  </div>
                )}

                {totals.promotion_text && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-300 dark:border-emerald-800 rounded-lg p-3 text-sm">
                    <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center">
                      <span className="text-lg mr-2">✨</span>{totals.promotion_text}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-6 mb-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-900/30">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Total Amount</span>
                <span className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
                  {formatPrice(totals.total)}
                </span>
              </div>

              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  asChild
                >
                  <Link href="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>

                <Button 
                  size="lg" 
                  variant="secondary"
                  className="w-full border-2 border-amber-400 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-bold py-4 text-lg"
                  asChild
                >
                  <Link href="/collections/men">
                    Continue Shopping
                  </Link>
                </Button>
              </div>

              {/* Extra Info */}
              <div className="mt-8 space-y-3 text-sm font-medium">
                <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-lg">🚚</span>
                  <span className="text-slate-700 dark:text-gray-300">Free shipping on orders above ₹5000</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-lg">✅</span>
                  <span className="text-slate-700 dark:text-gray-300">100% Authentic Guarantee</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-lg">↩️</span>
                  <span className="text-slate-700 dark:text-gray-300">30-day Return Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}