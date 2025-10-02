"use client";
import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary-950 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="text-2xl font-bold tracking-widest text-accent-500">
              APEX
            </Link>
            <p className="mt-4 text-neutral-300 text-sm">
              Luxury fragrances crafted for the discerning individual. Experience the art of scent.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-neutral-400 hover:text-accent-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-accent-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-accent-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-semibold text-neutral-100 mb-4">Collections</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/collections/men" className="text-neutral-300 hover:text-accent-500 transition-colors">Men's Fragrances</Link></li>
              <li><Link href="/collections/women" className="text-neutral-300 hover:text-accent-500 transition-colors">Women's Fragrances</Link></li>
              <li><Link href="/collections/unisex" className="text-neutral-300 hover:text-accent-500 transition-colors">Unisex Collection</Link></li>
              <li><Link href="/collections/inspired" className="text-neutral-300 hover:text-accent-500 transition-colors">Inspired Perfumes</Link></li>
              <li><Link href="/collections/creations" className="text-neutral-300 hover:text-accent-500 transition-colors">Our Creations</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-neutral-100 mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-neutral-300 hover:text-accent-500 transition-colors">Contact Us</Link></li>
              <li><Link href="/about" className="text-neutral-300 hover:text-accent-500 transition-colors">About APEX</Link></li>
              <li><a href="#" className="text-neutral-300 hover:text-accent-500 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-accent-500 transition-colors">Returns & Exchanges</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-neutral-100 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-neutral-300 hover:text-accent-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-neutral-300 hover:text-accent-500 transition-colors">Terms of Service</Link></li>
              <li><a href="#" className="text-neutral-300 hover:text-accent-500 transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-8 pt-8 text-center text-sm text-neutral-400">
          <p>&copy; {new Date().getFullYear()} APEX Fragrances. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}