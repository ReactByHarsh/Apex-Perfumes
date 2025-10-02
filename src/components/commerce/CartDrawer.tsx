"use client";
import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export function CartDrawer() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    getSubtotal, 
    getTax, 
    getTotal 
  } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-primary-900 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-200 dark:border-primary-800">
          <h2 className="text-lg font-semibold text-primary-900 dark:text-neutral-100">
            Shopping Cart ({items.length})
          </h2>
          <Button variant="ghost" size="sm" onClick={closeCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-primary-600 dark:text-neutral-400 mb-4">
                Your cart is empty
              </p>
              <Button onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex space-x-4 border-b border-primary-100 dark:border-primary-800 pb-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-primary-900 dark:text-neutral-100 text-sm">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-neutral-400">
                      {item.product.type} · {formatPrice(item.product.price)}
                    </p>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-primary-100 dark:hover:bg-primary-800 rounded"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-primary-100 dark:hover:bg-primary-800 rounded"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 hover:bg-red-100 text-red-500 rounded ml-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-primary-900 dark:text-neutral-100">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-primary-200 dark:border-primary-800 p-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-primary-600 dark:text-neutral-400">Subtotal</span>
                <span className="text-primary-900 dark:text-neutral-100">{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary-600 dark:text-neutral-400">Tax</span>
                <span className="text-primary-900 dark:text-neutral-100">{formatPrice(getTax())}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-primary-900 dark:text-neutral-100">Total</span>
                <span className="text-primary-900 dark:text-neutral-100">{formatPrice(getTotal())}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                asChild 
                className="w-full"
                onClick={closeCart}
              >
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button 
                variant="secondary" 
                asChild 
                className="w-full"
                onClick={closeCart}
              >
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}