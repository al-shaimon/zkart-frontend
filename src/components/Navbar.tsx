'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
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
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            ZKart
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/products"
                className="block px-3 py-2 rounded-md hover:bg-gray-700"
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="block px-3 py-2 rounded-md hover:bg-gray-700"
              >
                Categories
              </Link>
              <Link
                href="/cart"
                className="block px-3 py-2 rounded-md hover:bg-gray-700"
              >
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
