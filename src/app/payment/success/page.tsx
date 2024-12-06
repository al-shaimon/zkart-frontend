'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { updatePaymentStatus, clearCart } from '@/redux/features/cartSlice';
import { toast } from 'sonner';

function PaymentStatusContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'success' | 'processing' | 'failed'>('processing');
  const [hasCheckedStatus, setHasCheckedStatus] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkPaymentStatus = async () => {
      if (hasCheckedStatus) return;
      setHasCheckedStatus(true);

      const paymentIntent = searchParams.get('payment_intent');
      const redirectStatus = searchParams.get('redirect_status');

      if (!paymentIntent) {
        setStatus('failed');
        toast.error('Payment verification failed');
        router.replace('/cart');
        return;
      }

      try {
        if (redirectStatus === 'succeeded') {
          await dispatch(
            updatePaymentStatus({
              paymentId: paymentIntent,
              paymentStatus: 'PAID',
            })
          ).unwrap();

          await dispatch(clearCart()).unwrap();

          toast.success('Payment successful! Thank you for your purchase.');
          setStatus('success');

          timeoutId = setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          throw new Error('Payment was not successful');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to verify payment status';

        toast.error(errorMessage);
        setStatus('failed');

        timeoutId = setTimeout(() => {
          router.push('/cart');
        }, 2000);
      }
    };

    checkPaymentStatus();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchParams, dispatch, router, hasCheckedStatus]);

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <div className="text-center space-y-6">
        {status === 'processing' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
            <h1 className="text-2xl font-bold">Processing Payment</h1>
            <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <p className="text-sm text-muted-foreground">Redirecting to home page in a moment...</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
            <h1 className="text-2xl font-bold">Payment Failed</h1>
            <p className="text-muted-foreground">Something went wrong with your payment.</p>
            <p className="text-sm text-muted-foreground">Redirecting to cart in a moment...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense 
      fallback={
        <div className="container max-w-md mx-auto px-4 py-16 text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto" />
          <p className="mt-4">Loading payment status...</p>
        </div>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}
