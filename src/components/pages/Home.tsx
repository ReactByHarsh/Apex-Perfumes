"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Truck, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/commerce/ProductCard';
import { getFeaturedProducts } from '@/lib/supabase/products';
import type { Product } from '@/types';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const { newProducts: newItems, bestSellers } = await getFeaturedProducts();
        
        // Convert Supabase products to app Product type
        const convertProduct = (p: any): Product => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          price: p.price,
          originalPrice: p.original_price,
          images: p.images || [],
          category: p.category,
          type: p.type,
          notes: p.notes,
          longevity: p.longevity,
          sillage: p.sillage,
          rating: p.rating,
          stock: p.stock,
          description: p.description,
          isNew: p.is_new,
          isBestSeller: p.is_best_seller,
          isOnSale: p.is_on_sale,
        });

        setNewProducts(newItems.slice(0, 4).map(convertProduct));
        setFeaturedProducts(bestSellers.slice(0, 4).map(convertProduct));
      } catch (error) {
        console.error('Failed to load featured products:', error);
        // Fallback to empty arrays
        setFeaturedProducts([]);
        setNewProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const categories = [
    {
      name: 'Men\'s Collection',
      slug: 'men',
      image: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Bold and sophisticated fragrances for the modern man'
    },
    {
      name: 'Women\'s Collection',
      slug: 'women',
      image: 'https://images.pexels.com/photos/1188440/pexels-photo-1188440.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Elegant and captivating scents for every occasion'
    },
    {
      name: 'Unisex Collection',
      slug: 'unisex',
      image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Versatile fragrances that transcend boundaries'
    },
    {
      name: 'Solid Perfumes',
      slug: 'solid',
      image: 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Concentrated luxury in portable form'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'The quality is exceptional. Royal Rose has become my signature scent.'
    },
    {
      name: 'Michael Chen',
      rating: 5,
      comment: 'Forest King is incredible. The longevity is amazing and I get compliments daily.'
    },
    {
      name: 'Emma Rodriguez',
      rating: 5,
      comment: 'Love the variety and quality. APEX fragrances are truly luxury.'
    }
  ];

  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Carefully crafted with the finest ingredients'
    },
    {
      icon: Shield,
      title: 'Authentic Products',
      description: '100% genuine fragrances with quality guarantee'
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Complimentary shipping on orders over $100'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-950 dark:to-primary-900">
        <div className="text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-wider text-primary-950 dark:text-neutral-100 mb-6">
            APEX
          </h1>
          <p className="text-xl md:text-2xl text-primary-700 dark:text-neutral-300 mb-8 tracking-wide">
            Where luxury meets artistry in every bottle
          </p>
          <p className="text-lg text-primary-600 dark:text-neutral-400 mb-12 max-w-2xl mx-auto">
            Discover our curated collection of premium fragrances, 
            each one a masterpiece designed to elevate your presence and express your unique essence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/collections/all">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/about">Learn Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-neutral-100 dark:bg-primary-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-950 dark:text-neutral-100 mb-4 tracking-wide">
              Bestselling Fragrances
            </h2>
            <p className="text-lg text-primary-600 dark:text-neutral-400">
              Our most loved scents, chosen by connoisseurs worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-primary-900 rounded-lg shadow-md p-4 animate-pulse">
                  <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          
          <div className="text-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/collections/all">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-950 dark:text-neutral-100 mb-4 tracking-wide">
              Explore Collections
            </h2>
            <p className="text-lg text-primary-600 dark:text-neutral-400">
              Find your perfect fragrance across our curated collections
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className="group relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 px-4 bg-neutral-100 dark:bg-primary-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-950 dark:text-neutral-100 mb-4 tracking-wide">
              New Arrivals
            </h2>
            <p className="text-lg text-primary-600 dark:text-neutral-400">
              Fresh additions to our luxury fragrance collection
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-primary-900 rounded-lg shadow-md p-4 animate-pulse">
                  <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              newProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-950 dark:text-neutral-100 mb-8 tracking-wide">
            The APEX Story
          </h2>
          <p className="text-lg text-primary-700 dark:text-neutral-300 mb-8 leading-relaxed">
            Founded on the belief that fragrance is the ultimate form of self-expression, 
            APEX creates distinctive scents that capture the essence of luxury and sophistication. 
            Each fragrance in our collection is meticulously crafted using the finest ingredients 
            sourced from around the world, resulting in complex, long-lasting compositions that 
            evolve beautifully on your skin.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/about">Read More</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-neutral-100 dark:bg-primary-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 dark:bg-accent-900 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="text-xl font-semibold text-primary-950 dark:text-neutral-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-primary-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-950 dark:text-neutral-100 mb-4 tracking-wide">
              What Our Customers Say
            </h2>
            <p className="text-lg text-primary-600 dark:text-neutral-400">
              Join thousands of satisfied fragrance enthusiasts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-primary-900 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-primary-700 dark:text-neutral-300 mb-4">
                  "{testimonial.comment}"
                </p>
                <p className="font-semibold text-primary-950 dark:text-neutral-100">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}