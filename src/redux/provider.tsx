'use client';

import { Provider } from 'react-redux';
import { makeStore } from './store';
import { useRef } from 'react';
import { Store } from '@reduxjs/toolkit';

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<Store>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
} 