'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_BASE_URL } from '@/config/api';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NewsLetterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setEmail('');
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Failed to subscribe to newsletter');
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="py-12 px-4 bg-primary rounded-lg text-primary-foreground my-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-primary-foreground/90 mb-6">
          Subscribe to our newsletter and get the latest updates on new products, special offers,
          and exclusive deals.
        </p>
        <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="bg-white text-foreground"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button variant="secondary" type="submit" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </div>
    </section>
  );
}
