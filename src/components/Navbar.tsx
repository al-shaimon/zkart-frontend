'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import SearchCommand from './search/SearchCommand';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const renderAuthLinks = () => {
    if (isAuthenticated && user) {
      return (
        <>
          <li>
            <Link href={`/${user.role.toLowerCase()}/dashboard`} className="hover:text-gray-300">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/profile" className="hover:text-gray-300">
              Profile
            </Link>
          </li>
        </>
      );
    }

    return (
      <>
        <li>
          <Link href="/login" className="hover:text-gray-300">
            Login
          </Link>
        </li>
        <li>
          <Link href="/register" className="hover:text-gray-300">
            Register
          </Link>
        </li>
      </>
    );
  };

  return (
    <nav className="bg-foreground text-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          <Link href="/" className="text-xl font-bold flex-shrink-0">
            ZKart
          </Link>

          <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
            <SearchCommand isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
          </div>

          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <Link href="/products" className="hover:text-gray-300">
              Products
            </Link>
            <Link href="/categories" className="hover:text-gray-300">
              Categories
            </Link>
            <Link href="/cart" className="hover:text-gray-300">
              <ShoppingCart className="h-6 w-6" />
            </Link>
            <Link href="/account" className="hover:text-gray-300">
              <User className="h-6 w-6" />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden flex-1 justify-end">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-gray-700">
            <div className="py-2 space-y-1">
              <Link href="/products" className="block px-4 py-2 hover:bg-gray-700 rounded-md">
                Products
              </Link>
              <Link href="/categories" className="block px-4 py-2 hover:bg-gray-700 rounded-md">
                Categories
              </Link>
              <Link href="/cart" className="block px-4 py-2 hover:bg-gray-700 rounded-md">
                Cart
              </Link>
              {renderAuthLinks()}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
