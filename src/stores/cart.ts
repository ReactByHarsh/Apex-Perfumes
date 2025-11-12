import { create } from 'zustand';
import { storage } from '@/lib/storage';
import type { Product, CartItem } from '@/types';
import { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart as clearSupabaseCart,
  getCartItems,
  syncCartFromLocalStorage
} from '@/lib/supabase/cart';
import { useAuthStore } from '@/stores/auth';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  loadCart: () => void;
}

const CART_KEY = 'apex-cart';
const TAX_RATE = 0.08; // 8% tax rate

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: async (product: Product, quantity = 1, selectedSize = '100ml') => {
    const user = useAuthStore.getState().user;
    
    if (user) {
      const success = await addToCart(user.id, product.id, quantity, selectedSize);
      if (success) {
        await get().loadCart();
      }
    } else {
      const currentItems = get().items;
      const existingItem = currentItems.find(
        item => item.product.id === product.id && item.selectedSize === selectedSize
      );

      let newItems;
      if (existingItem) {
        newItems = currentItems.map(item =>
          item.product.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...currentItems, { 
          id: `${product.id}-${selectedSize}`, 
          product, 
          quantity,
          selectedSize
        }];
      }

      set({ items: newItems });
      storage.set(CART_KEY, newItems);
    }
  },

  removeItem: async (productId: string, selectedSize = '100ml') => {
    const user = useAuthStore.getState().user;
    
    if (user) {
      const success = await removeFromCart(user.id, productId, selectedSize);
      if (success) {
        await get().loadCart();
      }
    } else {
      const newItems = get().items.filter(
        item => !(item.product.id === productId && item.selectedSize === selectedSize)
      );
      set({ items: newItems });
      storage.set(CART_KEY, newItems);
    }
  },

  updateQuantity: async (productId: string, quantity: number, selectedSize = '100ml') => {
    if (quantity <= 0) {
      await get().removeItem(productId, selectedSize);
      return;
    }

    const user = useAuthStore.getState().user;
    
    if (user) {
      const success = await updateCartItemQuantity(user.id, productId, quantity, selectedSize);
      if (success) {
        await get().loadCart();
      }
    } else {
      const newItems = get().items.map(item =>
        item.product.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      );

      set({ items: newItems });
      storage.set(CART_KEY, newItems);
    }
  },

  clearCart: async () => {
    const user = useAuthStore.getState().user;
    
    if (user) {
      const success = await clearSupabaseCart(user.id);
      if (success) {
        set({ items: [] });
      }
    } else {
      set({ items: [] });
      storage.remove(CART_KEY);
    }
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },

  getTax: () => {
    return get().getSubtotal() * TAX_RATE;
  },

  getTotal: () => {
    return get().getSubtotal() + get().getTax();
  },

  loadCart: async () => {
    const user = useAuthStore.getState().user;
    
    if (user) {
      const cartItems = await getCartItems(user.id);
      if (cartItems) {
        const mapped = cartItems.map(ci => ({
          id: `${ci.product_id}-${ci.selected_size}`,
          quantity: ci.quantity,
          selectedSize: ci.selected_size,
          product: {
            id: ci.product_id,
            name: ci.product_name,
            brand: '',
            price: ci.product_price,
            originalPrice: undefined,
            images: ci.product_images,
            category: 'unisex' as const,
            type: 'EDP' as const,
            notes: { top: [] as string[], heart: [] as string[], base: [] as string[] },
            longevity: 0,
            sillage: 'moderate' as const,
            rating: 0,
            stock: 0,
            description: '',
            isNew: false,
            isBestSeller: false,
            isOnSale: false,
          },
        }));
        set({ items: mapped });
        
        const localCart = storage.get<CartItem[]>(CART_KEY) || [];
        if (localCart.length > 0) {
          const localCartItems = localCart.map(item => ({ productId: item.product.id, quantity: item.quantity }));
          await syncCartFromLocalStorage(user.id, localCartItems);
          storage.remove(CART_KEY);
          const updatedCartItems = await getCartItems(user.id);
          if (updatedCartItems) {
            const updatedMapped = updatedCartItems.map(ci => ({
              id: `${ci.product_id}-${ci.selected_size}`,
              quantity: ci.quantity,
              selectedSize: ci.selected_size,
              product: {
                id: ci.product_id,
                name: ci.product_name,
                brand: '',
                price: ci.product_price,
                originalPrice: undefined,
                images: ci.product_images,
                category: 'unisex' as const,
                type: 'EDP' as const,
                notes: { top: [] as string[], heart: [] as string[], base: [] as string[] },
                longevity: 0,
                sillage: 'moderate' as const,
                rating: 0,
                stock: 0,
                description: '',
                isNew: false,
                isBestSeller: false,
                isOnSale: false,
              },
            }));
            set({ items: updatedMapped });
          }
        }
      }
    } else {
      const savedCart = storage.get<CartItem[]>(CART_KEY) || [];
      set({ items: savedCart });
    }
  },
}));