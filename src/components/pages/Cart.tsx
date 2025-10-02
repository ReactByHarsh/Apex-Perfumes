"use client";
import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export function Cart() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getSubtotal, 
    getTax, 
    getTotal,
    clearCart 
  } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-primary-950 dark:text-neutral-100 mb-8">
            Your Cart is Empty
          </h1>
          <p className="text-primary-600 dark:text-neutral-400 mb-8">
            Discover our curated collection of luxury fragrances
          </p>
          <Button size="lg" asChild>
            <Link href="/collections/all">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary-950 dark:text-neutral-100">
            Shopping Cart ({items.length})
          </h1>
          <Button variant="ghost" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-primary-900 rounded-lg p-6 shadow-sm border border-primary-100 dark:border-primary-800"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Product Image */}
                  <Link 
                    href={`/product/${item.product.id}`}
                    className="shrink-0"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full md:w-32 h-32 object-cover rounded-md hover:opacity-80 transition-opacity"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/product/${item.product.id}`}
                      className="block"
                    >
                      <h3 className="font-semibold text-primary-950 dark:text-neutral-100 mb-1 hover:text-accent-500 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-primary-600 dark:text-neutral-400 mb-2">
                      {item.product.brand} · {item.product.type}
                    </p>
                    <p className="text-sm text-primary-600 dark:text-neutral-400 mb-4">
                      {item.product.notes.top.slice(0, 3).join(', ')}...
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-primary-900 dark:text-neutral-100">
                          Quantity:
                        </span>
                        <div className="flex items-center border border-primary-200 dark:border-primary-800 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-2 hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-2 hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-primary-950 dark:text-neutral-100">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          <p className="text-sm text-primary-600 dark:text-neutral-400">
                            {formatPrice(item.product.price)} each
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
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
            <div className="bg-white dark:bg-primary-900 rounded-lg p-6 shadow-sm border border-primary-100 dark:border-primary-800 sticky top-8">
              <h2 className="text-xl font-semibold text-primary-950 dark:text-neutral-100 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-primary-600 dark:text-neutral-400">Subtotal</span>
                  <span className="font-medium text-primary-950 dark:text-neutral-100">
                    {formatPrice(getSubtotal())}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-primary-600 dark:text-neutral-400">
                    Tax (estimated)
                  </span>
                  <span className="font-medium text-primary-950 dark:text-neutral-100">
                    {formatPrice(getTax())}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-primary-600 dark:text-neutral-400">Shipping</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {getSubtotal() >= 100 ? 'Free' : formatPrice(15)}
                  </span>
                </div>
                
                <div className="border-t border-primary-200 dark:border-primary-800 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-primary-950 dark:text-neutral-100">Total</span>
                    <span className="text-primary-950 dark:text-neutral-100">
                      {formatPrice(getTotal() + (getSubtotal() >= 100 ? 0 : 15))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button size="lg" className="w-full" asChild>
                  <Link href="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>
                
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/collections/all">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>

              {/* Shipping Info */}
              <div className="mt-6 pt-6 border-t border-primary-200 dark:border-primary-800">
                <div className="text-sm text-primary-600 dark:text-neutral-400 space-y-2">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Free shipping on orders over $100
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Express delivery available
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    30-day return policy
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}