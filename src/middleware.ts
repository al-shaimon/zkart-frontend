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

  // Public routes - allow access
  if (
    pathname.startsWith('/_next') ||
    pathname === '/' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/categories')
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
    const baseRoute = pathname.split('/')[1]; // Get first part of path

    switch (decoded.role) {
      case 'CUSTOMER':
        // Customers can only access /profile
        if (baseRoute !== 'profile') {
          return NextResponse.redirect(new URL('/profile', request.url));
        }
        break;

      case 'VENDOR':
        // Vendors can only access /vendor routes
        if (baseRoute === 'profile' || baseRoute === 'admin') {
          return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
        }
        break;

      case 'ADMIN':
        // Admins can only access /admin routes
        if (baseRoute === 'profile' || baseRoute === 'vendor') {
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
    '/((?!_next|api|static|_vercel|favicon.ico|sitemap.xml).*)',
  ],
};
