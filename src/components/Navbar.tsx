'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  UserCircle,
  ChevronDown,
  Store,
  Home,
  Tag,
  Newspaper,
  Phone,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import SearchCommand from './search/SearchCommand';
import CartIcon from './cart/CartIcon';
import { Category } from '@/types/api';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface NavbarProps {
  categories: Category[];
  loadingCategories?: boolean;
}

export default function Navbar({ categories, loadingCategories = false }: NavbarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
      router.push('/auth/login');
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  const handleCategoryClick = (categoryId: string) => {
    setIsMegaMenuOpen(false);
    setIsOpen(false);
    setIsMobileCategoriesOpen(false);
    router.push(`/products?category=${categoryId}`);
  };

  const handleProductClick = () => {
    setIsMegaMenuOpen(false);
    setIsOpen(false);
    setIsMobileCategoriesOpen(false);
    router.push('/products');
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
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        {/* Top Row */}
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Left Section with Logo and Mega Menu */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              ZKart
            </Link>
          </div>

          {/* Centered Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <SearchCommand isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Mobile Icons */}
            <div className="flex md:hidden items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-700 rounded-full"
              >
                <Search className="h-5 w-5" />
              </button>
              {user?.role === 'CUSTOMER' && (
                <Link href="/cart" className="p-2 hover:bg-gray-700 rounded-full">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-700 rounded-full"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-4">
              {user?.role === 'CUSTOMER' && <CartIcon />}
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
          </div>
        </div>

        {/* Bottom Row - Navigation Links */}
        <div className="hidden md:flex items-center justify-center h-12">
          <div className="flex items-center gap-8">
            {/* Categories Mega Menu - Desktop Only */}
            <div className="hidden md:block">
              <Popover open={isMegaMenuOpen} onOpenChange={setIsMegaMenuOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1 hover:text-gray-200">
                    <Tag className="h-4 w-4" />
                    All Categories
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isMegaMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[600px] p-0" align="start">
                  <div className="grid grid-cols-3 gap-4 p-6">
                    {loadingCategories ? (
                      <>
                        {[...Array(3)].map((_, index) => (
                          <div key={index} className="space-y-4">
                            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                            <div className="space-y-2">
                              {[...Array(3)].map((_, idx) => (
                                <div
                                  key={idx}
                                  className="h-4 w-32 bg-gray-200 rounded animate-pulse"
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : categories.length > 0 ? (
                      <>
                        {[0, 1, 2].map((columnIndex) => (
                          <div key={columnIndex}>
                            {categories
                              .slice(columnIndex * 4, (columnIndex + 1) * 4)
                              .map((category) => (
                                <div key={category.id} className="mb-4 group/item">
                                  <button
                                    onClick={() => handleCategoryClick(category.id)}
                                    className="w-full hover:text-primary flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-gray-50 group-hover/item:translate-x-1"
                                  >
                                    <div className="relative w-6 h-6 transition-transform duration-200 group-hover/item:scale-110">
                                      <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-contain"
                                      />
                                    </div>
                                    <span className="font-medium">{category.name}</span>
                                  </button>
                                </div>
                              ))}
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="col-span-3 text-center py-4 text-gray-500">
                        No categories available
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Link href="/" className="hover:text-gray-200 flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/products"
              onClick={handleProductClick}
              className="hover:text-gray-200 flex items-center gap-1"
            >
              <Tag className="h-4 w-4" />
              Products
            </Link>
            <Link href="/shops" className="hover:text-gray-200 flex items-center gap-1">
              <Store className="h-4 w-4" />
              Shops
            </Link>
            <Link href="/blog" className="hover:text-gray-200 flex items-center gap-1">
              <Newspaper className="h-4 w-4" />
              Blog
            </Link>
            <Link href="/contact" className="hover:text-gray-200 flex items-center gap-1">
              <Phone className="h-4 w-4" />
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-700">
          <div className="flex flex-col">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            {/* Mobile Categories Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileCategoriesOpen(!isMobileCategoriesOpen);
                }}
                className="flex items-center justify-between w-full px-6 py-3 hover:bg-gray-700"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Categories
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isMobileCategoriesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  isMobileCategoriesOpen ? 'max-h-[400px]' : 'max-h-0'
                }`}
              >
                <div className="bg-gray-800 py-2">
                  {loadingCategories ? (
                    <div className="px-8 py-3 space-y-2">
                      {[...Array(3)].map((_, idx) => (
                        <div key={idx} className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className="flex items-center gap-2 px-8 py-3 hover:bg-gray-700 w-full text-left"
                      >
                        <div className="relative w-6 h-6">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        {category.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-8 py-3 text-gray-400">No categories available</div>
                  )}
                </div>
              </div>
            </div>

            <Link
              href="/products"
              className="flex items-center gap-2 px-6 py-3 hover:bg-gray-700"
              onClick={() => handleProductClick()}
            >
              <Tag className="h-4 w-4" />
              Products
            </Link>
            <Link
              href="/shops"
              className="flex items-center gap-2 px-6 py-3 hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <Store className="h-4 w-4" />
              Shops
            </Link>
            <Link
              href="/blog"
              className="flex items-center gap-2 px-6 py-3 hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <Newspaper className="h-4 w-4" />
              Blog
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-6 py-3 hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <Phone className="h-4 w-4" />
              Contact
            </Link>
            {renderAuthLinks()}
          </div>
        </div>
      )}
    </nav>
  );
}
