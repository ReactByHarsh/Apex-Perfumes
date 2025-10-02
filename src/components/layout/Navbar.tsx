"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Moon, 
  Sun, 
  Menu, 
  X,
  ChevronDown 
} from 'lucide-react';
import { useThemeStore } from '@/stores/theme';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { theme, toggleTheme } = useThemeStore();
  const { openCart, getItemCount } = useCartStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const collections = [
    { name: "Men's", slug: 'men' },
    { name: "Women's", slug: 'women' },
    { name: 'Unisex', slug: 'unisex' },
    { name: 'Inspired Perfumes', slug: 'inspired' },
    { name: 'Our Creations', slug: 'creations' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collections/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-neutral-100 dark:bg-primary-950 border-b border-primary-200 dark:border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-2xl font-bold tracking-widest text-primary-950 dark:text-neutral-100 hover:text-accent-500 transition-colors"
            >
              APEX
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Collections Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center space-x-1"
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
              >
                <span>Collections</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {isCollectionsOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-primary-900 rounded-md shadow-lg border border-primary-200 dark:border-primary-800 py-1">
                  {collections.map(collection => (
                    <Link
                      key={collection.slug}
                      href={`/collections/${collection.slug}`}
                      className="block px-4 py-2 text-sm text-primary-900 dark:text-neutral-100 hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors"
                      onClick={() => setIsCollectionsOpen(false)}
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search fragrances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-400" />
              </div>
            </form>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {/* User menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User className="h-5 w-5" />
              </Button>
              
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-primary-900 rounded-md shadow-lg border border-primary-200 dark:border-primary-800 py-1">
                  {user ? (
                    <>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-primary-900 dark:text-neutral-100 hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-primary-900 dark:text-neutral-100 hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-2 text-sm text-primary-900 dark:text-neutral-100 hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="block px-4 py-2 text-sm text-primary-900 dark:text-neutral-100 hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 relative"
              onClick={openCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-primary-950 text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {getItemCount()}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-primary-200 dark:border-primary-800 py-4">
            <div className="space-y-4">
              {/* Mobile search */}
              <form onSubmit={handleSearch}>
                <Input
                  type="search"
                  placeholder="Search fragrances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* Mobile collections */}
              <div>
                <h3 className="font-medium text-primary-900 dark:text-neutral-100 mb-2">Collections</h3>
                <div className="space-y-2">
                  {collections.map(collection => (
                    <Link
                      key={collection.slug}
                      href={`/collections/${collection.slug}`}
                      className="block text-sm text-primary-700 dark:text-neutral-300 hover:text-accent-500 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}