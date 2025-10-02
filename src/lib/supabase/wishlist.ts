import { supabase } from './client'
import type { Database } from '@/types/supabase'

type WishlistItem = Database['public']['Views']['wishlist_items_view']['Row']

export interface WishlistItemWithProduct {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product_name: string
  product_price: number
  product_images: string[]
  product_brand: string
  product_category: string
  product_type: string
  product_rating: number
  product_stock: number
  product_description: string
  is_new: boolean
  is_best_seller: boolean
  is_on_sale: boolean
}

// Get user's wishlist items
export async function getWishlistItems(userId: string): Promise<WishlistItemWithProduct[]> {
  const { data, error } = await supabase
    .from('wishlist_items_view')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching wishlist:', error)
    return []
  }

  return (data || []).map(item => ({
    id: item.id || '',
    user_id: item.user_id || '',
    product_id: item.product_id || '',
    created_at: item.created_at || '',
    product_name: item.product_name || '',
    product_price: item.product_price || 0,
    product_images: item.product_images || [],
    product_brand: item.brand || '',
    product_category: item.category || '',
    product_type: item.type || '',
    product_rating: item.rating || 0,
    product_stock: item.stock || 0,
    product_description: item.description || '',
    is_new: item.is_new || false,
    is_best_seller: item.is_best_seller || false,
    is_on_sale: item.is_on_sale || false,
  }))
}

// Add item to wishlist
export async function addToWishlist(userId: string, productId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('add_to_wishlist', {
      p_user_id: userId,
      p_product_id: productId
    })

    if (error) {
      console.error('Error adding to wishlist:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return false
  }
}

// Remove item from wishlist
export async function removeFromWishlist(userId: string, productId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('remove_from_wishlist', {
      p_user_id: userId,
      p_product_id: productId
    })

    if (error) {
      console.error('Error removing from wishlist:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return false
  }
}

// Check if item is in wishlist
export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('is_in_wishlist', {
      p_user_id: userId,
      p_product_id: productId
    })

    if (error) {
      console.error('Error checking wishlist:', error)
      return false
    }

    return data || false
  } catch (error) {
    console.error('Error checking wishlist:', error)
    return false
  }
}

// Clear entire wishlist
export async function clearWishlist(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('clear_wishlist', {
      p_user_id: userId
    })

    if (error) {
      console.error('Error clearing wishlist:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error clearing wishlist:', error)
    return false
  }
}