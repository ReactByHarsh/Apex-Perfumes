"use client";
import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, Heart, ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductCard } from '@/components/commerce/ProductCard';
import { formatPrice, formatRating } from '@/lib/utils';
import productsData from '@/data/products.json';
import type { Product } from '@/types';

const products = productsData as Product[];

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();

  const product = products.find(p => p.id === id);
  
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-950 dark:text-neutral-100 mb-4">
            Product Not Found
          </h1>
          <Button asChild>
            <Link href="/collections/all">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const getSillageDescription = (sillage: string) => {
    switch (sillage) {
      case 'soft': return 'Intimate - Close to skin projection';
      case 'moderate': return 'Moderate - Arms length projection';
      case 'strong': return 'Strong - Room filling presence';
      default: return sillage;
    }
  };

  const getLongevityDescription = (hours: number) => {
    if (hours <= 4) return 'Poor (0-4 hours)';
    if (hours <= 6) return 'Weak (4-6 hours)';
    if (hours <= 8) return 'Moderate (6-8 hours)';
    if (hours <= 12) return 'Good (8-12 hours)';
    return 'Excellent (12+ hours)';
  };

  // JSON-LD Schema for SEO
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "ratingCount": "100"
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/" className="text-primary-600 dark:text-neutral-400 hover:text-accent-500">
            Home
          </Link>
          <span className="text-primary-400">/</span>
          <Link 
            href={`/collections/${product.category}`}
            className="text-primary-600 dark:text-neutral-400 hover:text-accent-500 capitalize"
          >
            {product.category === 'unisex' ? 'Unisex' : product.category}
          </Link>
          <span className="text-primary-400">/</span>
          <span className="text-primary-900 dark:text-neutral-100">{product.name}</span>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-neutral-100 dark:bg-primary-900">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-accent-500'
                        : 'border-primary-200 dark:border-primary-800'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              {product.isNew && <Badge variant="accent">New</Badge>}
              {product.isBestSeller && <Badge variant="success">Best Seller</Badge>}
              {product.isOnSale && <Badge variant="danger">Sale</Badge>}
            </div>

            {/* Title and Brand */}
            <div>
              <p className="text-sm text-primary-600 dark:text-neutral-400 mb-1">
                {product.brand} · {product.type}
              </p>
              <h1 className="text-3xl font-bold text-primary-950 dark:text-neutral-100 mb-4">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-medium text-primary-900 dark:text-neutral-100">
                  {formatRating(product.rating)}
                </span>
              </div>
              <span className="text-sm text-primary-600 dark:text-neutral-400">
                (100 reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-primary-950 dark:text-neutral-100">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-primary-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-primary-700 dark:text-neutral-300 leading-relaxed">
              {product.description}
            </p>

            {/* Fragrance Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary-950 dark:text-neutral-100">
                Fragrance Notes
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-primary-900 dark:text-neutral-100 mb-2">Top Notes</h4>
                  <p className="text-sm text-primary-600 dark:text-neutral-400">
                    {product.notes.top.join(', ')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-primary-900 dark:text-neutral-100 mb-2">Heart Notes</h4>
                  <p className="text-sm text-primary-600 dark:text-neutral-400">
                    {product.notes.heart.join(', ')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-primary-900 dark:text-neutral-100 mb-2">Base Notes</h4>
                  <p className="text-sm text-primary-600 dark:text-neutral-400">
                    {product.notes.base.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 dark:bg-primary-900 p-4 rounded-lg">
                <h4 className="font-medium text-primary-900 dark:text-neutral-100 mb-1">Longevity</h4>
                <p className="text-sm text-primary-600 dark:text-neutral-400">
                  {getLongevityDescription(product.longevity)}
                </p>
              </div>
              <div className="bg-neutral-50 dark:bg-primary-900 p-4 rounded-lg">
                <h4 className="font-medium text-primary-900 dark:text-neutral-100 mb-1">Projection</h4>
                <p className="text-sm text-primary-600 dark:text-neutral-400">
                  {getSillageDescription(product.sillage)}
                </p>
              </div>
            </div>

            {/* Stock Status */}
            {product.stock > 0 ? (
              <p className="text-green-600 dark:text-green-400 text-sm">
                ✓ In stock ({product.stock} available)
              </p>
            ) : (
              <p className="text-red-600 dark:text-red-400 text-sm">
                Out of stock
              </p>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium text-primary-900 dark:text-neutral-100">
                  Quantity:
                </label>
                <div className="flex items-center border border-primary-200 dark:border-primary-800 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-primary-50 dark:hover:bg-primary-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-primary-50 dark:hover:bg-primary-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="px-4"
                  size="lg"
                >
                  <Heart 
                    className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6 border-t border-primary-200 dark:border-primary-800">
              <div className="flex items-center text-sm text-primary-600 dark:text-neutral-400">
                <Truck className="h-4 w-4 mr-2" />
                Free shipping on orders over $100
              </div>
              <div className="flex items-center text-sm text-primary-600 dark:text-neutral-400">
                <Shield className="h-4 w-4 mr-2" />
                100% authentic guarantee
              </div>
              <div className="flex items-center text-sm text-primary-600 dark:text-neutral-400">
                <RotateCcw className="h-4 w-4 mr-2" />
                30-day return policy
              </div>
            </div>

            {/* Ingredients Disclaimer */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-sm">
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>Please note:</strong> This fragrance may contain allergens. 
                Please review the full ingredient list before use if you have sensitive skin.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-16 border-t border-primary-200 dark:border-primary-800">
            <h2 className="text-2xl font-bold text-primary-950 dark:text-neutral-100 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}