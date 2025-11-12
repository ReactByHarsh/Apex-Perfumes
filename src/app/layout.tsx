"use client";
import React, { useEffect } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/commerce/CartDrawer';
import { ToastContainer } from '@/components/ui/Toast';
import { ProfileChecker } from '@/components/ui/ProfileChecker';
// import { AuthDebugPanel } from '@/components/ui/AuthDebugPanel';
import { useToast } from '@/hooks/useToast';
import { onAuthStateChange } from '@/lib/supabase/auth';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlist';
import { storage } from '@/lib/storage';
import { syncCartFromLocalStorage } from '@/lib/supabase/cart';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    const init = async () => {
      await useAuthStore.getState().loadUser();
      await useCartStore.getState().loadCart();
      await useWishlistStore.getState().loadWishlist();
    };
    init();

    const { data: { subscription } } = onAuthStateChange(async (authUser) => {
      await useAuthStore.getState().loadUser();

      if (authUser) {
        const localItems = storage.get('apex-cart') || [];
        if (Array.isArray(localItems) && localItems.length > 0) {
          const itemsToSync = localItems.map((item: any) => ({
            productId: item.product?.id ?? item.id,
            quantity: item.quantity ?? 1,
          }));
          try {
            await syncCartFromLocalStorage(authUser.id, itemsToSync);
            storage.remove('apex-cart');
          } catch (e) {
            console.error('Failed syncing local cart to Supabase:', e);
          }
        }
      }

      await useCartStore.getState().loadCart();
      await useWishlistStore.getState().loadWishlist();
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-neutral-100 dark:bg-primary-950 transition-colors duration-200">
          <ProfileChecker />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <ToastContainer toasts={toasts} onRemove={removeToast} />
          {/* {process.env.NODE_ENV === 'development' && <AuthDebugPanel />} */}
        </div>
      </body>
    </html>
  );
}