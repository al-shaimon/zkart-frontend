import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '@/config/api';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  shop?: {
    id: string;
    name: string;
  };
}

interface CartItem {
  id: string;
  quantity: number;
  cartId: string;
  productId: string;
  product: Product;
}

interface Coupon {
  code: string;
  discount: number;
  usageLimit: number;
  discountType: 'UPTO' | 'FLAT';
  discountMessage: string;
}

interface CartState {
  id: string | null;
  items: CartItem[];
  shopId: string | null;
  loading: boolean;
  error: string | null;
  finalAmount: number;
  originalAmount: number;
  discount: number;
  coupon: Coupon | null;
}

const initialState: CartState = {
  id: null,
  items: [],
  shopId: null,
  loading: false,
  error: null,
  finalAmount: 0,
  originalAmount: 0,
  discount: 0,
  coupon: null,
};

// Helper function to get token
const getToken = () => localStorage.getItem('token');

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: {
      Authorization: token || '',
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return {
    id: null,
    items: [],
    shopId: null,
    finalAmount: 0,
    ...data.data,
  };
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/cart/add-to-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token || '',
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token || '',
      },
      body: JSON.stringify({ quantity }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
  }
);

export const removeFromCart = createAsyncThunk('cart/removeItem', async (itemId: string) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: token || '',
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return itemId;
});

export const clearCart = createAsyncThunk('cart/clear', async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/cart/clear`, {
    method: 'DELETE',
    headers: {
      Authorization: token || '',
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.data;
});

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (code: string) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/order/apply-coupon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token || '',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.items = action.payload.items;
        state.shopId = action.payload.shopId;
        state.finalAmount = action.payload.finalAmount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.items = action.payload.items;
        state.shopId = action.payload.shopId;
        state.finalAmount = action.payload.finalAmount;
      })
      // Update Quantity
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const updatedItems = action.payload.items;
        state.items = state.items.map((item) => {
          const updatedItem = updatedItems.find((i: CartItem) => i.id === item.id);
          return updatedItem || item;
        });
        state.finalAmount = action.payload.finalAmount;
      })
      // Remove Item
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.items.length === 0) {
          state.shopId = null;
        }
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.id = null;
        state.items = [];
        state.shopId = null;
        state.finalAmount = 0;
        state.originalAmount = 0;
        state.discount = 0;
        state.coupon = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.originalAmount = action.payload.originalAmount;
        state.discount = action.payload.discount;
        state.finalAmount = action.payload.finalAmount;
        state.coupon = action.payload.coupon;
      });
  },
});

export default cartSlice.reducer;
