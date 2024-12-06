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

interface CartState {
  id: string | null;
  items: CartItem[];
  shopId: string | null;
  loading: boolean;
  error: string | null;
  totalAmount: number;
}

const initialState: CartState = {
  id: null,
  items: [],
  shopId: null,
  loading: false,
  error: null,
  totalAmount: 0,
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
    totalAmount: 0,
    ...data.data
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

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (itemId: string) => {
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
  }
);

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
        state.totalAmount = action.payload.totalAmount;
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
        state.totalAmount = action.payload.totalAmount;
      })
      // Update Quantity
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const updatedItems = action.payload.items;
        state.items = state.items.map(item => {
          const updatedItem = updatedItems.find(i => i.id === item.id);
          return updatedItem || item;
        });
        state.totalAmount = action.payload.totalAmount;
      })
      // Remove Item
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.items.length === 0) {
          state.shopId = null;
        }
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.id = null;
        state.items = [];
        state.shopId = null;
        state.totalAmount = 0;
      });
  },
});

export default cartSlice.reducer;