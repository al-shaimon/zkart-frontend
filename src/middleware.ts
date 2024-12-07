import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  email: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  exp: number;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Public routes that don't require authentication
  if (
    pathname.startsWith('/_next') ||
    pathname === '/' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/categories') ||
    pathname.startsWith('/shop') ||
    pathname.startsWith('/flash-sale')
    // ||
    // pathname.startsWith('/payment')
  ) {
    return NextResponse.next();
  }

  // Protected routes - check auth
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    // Check token expiration
    if (decoded.exp * 1000 < Date.now()) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    // Role-based route protection
    switch (decoded.role) {
      case 'CUSTOMER':
        // Customers can access:
        // - /profile (their profile)
        // - /orders (their order history)
        // - /cart (their shopping cart)
        // - /compare (product comparison)
        // - /recent-products (recently viewed)
        if (!pathname.match(/^\/(?:profile|orders|cart|payment|compare|order|recent-products)/)) {
          return NextResponse.redirect(new URL('/profile', request.url));
        }
        break;

      case 'VENDOR':
        // Vendors can only access /vendor routes
        if (!pathname.startsWith('/vendor')) {
          return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
        }
        break;

      case 'ADMIN':
        // Admins can only access /admin routes
        if (!pathname.startsWith('/admin')) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        break;

      default:
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next (Next.js internals)
     * 2. /api (API routes)
     * 3. /static (static files)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!_next|api|static|_vercel|favicon.ico|sitemap.xml).*)',
  ],
};
