import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>{' '}
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        Sorry, we couldn&apos;t find the product you&apos;re looking for. It may have been removed
        or the link might be incorrect.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/products">Browse All Products</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
