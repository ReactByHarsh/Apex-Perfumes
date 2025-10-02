"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/commerce/ProductCard';
import type { Product } from '@/types';
import { getProducts } from '@/lib/supabase/products';
import { useAuthStore } from '@/stores/auth';

// Supabase-backed products state
const initialProducts: Product[] = [];

export function Collections() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuthStore();

  const categoryTitle = "Men's Fragrances";

  // Map Supabase product row into app Product type
  function mapRowToProduct(row: any): Product {
    const notes = row.notes || { top: [], heart: [], base: [] };
    return {
      id: String(row.id),
      name: row.name || '',
      brand: row.brand || '',
      price: Number(row.price ?? 0),
      originalPrice: row.original_price ?? undefined,
      images: Array.isArray(row.images) ? row.images : [],
      category: (row.category || 'men') as Product['category'],
      type: (row.type || 'EDP') as Product['type'],
      notes: {
        top: Array.isArray(notes.top) ? notes.top : [],
        heart: Array.isArray(notes.heart) ? notes.heart : [],
        base: Array.isArray(notes.base) ? notes.base : [],
      },
      longevity: Number(row.longevity ?? 0),
      sillage: (row.sillage || 'moderate') as Product['sillage'],
      rating: Number(row.rating ?? 0),
      stock: Number(row.stock ?? 0),
      description: row.description || '',
      isNew: !!row.is_new,
      isBestSeller: !!row.is_best_seller,
      isOnSale: !!row.is_on_sale,
    };
  }

  // Fetch Men's products from Supabase on component mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const resp = await getProducts(
          {
            category: 'men', // Always load men's products
          },
          1,
          100
        );
        const mapped = (resp.products || []).map(mapRowToProduct);
        if (isMounted) {
          setProducts(mapped);
        }
      } catch (e) {
        console.error('Failed to load products', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [user]); // Re-run when auth state changes to avoid post-login stalls

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-950 dark:text-neutral-100 mb-4 tracking-wide">
            {categoryTitle}
          </h1>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-primary-900 rounded-lg shadow-md p-4 animate-pulse">
                <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-primary-600 dark:text-neutral-400 mb-4">
              No men's products found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}