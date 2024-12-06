'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ShoppingCart, Search, User, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import SearchCommand from './search/SearchCommand';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        event.stopPropagation();
        setIsDropdownOpen(false);
      }
    }

    window.addEventListener('pointerdown', handleClickOutside, true);
    return () => {
      window.removeEventListener('pointerdown', handleClickOutside, true);
    };
  }, []);

  const handleUserIconClick = () => {
    if (!user) {
      window.location.href = '/auth/login';
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  const renderAuthLinks = () => {
    if (user) {
      if (user.role === 'CUSTOMER') {
        return (
          <>
            <Link
              href="/profile"
              className="px-6 py-3 hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full text-left px-6 py-3 hover:bg-gray-700"
            >
              Sign Out
            </button>
          </>
        );
      } else {
        return (
          <>
            <Link
              href={`/${user.role.toLowerCase()}/dashboard`}
              className="px-6 py-3 hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full text-left px-6 py-3 hover:bg-gray-700"
            >
              Sign Out
            </button>
          </>
        );
      }
    }

    return (
      <>
        <Link
          href="/auth/login"
          className="px-6 py-3 hover:bg-gray-700"
          onClick={() => setIsOpen(false)}
        >
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="px-6 py-3 hover:bg-gray-700"
          onClick={() => setIsOpen(false)}
        >
          Register
        </Link>
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

          {/* Desktop Navigation */}
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
            <div className="relative" ref={dropdownRef}>
              <button onClick={handleUserIconClick} className="hover:text-gray-300">
                <User className="h-6 w-6" />
              </button>
              {isDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  {user.role === 'CUSTOMER' ? (
                    <>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <UserCircle className="h-4 w-4" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/${user.role.toLowerCase()}/dashboard`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Icons */}
          <div className="flex items-center gap-4 md:hidden flex-1 justify-end">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link href="/cart" className="p-2 hover:bg-gray-700 rounded-full">
              <ShoppingCart className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-700">
            <div className="flex flex-col">
              <Link
                href="/products"
                className="flex items-center gap-2 px-6 py-3 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="flex items-center gap-2 px-6 py-3 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </Link>
              {renderAuthLinks()}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
