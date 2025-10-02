import { supabase } from './client'
import type { Database } from '@/types/supabase'

type CartItem = Database['public']['Views']['cart_items_view']['Row']

export interface CartItemWithProduct {
  id: string
  user_id: string
  product_id: string
  quantity: number
  product_name: string
  product_price: number
  product_images: string[]
  total_price: number
}

// Get user's cart items
export async function getCartItems(userId: string): Promise<CartItemWithProduct[]> {
  const { data, error } = await supabase
    .from('cart_items_view')
    .select('*')
    .eq('user_id', userId)
    .order('id')

  if (error) {
    throw error
  }

  return (data || []).map(item => ({
    id: item.id || '',
    user_id: item.user_id || '',
    product_id: item.product_id || '',
    quantity: item.quantity || 0,
    product_name: item.product_name || '',
    product_price: item.product_price || 0,
    product_images: item.product_images || [],
    total_price: item.total_price || 0
  }))
}

// Add item to cart or update quantity if exists
export async function addToCart(userId: string, productId: string, quantity: number = 1): Promise<boolean> {
  const { error } = await supabase.rpc('upsert_cart_item', {
    p_user_id: userId,
    p_product_id: productId,
    p_quantity: quantity
  })

  if (error) {
    throw error
  }

  return true;
}

// Remove item from cart
export async function removeFromCart(userId: string, productId: string): Promise<boolean> {
  const { error } = await supabase.rpc('remove_cart_item', {
    p_user_id: userId,
    p_product_id: productId
  })

  if (error) {
    throw error
  }

  return true;
}

// Update item quantity in cart
export async function updateCartItemQuantity(
  userId: string, 
  productId: string, 
  quantity: number
): Promise<boolean> {
  if (quantity <= 0) {
    await removeFromCart(userId, productId)
    return true;
  }

  const { error } = await supabase.rpc('set_cart_item_quantity', {
    p_user_id: userId,
    p_product_id: productId,
    p_quantity: quantity
  })

  if (error) {
    throw error
  }

  return true;
}

// Clear entire cart
export async function clearCart(userId: string): Promise<boolean> {
  const { error } = await supabase.rpc('clear_cart', {
    p_user_id: userId
  })

  if (error) {
    throw error
  }

  return true;
}

// Get cart summary (total items and total price)
export async function getCartSummary(userId: string): Promise<{
  totalItems: number
  totalPrice: number
  itemCount: number
}> {
  const cartItems = await getCartItems(userId)
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.total_price, 0)
  const itemCount = cartItems.length

  return {
    totalItems,
    totalPrice,
    itemCount
  }
}

// Check if product is in cart
export async function isProductInCart(userId: string, productId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw error
  }

  return !!data
}

// Get cart item quantity for a specific product
export async function getCartItemQuantity(userId: string, productId: string): Promise<number> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw error
  }

  return data?.quantity || 0
}

// Sync cart with local storage (for guest users)
export async function syncCartFromLocalStorage(userId: string, localCartItems: Array<{
  productId: string
  quantity: number
}>): Promise<void> {
  // Clear existing cart first
  await clearCart(userId)

  // Add items from local storage
  for (const item of localCartItems) {
    await addToCart(userId, item.productId, item.quantity)
  }
}

// Validate cart items (check stock availability)
export async function validateCartItems(userId: string): Promise<{
  valid: boolean
  issues: Array<{
    productId: string
    productName: string
    issue: 'out_of_stock' | 'insufficient_stock'
    availableStock: number
    requestedQuantity: number
  }>
}> {
  const cartItems = await getCartItems(userId)
  const issues: Array<{
    productId: string
    productName: string
    issue: 'out_of_stock' | 'insufficient_stock'
    availableStock: number
    requestedQuantity: number
  }> = []

  for (const item of cartItems) {
    // Get current product stock
    const { data: product, error } = await supabase
      .from('products')
      .select('stock')
      .eq('id', item.product_id)
      .single()

    if (error) continue

    if (product.stock === 0) {
      issues.push({
        productId: item.product_id,
        productName: item.product_name,
        issue: 'out_of_stock',
        availableStock: 0,
        requestedQuantity: item.quantity
      })
    } else if (product.stock < item.quantity) {
      issues.push({
        productId: item.product_id,
        productName: item.product_name,
        issue: 'insufficient_stock',
        availableStock: product.stock,
        requestedQuantity: item.quantity
      })
    }
  }

  return {
    valid: issues.length === 0,
    issues
  }
}